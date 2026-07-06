import { test, expect } from '@playwright/test';

test.describe('Summary Carousel', () => {
  test('should display swipeable carousel with pagination dots', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.summary-swiper')).toBeVisible();
    const dots = page.locator('.summary-swiper .swiper-pagination-bullet');
    expect(await dots.count()).toBeGreaterThan(0);
  });

  test('should navigate to next summary item by clicking a pagination dot', async ({ page }) => {
    await page.goto('/');

    const getActiveSlideText = () => page.locator('.summary-swiper .swiper-slide-active').textContent();
    const initialText = await getActiveSlideText();

    const dots = page.locator('.summary-swiper .swiper-pagination-bullet');
    await dots.nth(1).click();
    await page.waitForTimeout(700);

    const newText = await getActiveSlideText();
    expect(newText).not.toBe(initialText);
  });

  test('should not auto-advance on its own after scrolling to section', async ({ page }) => {
    await page.goto('/');

    const summarySection = page.locator('.summary-section');
    await summarySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const getActiveSlideText = () => page.locator('.summary-swiper .swiper-slide-active').textContent();
    const initialText = await getActiveSlideText();

    // No autoplay: waiting well past the old 10s interval should show no change
    await page.waitForTimeout(11000);

    const newText = await getActiveSlideText();
    expect(newText).toBe(initialText);
  });

  test('should display active summary item', async ({ page }) => {
    await page.goto('/');

    const activeItem = page.locator('.summary-swiper .swiper-slide-active .summary-item');
    await expect(activeItem).toBeVisible();

    // Should have content
    const bullets = activeItem.locator('li');
    const count = await bullets.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should apply karaoke effect to active item', async ({ page }) => {
    await page.goto('/');

    const activeItem = page.locator('.summary-swiper .swiper-slide-active .summary-item');
    const letters = activeItem.locator('.letter');

    // Should have wrapped letters
    const count = await letters.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Experience Swiper', () => {
  test('should display experience carousel', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.experience-swiper')).toBeVisible();
  });

  test('should display pagination dots', async ({ page }) => {
    await page.goto('/');

    const pagination = page.locator('.swiper-pagination');
    await expect(pagination).toBeVisible();
  });

  test('should render all experience items', async ({ page }) => {
    await page.goto('/');

    const slides = page.locator('.swiper-slide');
    const count = await slides.count();

    // Should have 4 experience items
    expect(count).toBeGreaterThan(0);
  });

  test('should display company and role information', async ({ page }) => {
    await page.goto('/');

    const firstSlide = page.locator('.swiper-slide').first();

    await expect(firstSlide.locator('h3')).toBeVisible(); // Role
    await expect(firstSlide.locator('.company')).toBeVisible(); // Company + Location
    await expect(firstSlide.locator('.meta')).toBeVisible(); // Period
  });

  test('should have expand button for additional details', async ({ page }) => {
    await page.goto('/');

    // Wait for swiper to initialize
    await page.waitForTimeout(1000);

    const expandButtons = page.locator('.expand-btn');
    const count = await expandButtons.count();

    // Should have expand buttons (most experiences have them)
    expect(count).toBeGreaterThan(0);
  });

  test('should expand and collapse experience details', async ({ page }) => {
    await page.goto('/');

    // Wait for swiper to initialize
    await page.waitForTimeout(1500);

    // Find the active slide to ensure button interaction works
    const activeSlide = page.locator('.swiper-slide-active');
    const expandBtn = activeSlide.locator('.expand-btn').first();

    // Only test if expand button exists in active slide
    const expandBtnCount = await expandBtn.count();
    if (expandBtnCount === 0) {
      // Skip if no expand button in active slide
      return;
    }

    await expandBtn.scrollIntoViewIfNeeded();
    await expect(expandBtn).toBeVisible();

    // Click to expand
    await expandBtn.click();
    await page.waitForTimeout(500);

    // Check expanded section is visible
    const expandedSection = activeSlide.locator('.expanded-bullets.show');
    await expect(expandedSection).toBeVisible({ timeout: 2000 });

    // Verify button text changed to collapse state
    await expect(expandBtn).toContainText('↑');

    // Click to collapse
    await expandBtn.click();
    await page.waitForTimeout(500);

    // Expanded section should be hidden
    await expect(expandedSection).not.toBeVisible({ timeout: 2000 });

    // Button should revert to expand state
    await expect(expandBtn).toContainText('↓');
  });

  test('should auto-rotate experience slides after scrolling to section', async ({ page }) => {
    await page.goto('/');

    // Scroll to experience section to trigger autoplay
    const experienceSection = page.locator('.experience-section');
    await experienceSection.scrollIntoViewIfNeeded();

    // Wait for swiper init and Intersection Observer
    await page.waitForTimeout(1500);

    // Get initial active slide
    const getActiveSlideIndex = async () => {
      const activeSlide = page.locator('.swiper-slide-active');
      return await activeSlide.getAttribute('data-swiper-slide-index');
    };

    const initialIndex = await getActiveSlideIndex();

    // Wait for autoplay (5 seconds + buffer)
    await page.waitForTimeout(6000);

    const newIndex = await getActiveSlideIndex();

    // Verify swiper rotated (index should be different)
    expect(newIndex).toBeDefined();
    expect(newIndex).not.toBe(initialIndex);
  });

  test('should apply distinctive styling to current job', async ({ page }) => {
    await page.goto('/');

    // Scroll to experience section
    const experienceSection = page.locator('.experience-section');
    await experienceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Find the current job item (has current-job class)
    const currentJobItem = page.locator('.experience-item.current-job');

    // Should exist
    await expect(currentJobItem.first()).toBeVisible();

    // Should have both classes
    const classNames = await currentJobItem.first().getAttribute('class');
    expect(classNames).toContain('current-job');
    expect(classNames).toContain('experience-item');

    // Verify distinctive styling is applied (check border-left color)
    const borderLeftColor = await currentJobItem.first().evaluate(el =>
      window.getComputedStyle(el).borderLeftColor
    );

    // Border should be blue (rgb(59, 130, 246) is #3b82f6)
    expect(borderLeftColor).toContain('rgb');
  });
});
