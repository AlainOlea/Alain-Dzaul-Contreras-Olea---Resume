import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Main container should be visible
    await expect(page.locator('.container')).toBeVisible();

    // Profile section should be visible
    await expect(page.locator('.profile-section')).toBeVisible();

    // All sections should stack vertically
    const profileSection = page.locator('.profile-section');
    const box = await profileSection.boundingBox();

    // Width should be less than viewport (accounting for padding)
    expect(box.width).toBeLessThanOrEqual(375);
  });

  test('should display correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.profile-section')).toBeVisible();

    // Check that content is readable
    const name = page.locator('.name');
    await expect(name).toBeVisible();
  });

  test('should display correctly on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('.container')).toBeVisible();

    // Container should have max-width constraint
    const container = page.locator('.container');
    const box = await container.boundingBox();

    // Max width is 900px
    expect(box.width).toBeLessThanOrEqual(900);
  });

  test('should maintain image aspect ratio on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const profileImage = page.locator('.profile-image');
    await expect(profileImage).toBeVisible();

    const box = await profileImage.boundingBox();

    // Image should not overflow viewport
    expect(box.width).toBeLessThanOrEqual(375);
  });

  test('should show readable text on all screen sizes', async ({ page }) => {
    const sizes = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.goto('/');

      const name = page.locator('.name');
      await expect(name).toBeVisible();

      const jobTitle = page.locator('#job-title');
      await expect(jobTitle).toBeVisible();
    }
  });

  test('should adapt carousel controls for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Carousel controls should still be visible
    await expect(page.locator('.carousel-btn.prev')).toBeVisible();
    await expect(page.locator('.carousel-btn.next')).toBeVisible();
  });

  test('should make contact icons accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const contactIcons = page.locator('.contact-icons .icon-button');
    const count = await contactIcons.count();

    // All 5 icons should be visible
    expect(count).toBe(5);

    // Icons should be tappable (have sufficient size)
    for (let i = 0; i < count; i++) {
      const icon = contactIcons.nth(i);
      await expect(icon).toBeVisible();
    }
  });
});

test.describe('Mobile section nav', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('renders the nav as a horizontal swiper on mobile', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('#sidebar-nav');
    await expect(nav).toBeVisible();

    const box = await nav.boundingBox();
    expect(box.width).toBeGreaterThan(300); // spans (most of) the viewport width instead of a narrow side rail

    await expect(page.locator('#sidebar-nav-swiper.swiper-initialized')).toHaveCount(1);
  });
});
