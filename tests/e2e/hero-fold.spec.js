import { test, expect } from '@playwright/test';

// El hero ocupa la primera pantalla: el título de "Key Achievements" no debe asomar.
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
  { width: 844, height: 390 },
];

test.describe('Hero fills the first screen', () => {
  for (const vp of viewports) {
    test(`achievements heading is below the fold at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForTimeout(2200); // intro animations
      const top = await page.evaluate(() => document.querySelector('#achievements h2').getBoundingClientRect().top);
      expect(top).toBeGreaterThanOrEqual(vp.height);
    });
  }
});
