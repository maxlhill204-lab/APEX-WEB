const assert = require("node:assert/strict");
const { chromium } = require("@playwright/test");

const baseURL = process.env.BASE_URL || "http://localhost:3017";

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    // Vercel intentionally ignores automated browsers. Emulate a normal visitor
    // for this test, while intercepting every analytics submission below.
    const contextOptions = { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" };
    // Exercise the real Vercel intake script without sending QA page views.
    const scriptResponse = await fetch("https://apexweb.au/_vercel/insights/script.js");
    assert.equal(scriptResponse.status, 200);
    const script = await scriptResponse.text();
    const owner = await browser.newContext(contextOptions);
    await owner.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
    const sent = [];
    await owner.route("**/*", async (route) => {
      if (new URL(route.request().url()).pathname.endsWith("/script.js")) {
        await route.fulfill({ contentType: "application/javascript", body: script });
      } else if (route.request().method() === "POST") {
        sent.push(route.request().url());
        await route.fulfill({ status: 200, body: "{}" });
      } else {
        await route.continue();
      }
    });
    const page = await owner.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseURL}/analytics-preferences`);
    await page.getByRole("status").filter({ hasText: "now excluded" }).waitFor();
    await page.waitForTimeout(800);
    assert.equal(sent.length, 0, "Preference page must not be counted");
    await page.getByRole("link", { name: "Back to APEXWEB", exact: true }).click();
    await page.waitForURL(`${baseURL}/`);
    await page.waitForTimeout(800);
    assert.equal(sent.length, 0, "Client navigation must be excluded");
    await page.reload();
    await page.waitForTimeout(800);
    assert.equal(sent.length, 0, "Exclusion must survive reload");
    await page.goto(`${baseURL}/services`);
    await page.waitForTimeout(800);
    assert.equal(sent.length, 0, "Other pages must also be excluded");
    await page.goto(`${baseURL}/analytics-preferences`);
    await page.getByRole("status").filter({ hasText: "now excluded" }).waitFor();
    await page.getByRole("button", { name: "Count this browser again" }).click();
    await page.getByRole("status").filter({ hasText: "counted again" }).waitFor();
    await page.getByRole("link", { name: "Back to APEXWEB", exact: true }).click();
    await page.waitForTimeout(800);
    assert.ok(sent.length > 0, "Opting back in must restore page views");

    const visitor = await browser.newContext(contextOptions);
    await visitor.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
    const visitorSent = [];
    await visitor.route("**/*", async (route) => {
      if (new URL(route.request().url()).pathname.endsWith("/script.js")) {
        await route.fulfill({ contentType: "application/javascript", body: script });
      } else if (route.request().method() === "POST") {
        visitorSent.push(route.request().url());
        await route.fulfill({ status: 200, body: "{}" });
      } else {
        await route.continue();
      }
    });
    const visitorPage = await visitor.newPage();
    await visitorPage.goto(baseURL);
    await visitorPage.waitForTimeout(1000);
    assert.ok(visitorSent.length > 0, "New visitors must still be counted");
    assert.deepEqual(errors, []);
    console.log("PASS: first opt-out visit, navigation, reload, other pages, opt-in, and ordinary visitors");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
