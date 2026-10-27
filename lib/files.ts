import "server-only";
import { put, del, get } from "@vercel/blob";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "node:crypto";
import type { DocumentRecord } from "@/lib/store";

export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 3 * 1024 * 1024;
function key() {
  const raw = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!raw) throw new Error("Document encryption is not configured");
  const result = Buffer.from(raw, "base64");
  if (result.length !== 32)
    throw new Error("Document encryption key must be 32 bytes");
  return result;
}
export function privateTextReady() {
  try {
    return Boolean(key());
  } catch {
    return false;
  }
}
export function encryptPrivateText(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const bytes = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `v1:${Buffer.concat([iv, cipher.getAuthTag(), bytes]).toString("base64")}`;
}
export function uploadsReady() {
  try {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN && key());
  } catch {
    return false;
  }
}
export async function checkFiles(files: File[]) {
  if (
    files.length > MAX_FILES ||
    files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES
  )
    throw new Error(
      "Upload up to three files, with a combined size of 3 MB or less.",
    );
  for (const file of files) {
    if (!file.size || !["application/pdf", "image/jpeg"].includes(file.type))
      throw new Error("Only PDF and JPG files are accepted.");
    const header = Buffer.from(await file.slice(0, 5).arrayBuffer());
    const pdf = header.subarray(0, 5).toString() === "%PDF-";
    const jpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    if (
      !(
        (file.type === "application/pdf" && pdf) ||
        (file.type === "image/jpeg" && jpeg)
      )
    )
      throw new Error("One file does not match its declared PDF or JPG type.");
  }
}
export async function uploadFiles(files: File[]): Promise<DocumentRecord[]> {
  await checkFiles(files);
  if (!files.length) return [];
  if (!uploadsReady())
    throw new Error("Secure document storage is not configured.");
  const saved: DocumentRecord[] = [];
  try {
    for (const file of files) {
      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", key(), iv);
      const content = Buffer.from(await file.arrayBuffer());
      const encrypted = Buffer.concat([
        iv,
        cipher.update(content),
        cipher.final(),
        cipher.getAuthTag(),
      ]);
      const id = randomUUID();
      const blob = await put(`requests/${id}.bin`, encrypted, {
        access: "private",
        contentType: "application/octet-stream",
        addRandomSuffix: false,
      });
      saved.push({
        id,
        name: file.name.replace(/[^\w. -]/g, "_").slice(0, 100) || "document",
        contentType: file.type,
        pathname: blob.pathname,
        size: file.size,
      });
    }
    return saved;
  } catch (error) {
    await Promise.all(saved.map((f) => del(f.pathname).catch(() => undefined)));
    throw error;
  }
}
export async function deleteFilesStrict(files: DocumentRecord[]) {
  await Promise.all(files.map((f) => del(f.pathname)));
}
export async function removeFiles(files: DocumentRecord[]) {
  await Promise.all(files.map((f) => del(f.pathname).catch(() => undefined)));
}
export async function downloadFile(file: DocumentRecord) {
  const blob = await get(file.pathname, { access: "private", useCache: false });
  if (!blob || blob.statusCode !== 200) return null;
  const encrypted = Buffer.from(await new Response(blob.stream).arrayBuffer());
  if (encrypted.length < 28) throw new Error("Invalid encrypted file");
  const iv = encrypted.subarray(0, 12),
    tag = encrypted.subarray(encrypted.length - 16),
    bytes = encrypted.subarray(12, encrypted.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(bytes), decipher.final()]);
}
