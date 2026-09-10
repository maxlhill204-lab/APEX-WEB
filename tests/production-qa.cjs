// Sends a clearly labelled real test enquiry to APEXWEB. Opt in explicitly.
if (process.env.ALLOW_LIVE_LEAD_TEST !== "1")
  throw new Error(
    "Set ALLOW_LIVE_LEAD_TEST=1 only when authorised to send a real QA enquiry.",
  );
const { chromium } = require("@playwright/test");
const fs = require("fs");
(async () => {
  const browser = await chromium.connectOverCDP(
    process.env.CDP_URL || "http://127.0.0.1:9222",
  );
  const page = browser.contexts()[0].pages()[0];
  const report = { errors: [], requests: [], quote: null };
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400)
      report.requests.push({ url: r.url(), status: r.status() });
  });
  const base = "https://apex-web-beta.vercel.app";
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page
    .getByRole("heading", { name: "Your business. Beyond ordinary." })
    .waitFor();
  await page.getByRole("button", { name: "Rotate model right" }).waitFor();
  await page.getByRole("button", { name: "Rotate model right" }).click();
  await page.screenshot({
    path: "../qa-evidence/production-mobile.png",
    fullPage: false,
  });
  await page.goto(
    base +
      "/quote?package=business&source=production-browser-qa&utm_campaign=acceptance",
  );
  if (!(await page.locator('input[value="business"]').isChecked()))
    throw Error("Deep link failed");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .locator("#business")
    .fill("APEXWEB QA — public browser test, no action needed");
  await page
    .locator("#description")
    .fill(
      "Authorised final public website quality assurance. This is not a sales lead. Confirms the complete browser to server to Firebase enquiry flow.",
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Gallery", { exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("#name").fill("APEXWEB QA");
  await page.locator("#email").fill("apexweb.au@gmail.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator('input[name="consent"]').check();
  const responsePromise = page.waitForResponse(
    (r) => r.url().endsWith("/api/quote") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Send quote request" }).click();
  const response = await responsePromise;
  const body = await response.json();
  report.quote = { status: response.status(), ...body };
  if (response.status() !== 200 || !body.ok)
    throw Error("Live enquiry rejected: " + JSON.stringify(body));
  await page
    .getByRole("heading", { name: "Your enquiry is received." })
    .waitFor();
  await page.screenshot({
    path: "../qa-evidence/production-quote-success.png",
    fullPage: true,
  });
  const payload = response.request().postData();
  const retry = await page.request.post(base + "/api/quote", {
    headers: { "Content-Type": "application/json" },
    data: payload,
  });
  const retryBody = await retry.json();
  report.retry = { status: retry.status(), ...retryBody };
  if (!retryBody.ok || retryBody.reference !== body.reference)
    throw Error("Retry identity failed");
  await page.goto(base);
  report.canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  report.assets = {
    images: await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      ),
    canvas: await page.locator("canvas").count(),
  };
  fs.writeFileSync(
    "../qa-evidence/production-report.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
