const { chromium } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
(async () => {
  const out = process.env.QA_OUTPUT_DIR || "../qa-evidence/revision-3";
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [],
    checks = [],
    violations = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [width, height] of [
    [320, 700],
    [390, 844],
    [768, 900],
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(process.env.BASE_URL || "http://localhost:3002");
    await page.locator(".cinema-ready").waitFor();
    for (const p of [0.2, 0.56, 0.86, 1]) {
      await page.evaluate((p) => {
        const e = document.querySelector(".rocket-journey");
        scrollTo({
          top: e.offsetTop + (e.offsetHeight - innerHeight) * (0.36 + p * 0.64),
          behavior: "instant",
        });
      }, p);
      await page.waitForTimeout(450);
      checks.push(
        await page.evaluate(
          ({ width, height, p }) => ({
            width,
            height,
            p,
            overflow: document.documentElement.scrollWidth > innerWidth,
            canvas: !!document.querySelector(".rocket-renderer canvas"),
            careScrollable:
              document.querySelector(".rocket-care").scrollHeight >
              document.querySelector(".rocket-care").clientHeight,
            visibleText: [...document.querySelectorAll("[data-phase]")]
              .filter((e) => getComputedStyle(e).visibility === "visible")
              .map((e) => e.querySelector("h2").textContent),
          }),
          { width, height, p },
        ),
      );
      if ([390, 1440].includes(width))
        await page.screenshot({ path: `${out}/rocket-${width}-${p}.png` });
      if (p === 0.56 || p === 1) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        violations.push(
          ...result.violations.map((v) => ({
            width,
            p,
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        );
      }
    }
    await page.getByRole("button", { name: "Monthly", exact: true }).click();
    if (
      !(await page
        .locator(".rocket-care-plans")
        .innerText()
        .then(
          (t) => t.includes("$39") && t.includes("$79") && t.includes("$149"),
        ))
    )
      throw Error("Monthly pricing failed");
    await page.getByRole("button", { name: /Yearly/ }).click();
    if (
      !(await page
        .locator(".rocket-care-plans")
        .innerText()
        .then(
          (t) =>
            t.includes("$351") && t.includes("$711") && t.includes("$1,341"),
        ))
    )
      throw Error("Annual pricing failed");
  }
  fs.writeFileSync(
    out + "/rocket-report.json",
    JSON.stringify({ checks, violations, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, violations, errors }, null, 2));
  await browser.close();
  if (
    violations.length ||
    errors.length ||
    checks.some((c) => c.overflow || !c.canvas)
  )
    process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
