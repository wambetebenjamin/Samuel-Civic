import "server-only";
export class PayloadTooLargeError extends Error {}
// Limit bytes while reading, even when Content-Length is absent or dishonest.
export async function readLimited(
  request: Request,
  max: number,
): Promise<Uint8Array> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > max)
    throw new PayloadTooLargeError("Payload too large");
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > max) {
        await reader.cancel();
        throw new PayloadTooLargeError("Payload too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
export async function limitedFormData(request: Request, max = 3_500_000) {
  const bytes = await readLimited(request, max);
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().startsWith("multipart/form-data;"))
    throw new Error("Invalid form");
  return new Response(bytes, { headers: { "Content-Type": type } }).formData();
}
