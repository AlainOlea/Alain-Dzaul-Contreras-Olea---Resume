import { test, expect } from '@playwright/test';

test.describe('Basic Navigation and Page Load', () => {
  test('should load page without console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    expect(consoleErrors).toHaveLength(0);
  });

  test('should display all main sections', async ({ page }) => {
    await page.goto('/');

    // Check all sections are visible
    await expect(page.locator('.profile-section')).toBeVisible();
    await expect(page.locator('.achievements-section')).toBeVisible();
    await expect(page.locator('.summary-section')).toBeVisible();
    await expect(page.locator('.experience-section')).toBeVisible();
    await expect(page.locator('.education-section')).toBeVisible();
    await expect(page.locator('.skills-section')).toBeVisible();
    await expect(page.locator('.certifications-section')).toBeVisible();
    await expect(page.locator('.languages-section')).toBeVisible();
  });

  test('should load profile image correctly', async ({ page }) => {
    await page.goto('/');

    const profileImage = page.locator('.profile-image');
    await expect(profileImage).toBeVisible();

    // Check image has loaded (naturalWidth > 0 means loaded)
    const isLoaded = await profileImage.evaluate(img => img.naturalWidth > 0);
    expect(isLoaded).toBe(true);
  });

  test('should display correct page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Alain Dzaul Contreras Olea - SDET Quality Assurance/);
  });

  test('should have correct meta description', async ({ page }) => {
    await page.goto('/');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');

    expect(content).toContain('SDET Quality Assurance Engineer');
    expect(content).toContain('4+ years');
  });

  test('should display name with typing animation', async ({ page }) => {
    await page.goto('/');

    const name = page.locator('.name');
    await expect(name).toBeVisible();
    await expect(name).toHaveText('Alain Dzaul Contreras Olea');
  });

  test('should display job title', async ({ page }) => {
    await page.goto('/');

    const title = page.locator('#job-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/Quality Assurance|Aseguramiento de Calidad/);
  });

  test('should display all contact icons', async ({ page }) => {
    await page.goto('/');

    const contactIcons = page.locator('.contact-icons .icon-button');
    const count = await contactIcons.count();

    // Email, Phone, LinkedIn, Download, Language Toggle
    expect(count).toBe(5);
  });

  test('should not render the old sidebar mini-graph, and should render one full-screen node graph', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#sidebar-graph')).toHaveCount(0);
    await expect(page.locator('#node-graph')).toHaveCount(1);
    await expect(page.locator('#node-graph')).toBeVisible();
  });

  test('should not apply the typewriter effect to section h2 headers', async ({ page }) => {
    await page.goto('/');

    const typingHeaders = await page.locator('h2.h2-typing').count();
    expect(typingHeaders).toBe(0);
  });
});
