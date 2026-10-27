// Operator-only assisted erasure. Verify the requester's identity out of band.
// Run with production environment variables loaded. No secrets are printed.
import { kv } from "@vercel/kv";
import { del } from "@vercel/blob";
import { createHash, randomUUID } from "node:crypto";
const args = process.argv.slice(2),
  find = (flag) => {
    const i = args.indexOf(flag);
    return i < 0 ? "" : args[i + 1] || "";
  };
const email = find("--email").trim().toLowerCase(),
  reference = find("--reference").trim().toUpperCase(),
  confirm = args.includes("--confirm-delete");
if (
  (!email && !reference) ||
  (email && reference) ||
  !process.env.KV_REST_API_URL ||
  !process.env.KV_REST_API_TOKEN
) {
  console.error(
    "Usage: node --env-file=.env.local scripts/erase-resident.mjs (--email address | --reference SC-YYYY-XXXXXXXXXXXX) [--confirm-delete]",
  );
  process.exit(1);
}
let residentKey = "",
  ownerId = "";
if (email) {
  residentKey = `resident:email:${createHash("sha256").update(email).digest("hex")}`;
  const resident = await kv.get(residentKey);
  if (!resident) {
    console.error("Resident not found.");
    process.exit(1);
  }
  ownerId = resident.id;
} else {
  const id = await kv.get(`request:ref:${reference}`);
  const record = id && (await kv.get(`request:${id}`));
  if (!record) {
    console.error("Request not found.");
    process.exit(1);
  }
  ownerId = record.ownerId;
}
const ids = await kv.lrange(`request:owner:${ownerId}`, 0, -1);
console.log(
  `Found ${ids.length} request record(s). ${residentKey ? "The password account will also be deleted." : "The owner associated with the reference will be erased; use --email separately for any password account."}`,
);
if (!confirm) {
  console.log(
    "Dry run only. Verify identity and add --confirm-delete to proceed.",
  );
  process.exit(0);
}
// Block already-issued sessions for longer than their 30-day maximum lifetime.
const revokeKey = `session:revoked:${createHash("sha256").update(ownerId).digest("hex")}`;
await kv.set(revokeKey, Date.now(), { ex: 31 * 86400 });
let deleted = 0;
for (const id of ids) {
  const lock = `request:lock:${id}`,
    token = randomUUID();
  if ((await kv.set(lock, token, { nx: true, ex: 120 })) !== "OK")
    throw new Error("A request is being updated; retry erasure later.");
  try {
    const record = await kv.get(`request:${id}`);
    if (!record) continue;
    if (record.ownerId !== ownerId) throw new Error("Request owner mismatch.");
    if (record.documents?.length && !process.env.BLOB_READ_WRITE_TOKEN)
      throw new Error("Blob storage is not configured.");
    await Promise.all(
      (record.documents || []).map((file) => del(file.pathname)),
    );
    await kv
      .multi()
      .del(
        `request:${id}`,
        `request:ref:${record.reference}`,
        `request:messages:${id}`,
      )
      .lrem(`request:owner:${ownerId}`, 0, id)
      .zrem("retention:closed", id)
      .exec();
    deleted++;
  } finally {
    await kv
      .eval(
        "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
        [lock],
        [token],
      )
      .catch(() => undefined);
  }
}
if (residentKey) await kv.del(residentKey);
await kv.del(`request:owner:${ownerId}`);
console.log(
  `Deleted ${deleted} request record(s) and the associated stored account data. Provider backups may remain temporarily.`,
);
