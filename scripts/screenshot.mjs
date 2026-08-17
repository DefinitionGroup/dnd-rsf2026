// Full-page screenshots via the Playwright Chromium already in the local cache.
// Usage: node scripts/screenshot.mjs <url> <out-basename> [--mobile]
import { chromium } from "playwright";
const [url, base, ...flags] = process.argv.slice(2);
const mobile = flags.includes("--mobile");
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
// settle lazy sections: scroll through, then back to top
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
});
await page.screenshot({ path: `${base}.png`, fullPage: true });
await page.screenshot({ path: `${base}-fold.png`, fullPage: false });
console.log(`wrote ${base}.png (+ -fold)`);
await browser.close();
