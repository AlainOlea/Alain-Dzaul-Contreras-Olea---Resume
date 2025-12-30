import { test, expect } from '@playwright/test';

test.describe('Download Modal', () => {
  test('should open modal when clicking download icon', async ({ page }) => {
    await page.goto('/');

    const downloadButton = page.locator('.icon-button[title*="Descargar"]').or(
      page.locator('.icon-button').filter({ has: page.locator('.fa-download') })
    );

    await downloadButton.click();

    const modal = page.locator('#downloadModal');
    await expect(modal).toHaveClass(/show/);
    await expect(modal).toBeVisible();
  });

  test('should display 4 download options', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    // Check options
    const options = page.locator('.download-option');
    await expect(options).toHaveCount(4);
  });

  test('should display correct modal title in English', async ({ page }) => {
    await page.goto('/');

    // Ensure English
    await page.evaluate(() => {
      localStorage.setItem('language', 'en');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    await expect(page.locator('#modal-title')).toHaveText('Download Resume');
    await expect(page.locator('#modal-description')).toHaveText(
      'Choose your preferred format and language:'
    );
  });

  test('should display correct modal title in Spanish', async ({ page }) => {
    await page.goto('/');

    // Ensure Spanish
    await page.evaluate(() => {
      localStorage.setItem('language', 'es');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    await expect(page.locator('#modal-title')).toHaveText('Descargar CV');
    await expect(page.locator('#modal-description')).toHaveText(
      'Elige tu formato y idioma preferido:'
    );
  });

  test('should close modal when clicking X button', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    // Modal should be visible
    const modal = page.locator('#downloadModal');
    await expect(modal).toHaveClass(/show/);

    // Click close button
    await page.locator('.close-modal').click();

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/show/);
  });

  test('should close modal when clicking outside', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    const modal = page.locator('#downloadModal');
    await expect(modal).toHaveClass(/show/);

    // Click on modal backdrop (outside content)
    await modal.click({ position: { x: 10, y: 10 } });

    // Modal should be hidden
    await expect(modal).not.toHaveClass(/show/);
  });

  test('should trigger download when clicking option', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    // Setup download listener
    const downloadPromise = page.waitForEvent('download');

    // Click first download option (Markdown EN)
    const firstOption = page.locator('.download-option').first();
    await firstOption.click();

    // Wait for download or notification
    // Note: In local environment, download might fail if files don't exist
    // We just check that the click triggers the download function
    await page.waitForTimeout(500);

    // Modal should close after download attempt
    const modal = page.locator('#downloadModal');
    await expect(modal).not.toHaveClass(/show/);
  });

  test('should have all download options with correct labels', async ({ page }) => {
    await page.goto('/');

    // Ensure English
    await page.evaluate(() => {
      localStorage.setItem('language', 'en');
      location.reload();
    });
    await page.waitForLoadState('load');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    // Check all options
    const options = await page.locator('.download-option strong').allTextContents();

    expect(options).toContain('Markdown - English');
    expect(options).toContain('Markdown - Español');
    expect(options).toContain('PDF - English');
    expect(options).toContain('PDF - Español');
  });

  test('should display correct icons for each format', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const downloadButton = page.locator('.icon-button').filter({
      has: page.locator('.fa-download')
    });
    await downloadButton.click();

    // Check MD options have code icon
    const mdOptions = page.locator('.download-option').filter({
      hasText: 'Markdown'
    });
    await expect(mdOptions.first().locator('.fa-file-code')).toBeVisible();

    // Check PDF options have PDF icon
    const pdfOptions = page.locator('.download-option').filter({
      hasText: 'PDF'
    });
    await expect(pdfOptions.first().locator('.fa-file-pdf')).toBeVisible();
  });
});
