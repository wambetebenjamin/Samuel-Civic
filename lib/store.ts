import "server-only";
import { kv } from "@vercel/kv";
import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
export const storageReady = () =>
  Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
export type Resident = {
  id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
  passwordHash: string;
  createdAt: string;
};
export type DocumentRecord = {
  id: string;
  name: string;
  contentType: string;
  pathname: string;
  size: number;
};
export type RequestStatus = "Submitted" | "In review" | "Needs info" | "Closed";
export type RequestRecord = {
  id: string;
  reference: string;
  ownerId: string;
  service: string;
  county: string;
  office: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  description: string;
  documents: DocumentRecord[];
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};
export type RequestMessage = {
  id: string;
  author: "Resident" | "Samuel Civic";
  text: string;
  createdAt: string;
};
export const sessionRevocationKey = (ownerId: string) =>
  `session:revoked:${createHash("sha256").update(ownerId).digest("hex")}`;
export async function sessionRevokedAt(ownerId: string) {
  return (await kv.get<number>(sessionRevocationKey(ownerId))) || 0;
}
export const keyEmail = (email: string) =>
  `resident:email:${createHash("sha256").update(email.trim().toLowerCase()).digest("hex")}`;
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  try {
    const [s, h] = stored.split(":");
    const expected = Buffer.from(h, "hex");
    if (expected.length !== 64) return false;
    const actual = (await scrypt(
      password,
      Buffer.from(s, "hex"),
      64,
    )) as Buffer;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
export const getResident = async (email: string) =>
  storageReady() ? kv.get<Resident>(keyEmail(email)) : null;
export async function registerResident(
  input: Omit<Resident, "id" | "passwordHash" | "createdAt"> & {
    password: string;
  },
) {
  const user: Resident = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    county: input.county,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  return (await kv.set(keyEmail(user.email), user, { nx: true })) === "OK";
}
export async function rateLimit(key: string, max: number, seconds: number) {
  const safeKey = createHash("sha256").update(key).digest("hex");
  const count = await kv.eval<[number], number>(
    "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
    [`rate:${safeKey}`],
    [seconds],
  );
  return count <= max;
}
export function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
    .trim()
    .slice(0, 100);
}
export async function getRequest(id: string) {
  return storageReady() ? kv.get<RequestRecord>(`request:${id}`) : null;
}
export async function getRequestByReference(reference: string) {
  const id = await kv.get<string>(`request:ref:${reference}`);
  return id ? getRequest(id) : null;
}
export async function getOwnerRequests(ownerId: string) {
  if (!storageReady()) return [];
  const ids = await kv.lrange<string>(`request:owner:${ownerId}`, 0, -1);
  if (!ids.length) return [];
  const records = await Promise.all(ids.map((id) => getRequest(id)));
  return records.filter(
    (r): r is RequestRecord => !!r && r.ownerId === ownerId,
  );
}
export async function getMessages(id: string) {
  return storageReady()
    ? await kv.lrange<RequestMessage>(`request:messages:${id}`, 0, -1)
    : [];
}
export async function createRequest(
  data: Omit<
    RequestRecord,
    "id" | "reference" | "status" | "createdAt" | "updatedAt"
  >,
) {
  const id = randomUUID();
  const now = new Date().toISOString();
  let reference = "";
  for (let i = 0; i < 5; i++) {
    const candidate = `SC-${new Date().getUTCFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`;
    if ((await kv.set(`request:ref:${candidate}`, id, { nx: true })) === "OK") {
      reference = candidate;
      break;
    }
  }
  if (!reference) throw new Error("Could not generate reference");
  const record: RequestRecord = {
    ...data,
    id,
    reference,
    status: "Submitted",
    createdAt: now,
    updatedAt: now,
  };
  try {
    await kv
      .multi()
      .set(`request:${id}`, record)
      .lpush(`request:owner:${data.ownerId}`, id)
      .exec();
  } catch (error) {
    await kv.del(`request:ref:${reference}`).catch(() => undefined);
    throw error;
  }
  return record;
}
export async function saveRequest(record: RequestRecord) {
  await kv.set(`request:${record.id}`, record);
}
// A short, token-owned lock serializes updates to a single request. A crashed
// function releases the lock through expiry; only its holder can release it.
export class RequestBusyError extends Error {}
export async function withRequestLock<T>(
  id: string,
  callback: () => Promise<T>,
): Promise<T> {
  const lock = `request:lock:${id}`,
    token = randomUUID();
  if ((await kv.set(lock, token, { nx: true, ex: 120 })) !== "OK")
    throw new RequestBusyError("Request is being updated");
  try {
    return await callback();
  } finally {
    await kv
      .eval<
        [string],
        number
      >("if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end", [lock], [token])
      .catch(() => undefined);
  }
}
export async function addMessage(record: RequestRecord, text: string) {
  const message: RequestMessage = {
    id: randomUUID(),
    author: "Resident",
    text,
    createdAt: new Date().toISOString(),
  };
  await kv
    .multi()
    .rpush(`request:messages:${record.id}`, message)
    .set(`request:${record.id}`, { ...record, updatedAt: message.createdAt })
    .exec();
  return message;
}
export const RETENTION_DAYS = 90;
export async function closeRequest(record: RequestRecord) {
  const now = new Date();
  const closed = {
    ...record,
    status: "Closed" as const,
    updatedAt: now.toISOString(),
  };
  await kv
    .multi()
    .set(`request:${record.id}`, closed)
    .zadd("retention:closed", {
      score: now.getTime() + RETENTION_DAYS * 86400000,
      member: record.id,
    })
    .exec();
}
export async function dueForRetention() {
  return kv.zrange<string[]>("retention:closed", 0, Date.now(), {
    byScore: true,
    offset: 0,
    count: 100,
  });
}
export async function removeRequestRecords(record: RequestRecord) {
  await kv
    .multi()
    .del(
      `request:${record.id}`,
      `request:ref:${record.reference}`,
      `request:messages:${record.id}`,
    )
    .lrem(`request:owner:${record.ownerId}`, 0, record.id)
    .zrem("retention:closed", record.id)
    .exec();
}
export async function forgetRetentionIndex(id: string) {
  await kv.zrem("retention:closed", id);
}
