import { expect, test } from '@playwright/test';

test('navigation labels fit, all screens scroll above the bar, and preferences persist', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('tab', { name: 'Início' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const header = await page.getByTestId('brand-header').boundingBox();
  const viewport = page.viewportSize()!;
  expect(header!.x).toBe(0);
  expect(header!.width).toBe(viewport.width);
  expect(header!.height).toBeLessThan(viewport.height / 2);
  await expect(page.getByRole('button', { name: 'Fotografar produto, em breve' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Escolher da galeria, em breve' })).toBeDisabled();
  await expect.poll(() => page.getByTestId('header-description').evaluate(element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return text.width <= box.width + 1 && text.height <= parseFloat(getComputedStyle(element).lineHeight);
  })).toBe(true);
  await page.screenshot({ path: `artifacts/home-brand-${viewport.width}x${viewport.height}.png` });

  for (const [name, lastText] of [
    ['Início', 'Protótipo visual. Nenhuma imagem é enviada.'],
    ['Histórico', 'Quando disponível, pesquisar novamente fará uma nova consulta às ofertas.'],
    ['Preferências', 'Apenas suas preferências são salvas. Nenhuma imagem é enviada.'],
  ]) {
    await page.getByRole('tab', { name, exact: true }).click();
    await expect(page.getByRole('tab', { name, exact: true })).toHaveAttribute('aria-selected', 'true');
    const geometry = await page.getByRole('tab').evaluateAll(tabs => tabs.map(tab => {
      const rect = tab.getBoundingClientRect();
      const label = Array.from(tab.querySelectorAll('*')).find(el => ['Início', 'Histórico', 'Preferências'].includes(el.textContent || ''))!;
      const labelRect = label.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(label);
      const ink = range.getBoundingClientRect();
      return { tabTop: rect.top, tabBottom: rect.bottom, labelTop: labelRect.top,
        labelBottom: labelRect.bottom, labelHeight: labelRect.height, inkTop: ink.top, inkBottom: ink.bottom,
        viewportHeight: innerHeight };
    }));
    for (const bounds of geometry) {
      expect(bounds.labelHeight).toBeGreaterThanOrEqual(16);
      expect(bounds.inkTop).toBeGreaterThanOrEqual(bounds.labelTop - 1);
      expect(bounds.inkBottom).toBeLessThanOrEqual(bounds.labelBottom + 1);
      expect(bounds.labelBottom).toBeLessThanOrEqual(bounds.tabBottom);
      expect(bounds.tabBottom).toBeLessThanOrEqual(bounds.viewportHeight);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const end = page.getByText(lastText!, { exact: true });
    await end.scrollIntoViewIfNeeded();
    const endBox = await end.boundingBox();
    expect(endBox!.y + endBox!.height).toBeLessThanOrEqual(geometry[0]!.tabTop);
    await page.screenshot({ path: `artifacts/${testInfo.project.name}-${name}.png` });
  }

  const sound = page.getByRole('switch', { name: 'Som ao encontrar' });
  const haptics = page.getByRole('switch', { name: 'Feedback tátil ao encontrar' });
  await expect(sound).toBeEnabled();
  await expect(sound).not.toBeChecked();
  await expect(haptics).not.toBeChecked();
  await sound.check();
  await haptics.check();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('@onde-comprar/preferences/v1')))
    .toBe('{"soundEnabled":true,"hapticsEnabled":true}');
  await page.reload();
  await expect(sound).toBeChecked();
  await expect(haptics).toBeChecked();
});
