import { expect, test, type Page } from '@playwright/test';
import { demoTiming, confirmationTiming } from '../src/config/demoTiming';

declare global { interface Window { audioAttempts: number; audioStarts: number; audioEnded: number; audioAtCompletion: boolean; audioDuration: number; } }
async function trackSound(page: Page, enabled = false, blocked = false) {
  await page.addInitScript(({ enabled, blocked }) => {
    localStorage.setItem('@onde-comprar/preferences/v1', JSON.stringify({ soundEnabled: enabled, hapticsEnabled: false }));
    window.audioAttempts = 0; window.audioStarts = 0; window.audioEnded = 0;
    window.audioAtCompletion = false; window.audioDuration = 0;
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.audioAttempts++;
      window.audioAtCompletion = !!document.querySelector('[data-testid="confirmation-screen"]') && document.body.textContent?.includes('Encontrou!') === true;
      this.addEventListener('ended', () => window.audioEnded++, { once: true });
      if (blocked) return Promise.reject(new DOMException('Blocked in test', 'NotAllowedError'));
      return original.call(this).then(() => { window.audioStarts++; window.audioDuration = this.duration; });
    };
  }, { enabled, blocked });
}
async function start(page: Page, scenario = 'Com ofertas') {
  await page.goto('/');
  await page.getByRole('radio', { name: scenario, exact: true }).click();
  await page.getByRole('button', { name: 'Experimentar demonstração', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revise a imagem' })).toBeVisible();
  // Relógio controlado somente após navegação e carregamento iniciais.
  await page.clock.install({ time: new Date('2026-11-12T12:00:00Z') });
  await page.clock.pauseAt('2026-11-12T12:00:10Z');
}
async function identify(page: Page) {
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await page.clock.runFor(demoTiming.analysisMs + demoTiming.recognitionMs);
  await expect(page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' })).toBeAttached();
  await page.clock.runFor(300); // Finalizar transição de navegação, não o processamento.
}
async function confirm(page: Page) {
  await page.getByRole('button', { name: 'Confirmar e buscar ofertas simuladas' }).click();
}
async function success(page: Page) {
  await confirm(page);
  await page.clock.runFor(demoTiming.offersMs + demoTiming.organizationMs);
  await expect(page.getByTestId('confirmation-screen')).toBeVisible();
  await page.clock.runFor(confirmationTiming.introMs + 50);
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
}
async function results(page: Page) {
  await page.clock.runFor(confirmationTiming.holdMs + 300);
  await expect(page.getByRole('heading', { name: 'Ofertas demonstrativas', exact: true })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(3);
}

test('full screen success, automatic results, details and reload recovery without external requests', async ({ page }, info) => {
  await trackSound(page);
  const external: string[] = [];
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://localhost:8091')) external.push(request.url()); });
  await start(page);
  await identify(page);
  const name = page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' });
  await name.fill(' '); await confirm(page);
  await expect(page.getByRole('alert')).toContainText('Informe o nome');
  await name.fill('Fone de ouvido');
  await expect(page.getByRole('tab')).toHaveCount(3);
  await success(page);
  await expect(page.getByRole('tab')).toHaveCount(0);
  await expect(page.getByRole('button')).toHaveCount(0);
  const box = await page.getByTestId('confirmation-screen').boundingBox();
  expect(box!.width).toBe(page.viewportSize()!.width);
  expect(box!.height).toBe(page.viewportSize()!.height);
  await page.screenshot({ path: `artifacts/2-1-confirmation-${info.project.name}.png` });
  expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
  await results(page);
  await page.screenshot({ path: `artifacts/2-1-results-${info.project.name}.png` });
  await page.getByRole('button', { name: 'Detalhes de Loja Exemplo Verde' }).click();
  await page.clock.runFor(300);
  await expect(page.getByText('Preço fictício, sem validade comercial.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Recomece a demonstração' })).toBeVisible();
  expect(external).toEqual([]);
});

test('four timed stages follow mock completion without early checkmarks', async ({ page }, info) => {
  await trackSound(page); await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await expect(page.getByLabel('Analisando a imagem: Em andamento', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Identificando o produto: Pendente', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/2-1-analysis-${info.project.name}.png` });
  await page.clock.runFor(demoTiming.analysisMs);
  await expect(page.getByLabel('Analisando a imagem: Concluída', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Identificando o produto: Em andamento', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/2-1-recognition-${info.project.name}.png` });
  await page.clock.runFor(demoTiming.recognitionMs + 300);
  await confirm(page);
  await expect(page.getByLabel('Buscando lojas e ofertas: Em andamento', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/2-1-search-${info.project.name}.png` });
  await page.clock.runFor(demoTiming.offersMs);
  await expect(page.getByLabel('Organizando os resultados: Em andamento', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/2-1-organize-${info.project.name}.png` });
  await page.clock.runFor(demoTiming.organizationMs - 1);
  await expect(page.getByTestId('confirmation-screen')).toHaveCount(0);
  await page.clock.runFor(1);
  await expect(page.getByTestId('confirmation-screen')).toBeVisible();
});

test('blocked audio and reduced motion preserve exclusive confirmation and automatic navigation', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await trackSound(page, true, true);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await expect(page.getByLabel('Processamento demonstrativo em andamento', { exact: true })).toHaveCount(0);
  await page.clock.runFor(demoTiming.analysisMs + demoTiming.recognitionMs + 300);
  await success(page);
  await expect.poll(() => page.evaluate(() => window.audioAttempts)).toBe(1);
  expect(await page.evaluate(() => window.audioAtCompletion)).toBe(true);
  expect(await page.getByTestId('completion-mark').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBe(1);
  await page.screenshot({ path: `artifacts/2-1-reduced-${info.project.name}.png` });
  await results(page);
  await page.getByRole('tab', { name: 'Preferências', exact: true }).click(); await page.clock.runFor(300);
  await page.getByRole('tab', { name: 'Início', exact: true }).click(); await page.clock.runFor(300);
  expect(await page.evaluate(() => window.audioAttempts)).toBe(1);
  expect(errors).toEqual([]);
});

test('prepared audio plays once at success and finishes before results', async ({ page }) => {
  await trackSound(page, true); await start(page); await identify(page); await success(page);
  await expect.poll(() => page.evaluate(() => window.audioStarts)).toBe(1);
  expect(await page.evaluate(() => window.audioAtCompletion)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.audioEnded)).toBe(1);
  expect(await page.evaluate(() => window.audioDuration)).toBeCloseTo(0.8, 1);
  await results(page);
  expect(await page.evaluate(() => window.audioAttempts)).toBe(1);
});

for (const [scenario, heading] of [['Sem resultados', 'Nenhuma oferta encontrada'], ['Erro na busca', 'A busca teve um problema'], ['Identificação inconclusiva', 'Não identificamos o produto']] as const) {
  test(`${scenario} does not open success or play audio`, async ({ page }) => {
    await trackSound(page, true); await start(page, scenario); await identify(page);
    if (scenario !== 'Identificação inconclusiva') { await confirm(page); await page.clock.runFor(demoTiming.offersMs + 300); }
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    if (scenario === 'Erro na busca') await expect(page.getByLabel('Buscando lojas e ofertas: Erro', { exact: true })).toBeVisible();
    await expect(page.getByTestId('confirmation-screen')).toHaveCount(0);
    expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
  });
}

test('cancel, new demonstration and incompatible corrections invalidate old work', async ({ page }) => {
  await trackSound(page, true); await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await page.getByRole('button', { name: 'Cancelar demonstração' }).click();
  await page.clock.runFor(10000);
  await expect(page.getByRole('heading', { name: 'Demonstração cancelada', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Rever demonstração' }).click(); await page.clock.runFor(300);
  await identify(page);
  await page.getByRole('textbox', { name: 'Modelo', exact: true }).fill('Outro');
  await confirm(page); await page.clock.runFor(demoTiming.offersMs + 300);
  await expect(page.getByRole('heading', { name: 'Nenhuma oferta encontrada', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
});
