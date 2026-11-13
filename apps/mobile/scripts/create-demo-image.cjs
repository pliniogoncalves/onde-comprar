const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 440 } });
    await page.setContent(`<body style="margin:0"><svg width="600" height="440" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="440" fill="#e8f8ef"/><ellipse cx="300" cy="360" rx="135" ry="18" fill="#cce5d5"/>
      <path d="M193 265V197a107 107 0 0 1 214 0v68" fill="none" stroke="#102b25" stroke-width="28"/>
      <path d="M199 197a101 101 0 0 1 202 0" fill="none" stroke="#7ce4ae" stroke-width="10"/>
      <rect x="166" y="224" width="68" height="112" rx="28" fill="#102b25"/><rect x="366" y="224" width="68" height="112" rx="28" fill="#102b25"/>
      <rect x="180" y="238" width="28" height="84" rx="14" fill="#7ce4ae"/><rect x="392" y="238" width="28" height="84" rx="14" fill="#7ce4ae"/>
      <text x="300" y="405" text-anchor="middle" fill="#52635c" font-family="sans-serif" font-size="16">AURORA A1 · ILUSTRAÇÃO FICTÍCIA</text>
      </svg></body>`);
    await fs.mkdir('assets/demo', { recursive: true });
    await page.screenshot({ path: 'assets/demo/headphones.png' });
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
