import { z } from "zod";
import { counties, offices, services } from "@/lib/directory";

export const captchaSchema = z.object({
  captchaToken: z.string().min(1).max(4096),
  captchaVersion: z.enum(["v3", "v2"]).default("v3"),
});
const email = z
  .string()
  .trim()
  .max(254)
  .email()
  .transform((v) => v.toLowerCase());
const name = z.string().trim().min(2).max(100);
const phone = z
  .string()
  .trim()
  .min(7)
  .max(30)
  .regex(/^[+\d\s()\-]+$/, "Enter a valid phone number");
const county = z
  .string()
  .refine(
    (v) => (counties as readonly string[]).includes(v),
    "Choose a county",
  );
export const registerSchema = z.object({
  name,
  email,
  password: z.string().min(10).max(128),
  phone,
  county,
});
export const requestSchema = z
  .object({
    service: z
      .string()
      .refine((v) => services.some((s) => s.slug === v), "Choose a service"),
    county,
    name,
    phone,
    email,
    nationalId: z.string().trim().max(30).optional().default(""),
    description: z.string().trim().min(15).max(3000),
    office: z.string().max(100).optional().default(""),
  })
  .refine(
    (v) =>
      !v.office ||
      offices.some((o) => o.slug === v.office && o.county === v.county),
    { message: "Choose an office in your selected county", path: ["office"] },
  );
export const messageSchema = z.object({
  requestId: z.string().uuid(),
  message: z.string().trim().min(1).max(2000),
});
export const requestIdSchema = z.object({ requestId: z.string().uuid() });
export const trackSchema = z.object({
  ref: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^SC-\d{4}-[A-F0-9]{12}$/),
});
export const enquirySchema = z.object({
  name,
  email,
  message: z.string().trim().min(10).max(3000),
});
export const suggestionSchema = z.object({
  name,
  email,
  office: z.string().trim().min(2).max(150),
  correction: z.string().trim().min(10).max(2000),
});
