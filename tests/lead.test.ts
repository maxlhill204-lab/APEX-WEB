import { strict as assert } from "node:assert";
import { emptyLead, parseLead } from "../lib/lead";
import { emailContent } from "../lib/lead-email";
import handler from "../pages/api/quote";
import type { NextApiRequest, NextApiResponse } from "next";
const valid = {
  ...emptyLead,
  business: "APEXWEB QA",
  description: "A test business enquiry for validation.",
  name: "QA Test",
  email: "apexweb.au@gmail.com",
  consent: true,
  requestId: "00000000-0000-4000-8000-000000000001",
  submittedAt: "2026-09-10T04:00:00.000Z",
};
const results: string[] = [];
function test(name: string, fn: () => void) {
  fn();
  results.push(name);
}
test("accepts a complete enquiry", () => assert.ok(parseLead(valid).lead));
test("rejects missing required fields", () =>
  assert.ok(
    parseLead({ ...valid, business: "", name: "", email: "bad" }).errors.email,
  ));
test("rejects unsupported URL protocols", () =>
  assert.ok(
    parseLead({ ...valid, website: "javascript:alert(1)" }).errors.website,
  ));
test("rejects unlisted packages and options", () =>
  assert.ok(
    parseLead({ ...valid, package: "free", features: ["admin"] }).errors
      .package,
  ));
test("requires phone when requested", () =>
  assert.ok(parseLead({ ...valid, contact: "Phone", phone: "" }).errors.phone));
test("requires explicit contact consent", () =>
  assert.ok(parseLead({ ...valid, consent: false }).errors.consent));
test("bounds oversized content", () =>
  assert.ok(parseLead({ ...valid, notes: "x".repeat(3001) }).errors.notes));
test("rejects invalid types without throwing", () =>
  assert.ok(
    parseLead({ ...valid, name: { bad: true }, features: "bad" }).errors.name,
  ));
test("email HTML escapes user content", () => {
  const email = emailContent(
    { ...valid, business: "<img src=x onerror=alert(1)>" },
    "AW-test",
  );
  assert.ok(!email.businessHtml.includes("<img"));
  assert.ok(email.businessHtml.includes("&lt;img"));
  assert.ok(email.confirmationHtml.includes("&lt;img"));
});
test("annual hosting survives validation and email formatting", () => {
  const parsed = parseLead({ ...valid, care: "priority", billing: "yearly" });
  assert.equal(parsed.lead?.billing, "yearly");
  assert.ok(
    emailContent(parsed.lead!, "AW-year").businessText.includes(
      "Hosting billing: yearly",
    ),
  );
});
test("rejects invalid hosting billing", () =>
  assert.ok(parseLead({ ...valid, billing: "free" }).errors.billing));
test("accepts existing forms without a billing field", () => {
  const legacy = { ...valid } as Record<string, unknown>;
  delete legacy.billing;
  assert.equal(parseLead(legacy).lead?.billing, "unsure");
});
let ip = 0;
async function call(
  body: unknown,
  method = "POST",
  origin = "https://apexweb.com.au",
) {
  let status = 200;
  let result: Record<string, unknown> = {};
  const req = {
    method,
    headers: {
      origin,
      host: "apexweb.com.au",
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${++ip}`,
    },
    body,
    socket: {},
  } as unknown as NextApiRequest;
  const res = {
    setHeader: () => {},
    status: (n: number) => {
      status = n;
      return res;
    },
    json: (o: Record<string, unknown>) => {
      result = o;
      return res;
    },
  } as unknown as NextApiResponse;
  await handler(req, res);
  return { status, result };
}
(async () => {
  const original = globalThis.fetch;
  const old = {
    project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    resend: process.env.RESEND_API_KEY,
  };
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "qa-project";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "qa-key";
  delete process.env.RESEND_API_KEY;
  try {
    assert.equal((await call(valid, "GET")).status, 405);
    results.push("API rejects wrong method");
    assert.equal(
      (await call(valid, "POST", "https://other.example")).status,
      403,
    );
    results.push("API rejects foreign origin");
    assert.equal((await call({ ...valid, companyFax: "spam" })).status, 400);
    results.push("API rejects honeypot");
    assert.equal((await call({ ...valid, email: "bad" })).status, 400);
    results.push("API validates on server");
    globalThis.fetch = async () => new Response("{}", { status: 403 });
    assert.equal((await call(valid)).status, 503);
    results.push("failed database write never reports success");
    globalThis.fetch = async () => new Response("{}", { status: 200 });
    const accepted = await call(valid);
    assert.equal(accepted.status, 200);
    assert.equal(accepted.result.confirmationSent, false);
    results.push("accepted write returns reference without claiming email");
    globalThis.fetch = async () => new Response("{}", { status: 409 });
    assert.equal(
      (await call(valid)).result.reference,
      accepted.result.reference,
    );
    results.push("retry uses same deterministic document identity");
    console.log(JSON.stringify({ passed: results.length, results }, null, 2));
  } finally {
    globalThis.fetch = original;
    for (const [k, v] of Object.entries({
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: old.project,
      NEXT_PUBLIC_FIREBASE_API_KEY: old.key,
      RESEND_API_KEY: old.resend,
    })) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
