import { test, expect } from '@playwright/test';

test.describe('Summary as a static list', () => {
  test('shows every summary item at once', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#summary-list li');
    expect(await items.count()).toBeGreaterThan(1);
  });

  test('has no carousel or pagination', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.summary-section .swiper')).toHaveCount(0);
    await expect(page.locator('.summary-section .swiper-pagination')).toHaveCount(0);
  });
});

test.describe('Experience as a static list', () => {
  test('renders all experience items without a carousel', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#experience-list .experience-item')).toHaveCount(4);
    await expect(page.locator('.experience-section .swiper')).toHaveCount(0);
  });

  test('marks the most recent position as the current job', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('#experience-list .experience-item').first();
    await expect(first).toHaveClass(/current-job/);
  });

  test('shows additional details inline without an expand button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.expand-btn')).toHaveCount(0);
    const expanded = page.locator('#experience-list .expanded-bullets');
    const count = await expanded.count();
    if (count > 0) {
      await expect(expanded.first()).toBeVisible();
    }
  });
});

test.describe('Credentials section', () => {
  test('groups education, certifications and languages under one section', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#credentials');
    await expect(section.locator('#education')).toHaveCount(1);
    await expect(section.locator('#certifications')).toHaveCount(1);
    await expect(section.locator('#languages')).toHaveCount(1);
  });
});
