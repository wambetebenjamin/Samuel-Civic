import "server-only";
import nodemailer from "nodemailer";
export function mailReady() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}
export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  if (!mailReady()) throw new Error("Email is not configured");
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid SMTP port");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  await transport.sendMail({ from: process.env.SMTP_FROM, ...input });
}
