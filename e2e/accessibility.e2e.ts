import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('opens a post using keyboard navigation', async ({ page }) => {
  await page.goto('/');

  const firstLink = page.getByRole('link', {
    name: 'View post by An Early Morning Run',
  });

  await expect(firstLink).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(firstLink).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/posts\/post-001$/);

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  const backLink = page.getByRole('link', {
    name: /Back to feed/,
  });

  await backLink.focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('/');
});

test('renders without overflow or console errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.setViewportSize({
    width: 320,
    height: 700,
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  expect(hasHorizontalOverflow).toBe(false);
  expect(errors).toEqual([]);
});

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
