import { expect, test, type Page } from '@playwright/test';

declare global { interface Window { audioAttempts: number; audioAtCompletion: boolean; audioStarts: number; audioDuration: number; } }
async function trackSound(page: Page, enabled = false, blocked = false) {
  await page.addInitScript(({ enabled, blocked }) => {
    localStorage.setItem('@onde-comprar/preferences/v1', JSON.stringify({ soundEnabled: enabled, hapticsEnabled: true }));
    window.audioAttempts = 0;
    window.audioAtCompletion = false;
    window.audioStarts = 0;
    window.audioDuration = 0;
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.audioAttempts++;
      window.audioAtCompletion = document.body.textContent?.includes('Encontrou!') ?? false;
      if (blocked) return Promise.reject(new DOMException('Autoplay bloqueado no teste', 'NotAllowedError'));
      return original.call(this).then(() => { window.audioStarts++; window.audioDuration = this.duration; });
    };
  }, { enabled, blocked });
}
async function start(page: Page, scenario = 'Com ofertas') {
  await page.goto('/');
  await page.getByRole('radio', { name: scenario, exact: true }).click();
  await page.getByRole('button', { name: 'Experimentar demonstração', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Revise a imagem' })).toBeVisible();
}
async function identify(page: Page) {
  await page.getByRole('button', { name: 'Iniciar identificação simulada', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' })).toBeVisible();
}
async function confirm(page: Page) { await page.getByRole('button', { name: 'Confirmar e buscar ofertas simuladas' }).click(); }

test('complete demo, editable identification, offers, details and reload recovery without external requests', async ({ page }, testInfo) => {
  await trackSound(page);
  const external: string[] = [];
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://localhost:8091')) external.push(request.url()); });
  await start(page);
  await page.screenshot({ path: `artifacts/demo-review-${testInfo.project.name}.png` });
  await identify(page);
  const name = page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' });
  await name.fill(' '); await confirm(page);
  await expect(page.getByRole('alert')).toContainText('Informe o nome');
  await name.fill('Fone de ouvido');
  await expect(page.getByRole('tab')).toHaveCount(3);
  for (const tabName of ['Início', 'Histórico', 'Preferências']) {
    await expect(page.getByRole('tab', { name: tabName, exact: true })).toBeVisible();
  }
  const tabBounds = await page.getByRole('tab').evaluateAll(tabs => tabs.map(tab => {
    const box = tab.getBoundingClientRect();
    return { bottom: box.bottom, top: box.top, height: innerHeight };
  }));
  for (const box of tabBounds) { expect(box.bottom).toBeLessThanOrEqual(box.height); expect(box.top).toBeGreaterThanOrEqual(0); }
  // Tirar o foco do campo antes da captura evita registrar o estado de teclado/foco.
  await page.getByRole('heading', { name: 'Este é o produto?', exact: true }).click();
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    for (const element of document.querySelectorAll<HTMLElement>('*')) {
      if (element.scrollTop) element.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await page.screenshot({ path: `artifacts/demo-identify-${testInfo.project.name}.png` });
  await confirm(page);
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/demo-complete-${testInfo.project.name}.png` });
  expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
  await page.getByRole('button', { name: 'Ver ofertas demonstrativas' }).click();
  await expect(page.getByRole('heading', { name: 'Correspondências exatas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Produtos semelhantes' })).toBeAttached();
  await page.screenshot({ path: `artifacts/demo-results-${testInfo.project.name}.png` });
  await page.getByRole('button', { name: 'Detalhes de Loja Exemplo Verde' }).click();
  await expect(page.getByText('Preço fictício, sem validade comercial.')).toBeVisible();
  await page.screenshot({ path: `artifacts/demo-detail-${testInfo.project.name}.png` });
  expect(await page.getByRole('tab').count()).toBe(3);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Recomece a demonstração' })).toBeVisible();
  expect(external).toEqual([]);
});

test('processing timeline follows mock operations and shows animated running states', async ({ page }, testInfo) => {
  await trackSound(page);
  await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await expect(page.getByLabel('Identificação simulada do produto: Em andamento', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Busca de ofertas fictícias: Pendente', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/demo-processing-identify-${testInfo.project.name}.png` });
  await expect(page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' })).toBeVisible();
  await confirm(page);
  await expect(page.getByLabel('Identificação simulada do produto: Concluída', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Busca de ofertas fictícias: Em andamento', { exact: true })).toBeVisible();
  await page.screenshot({ path: `artifacts/demo-processing-offers-${testInfo.project.name}.png` });
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
});

test('sound is attempted once, blocked autoplay preserves visual success and reduced motion', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trackSound(page, true, true);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await expect(page.getByLabel('Identificação simulada do produto: Em andamento', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Processamento demonstrativo em andamento', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Nome do produto (obrigatório)' })).toBeVisible();
  await confirm(page);
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
  await expect(page.getByText('O som não pôde ser reproduzido. A demonstração continua normalmente.')).toBeVisible();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(1);
  expect(await page.evaluate(() => window.audioAtCompletion)).toBe(true);
  expect(await page.getByTestId('completion-mark').evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return matrix.a === 1 && matrix.d === 1;
  })).toBe(true);
  await page.screenshot({ path: `artifacts/demo-sound-blocked-${testInfo.project.name}.png` });
  await page.getByRole('tab', { name: 'Preferências', exact: true }).click();
  await page.getByRole('tab', { name: 'Início', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(1);
  expect(errors).toEqual([]);
});

test('actual local sound playback is attempted only with enabled preference', async ({ page }) => {
  await trackSound(page, true);
  await start(page); await identify(page); await confirm(page);
  await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.audioAttempts)).toBe(1);
  await expect.poll(() => page.evaluate(() => window.audioStarts)).toBe(1);
  expect(await page.evaluate(() => window.audioDuration)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.audioAtCompletion)).toBe(true);
  await page.getByRole('button', { name: 'Ver ofertas demonstrativas' }).click();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(1);
});

for (const [scenario, heading] of [['Sem resultados', 'Nenhuma oferta encontrada'], ['Erro na busca', 'A busca teve um problema'], ['Identificação inconclusiva', 'Não identificamos o produto']] as const) {
  test(`${scenario} has no success effects`, async ({ page }, testInfo) => {
    await trackSound(page, true);
    await start(page, scenario); await identify(page);
    if (scenario !== 'Identificação inconclusiva') await confirm(page);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    if (scenario === 'Erro na busca') await expect(page.getByLabel('Busca de ofertas fictícias: Erro', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Encontrou!', exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
    await page.screenshot({ path: `artifacts/demo-${scenario}-${testInfo.project.name}.png` });
  });
}

test('cancelled processing and unrelated corrections do not produce success effects', async ({ page }) => {
  await trackSound(page, true);
  await start(page);
  await page.getByRole('button', { name: 'Iniciar identificação simulada' }).click();
  await page.getByRole('button', { name: 'Cancelar demonstração' }).click();
  await expect(page.getByRole('heading', { name: 'Demonstração cancelada', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
  await page.getByRole('button', { name: 'Rever demonstração' }).click();
  await identify(page);
  await page.getByRole('textbox', { name: 'Modelo', exact: true }).fill('Outro modelo');
  await confirm(page);
  await expect(page.getByRole('heading', { name: 'Nenhuma oferta encontrada', exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.audioAttempts)).toBe(0);
});
