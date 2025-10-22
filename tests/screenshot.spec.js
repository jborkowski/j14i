const { test, expect } = require('@playwright/test');

test.describe('TiL Microblog Screenshots', () => {
  test('homepage - desktop dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'screenshots/homepage-desktop-dark.png',
      fullPage: true,
    });
  });

  test('homepage - desktop light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click theme toggle to switch to light mode
    await page.click('#themeToggle');
    await page.waitForTimeout(300); // Wait for theme transition

    await page.screenshot({
      path: 'screenshots/homepage-desktop-light.png',
      fullPage: true,
    });
  });

  test('homepage - mobile dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/homepage-mobile-dark.png',
      fullPage: true,
    });
  });

  test('homepage - mobile light mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Switch to light mode
    await page.click('#themeToggle');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'screenshots/homepage-mobile-light.png',
      fullPage: true,
    });
  });

  test('post page - desktop dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the first post
    const firstPost = await page.locator('.post-title a').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: 'screenshots/post-page-desktop-dark.png',
        fullPage: true,
      });
    }
  });

  test('post page - desktop light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the first post
    const firstPost = await page.locator('.post-title a').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // Switch to light mode
      await page.click('#themeToggle');
      await page.waitForTimeout(300);

      await page.screenshot({
        path: 'screenshots/post-page-desktop-light.png',
        fullPage: true,
      });
    }
  });

  test('feed interaction - hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hover over first post
    const firstPost = await page.locator('.post-item').first();
    if (await firstPost.isVisible()) {
      await firstPost.hover();
      await page.waitForTimeout(200); // Wait for hover transition

      await page.screenshot({
        path: 'screenshots/feed-hover-state.png',
        fullPage: false,
      });
    }
  });

  test('tablet view - dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/homepage-tablet-dark.png',
      fullPage: true,
    });
  });
});

test.describe('Visual Verification Tests', () => {
  test('verify theme toggle button exists', async ({ page }) => {
    await page.goto('/');

    const themeToggle = await page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();

    // Take screenshot of just the toggle
    await themeToggle.screenshot({
      path: 'screenshots/theme-toggle-button.png',
    });
  });

  test('verify feed layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that posts are displayed
    const posts = await page.locator('.post-item');
    const count = await posts.count();

    expect(count).toBeGreaterThan(0);

    // Verify avatar, author, and timestamp are visible
    if (count > 0) {
      const firstPost = posts.first();
      await expect(firstPost.locator('.post-avatar')).toBeVisible();
      await expect(firstPost.locator('.post-author')).toBeVisible();
      await expect(firstPost.locator('.post-date')).toBeVisible();
    }
  });

  test('verify responsive design', async ({ page }) => {
    const viewports = [
      { name: 'mobile-portrait', width: 375, height: 667 },
      { name: 'mobile-landscape', width: 667, height: 375 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify the page is readable at this viewport
      const container = await page.locator('.container');
      await expect(container).toBeVisible();
    }
  });
});
