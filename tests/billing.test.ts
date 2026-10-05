import { strict as assert } from "node:assert";
import { Readable } from "node:stream";
import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/stripe/webhook";

async function main() {
  process.env.STRIPE_TEST_WEBHOOK_SECRET = "whsec_qa_local_only";
  delete process.env.STRIPE_WEBHOOK_SECRET;
  process.env.RESEND_API_KEY = "qa_mock_only";
  const event = {
    id: "evt_qa_local", object: "event", livemode: false,
    type: "invoice.paid", data: { object: { id: "in_qa", currency: "aud", amount_paid: 3900,
      parent: { subscription_details: { metadata: { business: "apexweb.au" } } } } },
  };
  let calls = 0;
  let providerOk = true;
  const originalFetch = global.fetch;
  global.fetch = (async (_url, options) => {
    calls++;
    const headers = options?.headers as Record<string, string>;
    assert.equal(headers["Idempotency-Key"], "apexweb-billing-evt_qa_local");
    assert.ok(String(options?.body).includes("SANDBOX"));
    return new Response("{}", {status: providerOk ? 200 : 500});
  }) as typeof fetch;
  async function request(payload: unknown, overrides: {method?: string;signature?: string;raw?: string} = {}) {
    const body = overrides.raw || JSON.stringify(payload);
    const req = Readable.from([Buffer.from(body)]) as unknown as NextApiRequest;
    req.method = overrides.method || "POST";
    req.headers = { "stripe-signature": overrides.signature ?? Stripe.webhooks.generateTestHeaderString({payload:body,secret:"whsec_qa_local_only"}) };
    let status = 0;
    const res = {setHeader() {}, status(code: number) {status = code;return this;}, json() {return this;}} as unknown as NextApiResponse;
    await handler(req, res);
    return status;
  }
  try {
    assert.equal(await request(event, {method:"GET"}), 405);
    assert.equal(await request(event, {signature:"bad"}), 400);
    assert.equal(calls, 0);
    assert.equal(await request({...event, livemode:true}), 400);
    assert.equal(await request(event), 200);
    assert.equal(calls, 1);
    providerOk = false;
    assert.equal(await request(event), 503);
    assert.equal(calls, 2);
    providerOk = true;
    assert.equal(await request({...event,type:"customer.subscription.deleted",data:{object:{id:"sub_qa",metadata:{business:"apexweb.au"}}}}), 200);
    assert.equal(calls, 3);
    assert.equal(await request({...event,data:{object:{id:"in_other",metadata:{business:"apexmoto"}}}}), 200);
    assert.equal(calls, 3);
    assert.equal(await request({...event,type:"unhandled.event"}), 200);
    assert.equal(calls, 3);
    assert.equal(await request(event,{raw:"x".repeat(1024*1024+1)}),413);
    delete process.env.STRIPE_TEST_WEBHOOK_SECRET;
    assert.equal(await request(event),503);
    console.log("Billing tests passed: method, signatures, mode isolation, invoice ownership graph, lifecycle notification, retry on provider failure, unrelated events, payload limit, missing configuration.");
  } finally { global.fetch = originalFetch; delete process.env.RESEND_API_KEY; }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
