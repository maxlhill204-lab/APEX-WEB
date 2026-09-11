const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
const baseURL = process.env.BASE_URL || "http://localhost:3000";
const qaOutput = process.env.QA_OUTPUT_DIR || "test-results/qa";
fs.mkdirSync(qaOutput, { recursive: true });
(async () => {
  const browser = process.env.QA_HEADLESS
    ? await chromium.launch({ channel: "chrome", headless: true })
    : await chromium.connectOverCDP(
        process.env.CDP_URL || "http://127.0.0.1:9222",
      );
  const context = browser.contexts()[0] || (await browser.newContext());
  const page = context.pages()[0] || (await context.newPage());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const report = { widths: [], axe: [], flows: [], errors };
  await page.goto(baseURL);
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(100);
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("main *")]
        .filter(
          (e) =>
            e.getBoundingClientRect().right > innerWidth + 1 &&
            getComputedStyle(e).position !== "absolute",
        )
        .slice(0, 6)
        .map((e) => e.className),
    }));
    report.widths.push(overflow);
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `${qaOutput}/home-${width}.png`,
        fullPage: false,
      });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  let axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.axe.push({
    route: "/",
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await page.locator(".cinema-renderer").focus();
  await page.keyboard.press("ArrowRight");
  report.flows.push("Keyboard model rotation");
  await page.locator("#start").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: /03 \/ CINEMATIC Growth Site/ })
    .click();
  await page
    .getByText(
      "The full experience. Cinematic 3D, scroll-driven storytelling and connected business tools.",
    )
    .waitFor();
  await page.getByRole("button", { name: "Build my growth site" }).click();
  await page.locator('input[value="growth"]').waitFor();
  if (!(await page.locator('input[value="growth"]').isChecked()))
    throw Error("Inline package selection lost");
  report.flows.push("Interactive packages and inline preselected enquiry");
  await page.getByRole("button", { name: "Close enquiry" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  if (await page.getByRole("dialog").isVisible())
    throw Error("Menu Escape failed");
  report.flows.push("mobile menu Escape");
  await page.goto(
    `${baseURL}/quote?package=business&care=managed&billing=yearly&source=qa&utm_campaign=acceptance`,
  );
  await page.locator('input[value="business"]').waitFor();
  if (!(await page.locator('input[value="business"]').isChecked()))
    throw Error("Package deep link failed");
  report.flows.push("package deep link");
  for (let step = 0; step < 5; step++) {
    await page.screenshot({
      path: `${qaOutput}/quote-step-${step + 1}.png`,
      fullPage: false,
    });
    axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    report.axe.push({
      route: `quote-step-${step + 1}`,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    if (step === 1) {
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByText("Enter your business name.", { exact: true })
        .waitFor();
      await page
        .getByLabel("Business name *", { exact: true })
        .fill("APEXWEB QA — no project");
      await page
        .getByLabel("What does your business do? *", { exact: true })
        .fill("Automated quality assurance for the APEXWEB website.");
      report.flows.push("required validation");
    }
    if (step === 2) {
      if (
        (await page.getByLabel("Preferred hosting billing").inputValue()) !==
        "yearly"
      )
        throw Error("Annual deep link failed");
      report.flows.push("Annual hosting selection preserved");
      await page.getByLabel("Gallery", { exact: true }).check();
      await page.getByLabel("Modern", { exact: true }).check();
      await page.getByRole("button", { name: "Back", exact: true }).click();
      if (
        (await page
          .getByLabel("Business name *", { exact: true })
          .inputValue()) !== "APEXWEB QA — no project"
      )
        throw Error("Back lost data");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      report.flows.push("back preserves state");
    }
    if (step === 3) {
      await page.getByLabel("Your name *", { exact: true }).fill("APEXWEB QA");
      await page
        .getByLabel("Email address *", { exact: true })
        .fill("bad-email");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByText("Enter a valid email address, such as you@business.com.", {
          exact: true,
        })
        .waitFor();
      await page
        .getByLabel("Email address *", { exact: true })
        .fill("apexweb.au@gmail.com");
      report.flows.push("email validation");
    }
    if (step < 4)
      await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await page.getByRole("button", { name: "Send quote request" }).click();
  await page
    .getByText("Please confirm that we may contact you about this enquiry.", {
      exact: true,
    })
    .waitFor();
  await page.locator('input[name="consent"]').check();
  await page.route("**/api/quote", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "QA simulated failure: your answers are preserved.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send quote request" }).click();
  await page.getByRole("alert").waitFor();
  if (
    !(await page
      .getByText("APEXWEB QA — no project", { exact: true })
      .isVisible())
  )
    throw Error("Failure lost data");
  report.flows.push("simulated failure preserves review");
  await page.screenshot({
    path: `${qaOutput}/quote-failure.png`,
    fullPage: false,
  });
  await page.unroute("**/api/quote");
  await page.route("**/api/quote", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        reference: "AW-QA-MOCK",
        confirmationSent: false,
      }),
    }),
  );
  await page.getByRole("button", { name: "Send quote request" }).click();
  await page
    .getByRole("heading", { name: "Your enquiry is received." })
    .waitFor();
  report.flows.push("simulated success UI (not live delivery)");
  await page.screenshot({
    path: `${qaOutput}/quote-success.png`,
    fullPage: false,
  });
  await page.unroute("**/api/quote");
  for (const path of [
    "/privacy",
    "/services",
    "/concepts/carbon-monarch",
    "/concepts/vertexlab",
    "/missing-page",
  ]) {
    const r = await page.goto(baseURL + path);
    report.flows.push(`${path}: ${r.status()}`);
  }
  fs.writeFileSync(
    `${qaOutput}/browser-report.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (
    report.widths.some((w) => w.scroll > w.width) ||
    report.axe.some((a) => a.violations.length) ||
    errors.length
  )
    process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
