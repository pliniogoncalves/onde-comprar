const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const reports = [];
  const phase = process.argv[2] || 'current';
  await fs.mkdir('artifacts', { recursive: true });
  for (const viewport of [{ width: 393, height: 852 }, { width: 360, height: 800 }]) {
    const page = await browser.newPage({ viewport, isMobile: true, deviceScaleFactor: 1 });
    await page.goto('http://localhost:8091', { timeout: 120000 });
    await page.getByRole('tab', { name: 'Preferências' }).waitFor({ timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    const report = await page.evaluate(() => {
      const box = element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { tag: element.tagName, role: element.getAttribute('role'), text: element.textContent?.slice(0, 80),
          x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          overflow: style.overflow, overflowY: style.overflowY, position: style.position,
          lineHeight: style.lineHeight, padding: style.padding };
      };
      const tabs = Array.from(document.querySelectorAll('[role="tab"]')).map(tab => {
        const text = Array.from(tab.querySelectorAll('*')).find(el => el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE && el.textContent === tab.getAttribute('aria-label'));
        const label = text || Array.from(tab.querySelectorAll('*')).find(el => ['Início', 'Histórico', 'Preferências'].includes(el.textContent || ''));
        const ancestors = [];
        for (let el = label; el; el = el.parentElement) ancestors.push(box(el));
        return { tab: box(tab), label: label ? box(label) : null, ancestors };
      });
      return { viewport: { width: innerWidth, height: innerHeight, visualHeight: visualViewport?.height },
        meta: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
        documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight, tabs };
    });
    reports.push(report);
    await page.screenshot({ path: `artifacts/${phase}-${viewport.width}.png`, fullPage: true });
    await page.close();
  }
  await fs.writeFile(`artifacts/${phase}-layout.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports.map(({ viewport, documentWidth, documentHeight, tabs }) => ({
    viewport, documentWidth, documentHeight,
    tabs: tabs.map(({ tab, label }) => ({ text: label?.text, tabY: tab.y, tabHeight: tab.height, labelY: label?.y, labelHeight: label?.height })),
  })), null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
