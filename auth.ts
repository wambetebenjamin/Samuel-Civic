import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { z } from "zod";
import { verifyCaptcha } from "@/lib/captcha";
import { authReady } from "@/lib/auth-config";
import {
  getResident,
  rateLimit,
  requestIp,
  sessionRevokedAt,
  storageReady,
  verifyPassword,
} from "@/lib/store";

class CaptchaRequired extends CredentialsSignin {
  code = "captcha_required";
}
class CaptchaUnavailable extends CredentialsSignin {
  code = "captcha_unavailable";
}
const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      captchaToken: {},
      captchaVersion: {},
    },
    async authorize(credentials, request) {
      const captcha = await verifyCaptcha(credentials, "login");
      if (!captcha.ok) {
        if (captcha.requireV2) throw new CaptchaRequired();
        throw new CaptchaUnavailable();
      }
      const parsed = z
        .object({
          email: z
            .string()
            .trim()
            .max(254)
            .email()
            .transform((v) => v.toLowerCase()),
          password: z.string().min(1).max(128),
        })
        .safeParse(credentials);
      if (!parsed.success || !storageReady() || !authReady()) return null;
      if (
        !(await rateLimit(
          `login:${requestIp(request)}:${parsed.data.email}`,
          10,
          900,
        ))
      )
        return null;
      const resident = await getResident(parsed.data.email);
      if (
        !resident ||
        !(await verifyPassword(parsed.data.password, resident.passwordHash))
      )
        return null;
      return { id: resident.id, name: resident.name, email: resident.email };
    },
  }),
];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: { scope: "openid profile email" },
      },
    }),
  );
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers,
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ account, profile }) {
      return (
        account?.provider !== "google" ||
        (profile as { email_verified?: boolean } | undefined)
          ?.email_verified === true
      );
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        token.residentId =
          account.provider === "google"
            ? `google:${account.providerAccountId}`
            : user.id;
        token.sessionCreated = Date.now();
        token.identityProvider = account.provider;
      }
      if (
        typeof token.residentId !== "string" ||
        typeof token.sessionCreated !== "number" ||
        !storageReady()
      )
        return null;
      try {
        if ((await sessionRevokedAt(token.residentId)) >= token.sessionCreated)
          return null;
        if (token.identityProvider === "credentials") {
          const resident =
            typeof token.email === "string"
              ? await getResident(token.email)
              : null;
          if (!resident || resident.id !== token.residentId) return null;
        }
        return token;
      } catch {
        return null;
      }
    },
    async session({ session, token }) {
      if (session.user && typeof token.residentId === "string")
        session.user.id = token.residentId;
      return session;
    },
  },
});
export async function getSession() {
  if (!authReady()) return null;
  try {
    return await auth();
  } catch {
    return null;
  }
}
