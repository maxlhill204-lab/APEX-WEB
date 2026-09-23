import { strict as assert } from "node:assert";
import { emptyLead, parseLead } from "../lib/lead";
import { emailContent } from "../lib/lead-email";
import { enquiryDraft } from "../lib/enquiry-draft";
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
test("email fallback preserves business details and selected annual plan", () => {
  const draft = enquiryDraft({ ...valid, package: "growth", care: "priority", billing: "yearly", notes: "A&B + café\nSecond line" });
  const url = new URL(draft.href);
  assert.equal(url.pathname, "apexweb.au@gmail.com");
  assert.equal(url.searchParams.get("body"), draft.body);
  assert.ok(draft.body.includes("Growth Site"));
  assert.ok(draft.body.includes("Growth care"));
  assert.ok(draft.body.includes("Billing: yearly"));
  assert.ok(draft.body.includes("A&B + café\nSecond line"));
});
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
    fallback: process.env.INTERNAL_EMAIL_FALLBACK_FROM,
  };
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "qa-project";
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "qa-key";
  delete process.env.RESEND_API_KEY;
  delete process.env.INTERNAL_EMAIL_FALLBACK_FROM;
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
    assert.equal((await call(valid)).status, 503);
    results.push("stored lead never reports success when email is not configured");
    process.env.RESEND_API_KEY = "qa-resend";
    let rejectedEmailCalls = 0;
    globalThis.fetch = async (input) => {
      if (String(input).includes("api.resend.com")) {
        rejectedEmailCalls++;
        return new Response("{}", { status: 403 });
      }
      return new Response("{}", { status: 200 });
    };
    assert.equal((await call(valid)).status, 503);
    assert.equal(rejectedEmailCalls, 1);
    results.push("provider rejection returns failure and never sends customer confirmation");
    let emailCalls = 0;
    globalThis.fetch = async (input) => {
      const url = String(input);
      emailCalls++;
      return new Response("{}", { status: url.includes("api.resend.com") ? 200 : 409 });
    };
    const accepted = await call(valid);
    assert.equal(accepted.status, 200);
    assert.equal(accepted.result.confirmationSent, true);
    assert.equal(emailCalls, 3);
    results.push("accepted business email and customer confirmation return success");
    assert.equal((await call(valid)).result.reference, accepted.result.reference);
    results.push("retry uses same deterministic document identity");
    process.env.INTERNAL_EMAIL_FALLBACK_FROM = "APEXWEB internal <notifications@verified.example>";
    const sentBodies: Record<string, unknown>[] = [];
    globalThis.fetch = async (input, init) => {
      if (!String(input).includes("api.resend.com")) return new Response("{}", { status: 409 });
      const body = JSON.parse(String(init?.body));
      sentBodies.push(body);
      return body.from === process.env.INTERNAL_EMAIL_FALLBACK_FROM
        ? new Response('{"id":"qa-delivered"}', { status: 200 })
        : new Response('{"message":"The apexweb.au domain is not verified."}', { status: 403 });
    };
    const fallback = await call(valid);
    assert.equal(fallback.status, 200);
    assert.equal(fallback.result.confirmationSent, false);
    assert.equal(sentBodies.length, 3);
    assert.deepEqual(sentBodies[1].to, ["apexweb.au@gmail.com"]);
    assert.equal(sentBodies[1].reply_to, valid.email);
    assert.notEqual(sentBodies[2].from, process.env.INTERNAL_EMAIL_FALLBACK_FROM);
    results.push("unverified domain uses internal-only fallback without a false customer confirmation");
    let forbiddenAttempts = 0;
    globalThis.fetch = async (input) => {
      if (!String(input).includes("api.resend.com")) return new Response("{}", { status: 409 });
      forbiddenAttempts++;
      return new Response('{"message":"Invalid API key"}', { status: 403 });
    };
    assert.equal((await call(valid)).status, 503);
    assert.equal(forbiddenAttempts, 1);
    results.push("internal fallback cannot mask API credential rejection");
    sentBodies.length = 0;
    globalThis.fetch = async (input, init) => {
      if (String(input).includes("api.resend.com")) sentBodies.push(JSON.parse(String(init?.body)));
      return new Response("{}", { status: 200 });
    };
    assert.equal((await call(valid)).result.confirmationSent, true);
    assert.equal(sentBodies.length, 2);
    assert.ok(sentBodies.every(body => body.from !== process.env.INTERNAL_EMAIL_FALLBACK_FROM));
    results.push("verified primary sender automatically bypasses the internal fallback");
    console.log(JSON.stringify({ passed: results.length, results }, null, 2));
  } finally {
    globalThis.fetch = original;
    for (const [k, v] of Object.entries({
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: old.project,
      NEXT_PUBLIC_FIREBASE_API_KEY: old.key,
      RESEND_API_KEY: old.resend,
      INTERNAL_EMAIL_FALLBACK_FROM: old.fallback,
    })) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
