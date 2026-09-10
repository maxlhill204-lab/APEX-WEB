const { chromium } = require("@playwright/test");
const fs = require("fs");
(async () => {
  const browser = await chromium.connectOverCDP(
    process.env.CDP_URL || "http://127.0.0.1:9222",
  );
  const page = browser.contexts()[0].pages()[0];
  await page.goto("https://apex-web-beta.vercel.app");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page
    .locator("#work img")
    .evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
  const report = JSON.parse(
    fs.readFileSync("../qa-evidence/production-report.json", "utf8"),
  );
  report.assets.images = await page
    .locator("#work img")
    .evaluateAll((images) =>
      images.map((i) => ({
        src: i.currentSrc,
        loaded: i.complete && i.naturalWidth > 0,
        width: i.naturalWidth,
      })),
    );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "../qa-evidence/production-work.png" });
  await page.locator("#packages").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "../qa-evidence/production-packages.png" });
  await page.goto("https://apex-web-beta.vercel.app");
  await page.evaluate(() => document.fonts.ready);
  report.assets.fonts = await page.evaluate(() => document.fonts.status);
  fs.writeFileSync(
    "../qa-evidence/production-report.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report.assets, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
