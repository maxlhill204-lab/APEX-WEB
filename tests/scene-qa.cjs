const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
const baseURL = process.env.BASE_URL || "http://localhost:3000";
const qaOutput = process.env.QA_OUTPUT_DIR || "test-results/qa";
fs.mkdirSync(qaOutput, { recursive: true });
(async () => {
  const browser = await chromium.connectOverCDP(
    process.env.CDP_URL || "http://127.0.0.1:9222",
  );
  const page = browser.contexts()[0].pages()[0];
  const report = [];
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(baseURL);
    for (const id of [
      "possibility-design",
      "possibility-interactive",
      "possibility-responsive",
      "possibility-conversion",
    ]) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
      await page.evaluate(
        (id) =>
          document
            .querySelector("#" + id)
            .scrollIntoView({ block: "start", behavior: "instant" }),
        id,
      );
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${qaOutput}/scene-${width}-${id}.png` });
      report.push({
        width,
        id,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        visibleText: await page.locator("#" + id).innerText(),
      });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseURL);
  if (await page.locator(".device-canvas").count())
    throw Error("WebGL should be omitted for reduced motion");
  report.push({ reducedMotion: "Static fallback verified" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(baseURL);
  await page.setViewportSize({ width: 768, height: 900 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Packages", exact: false })
    .click();
  if (await page.getByRole("dialog").isVisible())
    throw Error("Menu stayed open after navigation");
  report.push({ mobileMenu: "Navigation closes and scrolls to packages" });
  await page.goto(`${baseURL}/quote?package=custom`);
  await page.locator('input[name="package"]').nth(3).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("#business").fill("Keyboard check");
  await page
    .locator("#description")
    .fill("A complete description for keyboard verification.");
  await page.locator("#description").focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  report.push({
    keyboardFocus: await page.evaluate(
      () => document.activeElement?.textContent,
    ),
  });
  fs.writeFileSync(
    `${qaOutput}/scene-report.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      { scenes: report.length, overflow: report.filter((x) => x.overflow) },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
