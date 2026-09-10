const { chromium } = require("@playwright/test");
const sharp = require("sharp");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({
      content:
        "header,.cinema-opening,.cinema-copy,.cinema-cta,nextjs-portal,.cinema-poster,.cinema-curtain{visibility:hidden!important}",
    });
    await page.waitForTimeout(700);
    const points =
      width === 1440
        ? [
            [0, "opening"],
            [2.7, "reach"],
            [4.5, "mars"],
            [5.75, "jupiter"],
            [7, "neptune"],
            [9.4, "launch"],
          ]
        : [[0, "opening-mobile"]];
    for (const [p, name] of points) {
      await page.evaluate((p) => {
        const el = document.querySelector(".cinema");
        scrollTo({
          top: el.offsetTop + ((el.offsetHeight - innerHeight) * p) / 11,
          behavior: "instant",
        });
      }, p);
      await page.waitForTimeout(600);
      const png = await page.locator(".cinema-renderer canvas").screenshot();
      await sharp(png)
        .webp({ quality: 85 })
        .toFile(`public/cinematic/${name}-poster.webp`);
    }
  }
  await browser.close();
  console.log("Created seven still frames from the actual 3D scene");
})();
