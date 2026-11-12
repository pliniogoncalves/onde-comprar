const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');

(async () => {
  const phase = process.argv[2] || 'current';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
    await page.addInitScript(() => {
      localStorage.setItem('@onde-comprar/preferences/v1', '{"soundEnabled":true,"hapticsEnabled":false}');
      window.audioMeasurement = { attempts: 0 };
      const original = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        const result = window.audioMeasurement;
        result.attempts++; result.playCall = performance.now(); result.readyState = this.readyState;
        this.addEventListener('playing', () => { result.playing = performance.now(); }, { once: true });
        this.addEventListener('ended', () => { result.ended = performance.now(); }, { once: true });
        return original.call(this).catch(error => { result.blocked = error.name; throw error; });
      };
      const observer = new MutationObserver(() => {
        const heading = Array.from(document.querySelectorAll('[role="heading"]')).find(el => el.textContent === 'Encontrou!' && el.getBoundingClientRect().height > 0);
        if (heading && !window.audioMeasurement.visual) window.audioMeasurement.visual = performance.now();
        const marker = document.querySelector('[data-testid="success-cue"]');
        if (marker && heading && !window.audioMeasurement.cue) window.audioMeasurement.cue = performance.now();
        const results = Array.from(document.querySelectorAll('[role="heading"]')).find(el => el.textContent === 'Ofertas demonstrativas' && el.getBoundingClientRect().height > 0);
        if (results && !window.audioMeasurement.results) window.audioMeasurement.results = performance.now();
      });
      observer.observe(document, { subtree: true, childList: true, attributes: true });
    });
    await page.goto('http://localhost:8091', { timeout: 120000 });
    await page.getByRole('button', { name: 'Experimentar demonstração', exact: true }).click({ timeout: 120000 });
    await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
    await page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' }).waitFor();
    await page.getByRole('button', { name: 'Confirmar e buscar ofertas simuladas' }).click();
    await page.waitForFunction(automatic => (window.audioMeasurement.ended || window.audioMeasurement.blocked) && (!automatic || window.audioMeasurement.results), !phase.startsWith('before'), { timeout: 15000 });
    const measurements = await page.evaluate(() => window.audioMeasurement);
    const base64 = (await fs.readFile('assets/sounds/sucesso.mp3')).toString('base64');
    const signal = await page.evaluate(async encoded => {
      const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      const context = new AudioContext();
      const buffer = await context.decodeAudioData(bytes.buffer);
      const data = buffer.getChannelData(0);
      let firstSignal = -1;
      let peak = 0;
      for (let i = 0; i < data.length; i++) {
        const value = Math.abs(data[i]); peak = Math.max(peak, value);
        if (firstSignal < 0 && value > 0.00316) firstSignal = i / buffer.sampleRate;
      }
      await context.close();
      return { durationSeconds: buffer.duration, firstSignalAboveMinus50DbSeconds: firstSignal, peak };
    }, base64);
    await fs.mkdir('artifacts', { recursive: true });
    const result = { phase, measurements, signal };
    await fs.writeFile(`artifacts/audio-${phase}.json`, JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
