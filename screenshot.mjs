import puppeteer from 'puppeteer-core';
import { mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const [url = 'http://localhost:3000', label, widthArg] = process.argv.slice(2);
const width = Number(widthArg) || 1440;
const dir = join(fileURLToPath(new URL('.', import.meta.url)), 'temporary screenshots');
await mkdir(dir, { recursive: true });

const nums = (await readdir(dir)).map((f) => Number(f.match(/^screenshot-(\d+)/)?.[1])).filter(Boolean);
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const out = join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width, height: width < 600 ? 844 : 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(async () => {
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
