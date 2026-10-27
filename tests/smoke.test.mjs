import test from "node:test";
import assert from "node:assert/strict";

// Start the app first; override TEST_BASE_URL for a different running instance.
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const pages = [
  ["/", "Find the right county office"],
  ["/services", "Find a county service"],
  ["/services/business-permit-enquiry", "Business permit enquiry"],
  ["/offices", "Find an office"],
  ["/offices/nairobi-general-enquiries", "Nairobi County general enquiries"],
  ["/guides", "Guides"],
  [
    "/guides/business-permit-enquiry",
    "Getting ready to ask about a business permit",
  ],
  ["/track", "Track a request"],
  ["/login", "Sign in"],
  ["/register", "Create an account"],
  ["/about", "A clearer place to start"],
  ["/legal/privacy-policy", "Privacy policy"],
  ["/legal/terms", "Terms of use"],
  ["/legal/cookie-policy", "Cookie policy"],
];
for (const [path, title] of pages)
  test(`public page ${path}`, async () => {
    const res = await fetch(base + path);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes(title), `missing ${title}`);
    assert.ok(
      html.includes(
        "Samuel Civic is an independent information and request-tracking tool.",
      ),
    );
  });
for (const path of [
  "/a-page-that-does-not-exist",
  "/services/not-a-real-service",
  "/offices/not-a-real-office",
  "/guides/not-a-real-guide",
])
  test(`unknown path ${path} has a branded 404`, async () => {
    const res = await fetch(base + path);
    assert.equal(res.status, 404);
    assert.match(await res.text(), /We could not find that page/);
  });
test("unauthenticated session does not expose a user", async () => {
  const res = await fetch(base + "/api/session");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { signedIn: false });
});
for (const path of [
  "/api/auth/register",
  "/api/requests/create",
  "/api/requests/message",
  "/api/requests/upload",
  "/api/requests/close",
  "/api/send-enquiry",
  "/api/offices/suggest",
])
  test(`${path} rejects an unverified POST`, async () => {
    const res = await fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    assert.ok(res.status >= 400, `${path} unexpectedly returned ${res.status}`);
  });
test("NextAuth does not allow a direct Google sign-in without a CAPTCHA permit", async () => {
  const res = await fetch(base + "/api/auth/signin/google", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "",
  });
  assert.equal(res.status, 403);
});
test("retention endpoint rejects unauthenticated calls", async () => {
  const res = await fetch(base + "/api/cron/retention");
  assert.equal(res.status, 401);
});
