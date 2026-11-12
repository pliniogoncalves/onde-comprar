const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await fs.mkdir('artifacts/recordings', { recursive: true });
    for (const viewport of [{ width: 393, height: 852 }, { width: 360, height: 800 }]) {
      const context = await browser.newContext({ viewport, recordVideo: { dir: 'artifacts/recordings', size: viewport } });
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem('@onde-comprar/preferences/v1', '{"soundEnabled":true,"hapticsEnabled":false}'));
      await page.goto('http://localhost:8091', { timeout: 120000 });
      await page.getByRole('button', { name: 'Experimentar demonstração', exact: true }).click({ timeout: 120000 });
      await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
      await page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' }).waitFor();
      await page.getByRole('button', { name: 'Confirmar e buscar ofertas simuladas' }).click();
      await page.getByRole('heading', { name: 'Encontrou!', exact: true }).waitFor();
      await page.getByRole('heading', { name: 'Ofertas demonstrativas', exact: true }).waitFor();
      await page.getByRole('heading', { name: 'Produtos semelhantes', exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/2-1-similar-${viewport.width}.png` });
      await context.close();
      await page.video().saveAs(`artifacts/jornada-2-1-${viewport.width}x${viewport.height}.webm`);
      console.log(`Gravação visual: artifacts/jornada-2-1-${viewport.width}x${viewport.height}.webm`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
