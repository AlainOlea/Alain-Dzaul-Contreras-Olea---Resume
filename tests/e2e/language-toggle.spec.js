import { test, expect } from '@playwright/test';

test.describe('Language Toggle Functionality', () => {
  test('should toggle language from English to Spanish', async ({ page }) => {
    await page.goto('/');

    // Ensure we start in English
    await expect(page.locator('#job-title')).toHaveText('QA Engineer / SDET');

    // Click language toggle
    await page.locator('.language-toggle').click();

    // Check content changed to Spanish
    await expect(page.locator('#job-title')).toHaveText('QA Engineer / SDET');
    await expect(page.locator('#summary-title')).toHaveText('Resumen Profesional');
    await expect(page.locator('#experience-title')).toHaveText('Experiencia');
  });

  test('should toggle language button text', async ({ page }) => {
    await page.goto('/');

    const languageButton = page.locator('#language-text');

    // Should show opposite language (if EN, show ES button)
    const initialText = await languageButton.textContent();
    expect(['EN', 'ES']).toContain(initialText);

    // Click to toggle
    await page.locator('.language-toggle').click();

    // Text should have switched
    const newText = await languageButton.textContent();
    expect(newText).not.toBe(initialText);
    expect(['EN', 'ES']).toContain(newText);
  });

  test('should persist language preference after reload', async ({ page }) => {
    await page.goto('/');

    // Switch to Spanish
    const initialTitle = await page.locator('#summary-title').textContent();
    await page.locator('.language-toggle').click();
    await page.waitForTimeout(500); // Wait for localStorage to update

    const changedTitle = await page.locator('#summary-title').textContent();
    expect(changedTitle).not.toBe(initialTitle);

    // Reload page
    await page.reload();

    // Language should persist
    await expect(page.locator('#summary-title')).toHaveText(changedTitle);
  });

  test('should update all section titles when toggling language', async ({ page }) => {
    await page.goto('/');

    // Ensure English first
    await page.evaluate(() => {
      localStorage.setItem('language', 'en');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Toggle to Spanish
    await page.locator('.language-toggle').click();

    // Check all titles updated
    await expect(page.locator('#summary-title')).toHaveText('Resumen Profesional');
    await expect(page.locator('#experience-title')).toHaveText('Experiencia');
    await expect(page.locator('#education-title')).toHaveText('Educación');
    await expect(page.locator('#skills-title')).toHaveText('Habilidades');
    await expect(page.locator('#certifications-title')).toHaveText('Certificaciones y Licencias');
    await expect(page.locator('#languages-title')).toHaveText('Idiomas');
  });

  test('should update achievement labels when toggling language', async ({ page }) => {
    await page.goto('/');

    // Switch to Spanish
    await page.evaluate(() => {
      localStorage.setItem('language', 'es');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Check achievement labels are in Spanish
    const achievementLabels = page.locator('.achievement-label');
    const firstLabel = await achievementLabels.first().textContent();

    expect(firstLabel).toContain('Tests automatizados creados');
  });

  test('should update skills categories when toggling language', async ({ page }) => {
    await page.goto('/');

    // Switch to Spanish
    await page.evaluate(() => {
      localStorage.setItem('language', 'es');
    });

    // Reload and wait for navigation to complete
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for skills section to be visible
    await expect(page.locator('#skills-title')).toBeVisible();

    // Check skills categories
    const categoryTitles = await page.locator('.skills-category h3').allTextContents();

    expect(categoryTitles).toContain('Herramientas de Desarrollo con IA');
    expect(categoryTitles).toContain('Lenguajes de Programación');
  });

  test('should switch language by clicking language item', async ({ page }) => {
    await page.goto('/');

    // Ensure we start in English
    await page.evaluate(() => {
      localStorage.setItem('language', 'en');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Click on Spanish language item
    const languageItems = page.locator('.language-item');
    const spanishItem = languageItems.filter({ hasText: /Spanish|Español/ });
    await spanishItem.click();

    // Should switch to Spanish
    await expect(page.locator('#experience-title')).toHaveText('Experiencia');
  });
});
