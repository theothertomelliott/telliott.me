import { test, expect } from '@playwright/test';

test.describe('Navigation Menu Responsiveness', () => {
  test('desktop shows full menu', async ({ page, isMobile }) => {
    // This test will run on desktop projects (Chrome, Firefox, Safari)
    test.skip(isMobile, 'This test only runs on desktop devices');
    
    await page.goto('/');

    // On desktop, nav links should be visible and menu button hidden
    await expect(page.locator('.nav-links')).toBeVisible();
    await expect(page.locator('.menu')).toBeHidden();
    
    // Verify menu content
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(6);
    await expect(links.locator('nth=0')).toHaveText('Blog');
    await expect(links.locator('nth=1')).toHaveText('Podcasts');
    await expect(links.locator('nth=2')).toHaveText('Talks');
  });

  test('mobile shows hamburger menu', async ({ page, isMobile }) => {
    // This test will run on mobile projects (Pixel 5, iPhone 12)
    test.skip(!isMobile, 'This test only runs on mobile devices');
    
    await page.goto('/');

    // On mobile, menu button should be visible and nav links hidden
    await expect(page.locator('.menu')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
    await expect(page.locator('.menu')).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu expands and collapses', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test only runs on mobile devices');
    
    await page.goto('/');
    
    const menuButton = page.locator('.menu');
    const navLinks = page.locator('.nav-links');
    
    // Expand menu
    await menuButton.click();
    await expect(navLinks).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Verify that navigation links are now visible and clickable
    await expect(navLinks.locator('a[href="/"]')).toBeVisible();
    await expect(navLinks.locator('a[href="/podcasts/"]')).toBeVisible();
    await expect(navLinks.locator('a[href="/talks/"]')).toBeVisible();
    
    // Collapse menu
    await menuButton.click();
    await expect(navLinks).toBeHidden();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu content is consistent across all devices', async ({ page }) => {
    await page.goto('/');

    // For mobile, open the menu first
    const menuButton = page.locator('.menu');
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // Check menu content
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(6);
    
    const linkTexts = await links.allTextContents();
    const linkHrefs = await Promise.all(
      await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    );
    
    // Verify specific links exist
    expect(linkHrefs).toContain('/');
    expect(linkHrefs).toContain('/podcasts/');
    expect(linkHrefs).toContain('/talks/');
    expect(linkTexts).toContain('Blog');
    expect(linkTexts).toContain('Podcasts');
    expect(linkTexts).toContain('Talks');
  });

  test('menu adapts to viewport changes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test only runs on desktop devices');
    
    await page.goto('/');

    // Start with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.menu')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
    
    // Resize to desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.menu')).toBeHidden();
    await expect(page.locator('.nav-links')).toBeVisible();
    
    // Resize back to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.menu')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
  });
});
