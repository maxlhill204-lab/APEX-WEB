const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
const base = process.env.BASE_URL || "http://localhost:3000",
  out = process.env.QA_OUTPUT_DIR || "../qa-evidence/cinematic-qa";
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [],
    failures = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().includes("/cinematic/"))
      failures.push(r.url());
  });
  const checks = [];
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.locator(".cinema-ready").waitFor();
    await page.waitForTimeout(800);
    for (const p of [
      0, 0.65, 1.95, 2.05, 2.7, 4.5, 5.75, 7, 7.8, 8.4, 9.4, 10.6, 11,
    ]) {
      await page.evaluate((p) => {
        const el = document.querySelector(".cinema");
        scrollTo({
          top: el.offsetTop + ((el.offsetHeight - innerHeight) * p) / 11,
          behavior: "instant",
        });
      }, p);
      await page.waitForTimeout(450);
      const check = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        headings: [...document.querySelectorAll(".cinema-copy")]
          .filter(
            (e) =>
              getComputedStyle(e).visibility === "visible" &&
              parseFloat(getComputedStyle(e).opacity) > 0.9,
          )
          .map((e) => {
            const r = e.querySelector("h2").getBoundingClientRect();
            return {
              text: e.innerText,
              fits:
                r.left >= 0 &&
                r.right <= innerWidth + 1 &&
                r.top >= 0 &&
                r.bottom <= innerHeight,
            };
          }),
      }));
      checks.push({ width, p, ...check });
      if ([390, 1440].includes(width))
        await page.screenshot({ path: `${out}/scene-${width}-${p}.png` });
    }
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.locator(".cinema-ready").waitFor();
  await page.waitForTimeout(900);
  const canvas = page.locator(".cinema-renderer canvas");
  const before = await canvas.screenshot();
  await page.locator(".cinema-renderer").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
  const after = await canvas.screenshot();
  const keyboardChangesModel = !before.equals(after);
  await page
    .getByRole("link", { name: "Start a conversation", exact: true })
    .click();
  await page.waitForTimeout(1000);
  const ctaLandsAtQuote = await page.locator("#start").evaluate((e) => {
    const r = e.getBoundingClientRect();
    return r.top < 200 && r.bottom > 0;
  });
  await page.screenshot({ path: `${out}/inline-quote.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page.waitForTimeout(300);
  const reduced = {
    canvasCount: await page.locator("canvas").count(),
    chapters: await page.locator(".cinema-copy:visible").count(),
    poster: await page
      .locator(".cinema-poster img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  };
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  await page.screenshot({ path: `${out}/reduced-motion.png` });
  const report = {
    checks,
    keyboardChangesModel,
    ctaLandsAtQuote,
    reduced,
    reducedMotionViolations: axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    errors,
    failedAssets: failures,
  };
  fs.writeFileSync(
    `${out}/cinema-report.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        frames: checks.length,
        badFrames: checks.filter(
          (c) => c.overflow || c.headings.some((h) => !h.fits),
        ),
        keyboardChangesModel,
        ctaLandsAtQuote,
        reduced,
        violations: report.reducedMotionViolations,
        errors,
        failures,
      },
      null,
      2,
    ),
  );
  await browser.close();
  if (
    checks.some((c) => c.overflow || c.headings.some((h) => !h.fits)) ||
    !keyboardChangesModel ||
    !ctaLandsAtQuote ||
    errors.length ||
    failures.length ||
    axe.violations.length ||
    reduced.canvasCount
  )
    process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
