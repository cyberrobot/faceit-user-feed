import { test, expect } from '@playwright/test';

test('restores loaded posts and viewport position', async ({ page }) => {
  let fetchCount = 0;

  page.on('request', (request) => {
    const url = new URL(request.url());

    if (url.pathname === '/api/posts') {
      fetchCount++;
    }
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  // Load page 2.
  await page.getByTestId('feed-sentinel').scrollIntoViewIfNeeded();

  await expect(page.getByRole('article')).toHaveCount(40);

  const card = page.locator('#feed-post-post-025');

  const link = card.getByRole('link', {
    name: /view post/i,
  });

  await link.scrollIntoViewIfNeeded();

  // Record its position before navigating.
  const beforeTop = await card.evaluate(
    (element) => element.getBoundingClientRect().top,
  );

  await link.click();

  await expect(page).toHaveURL('/posts/post-025');

  // Return using the application's back link.
  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  // Loaded state must be preserved.
  await expect(page.getByRole('article')).toHaveCount(40);

  // Check the actual viewport position.
  await expect
    .poll(async () => {
      const afterTop = await card.evaluate(
        (element) => element.getBoundingClientRect().top,
      );

      return Math.abs(afterTop - beforeTop);
    })
    .toBeLessThan(8);

  // No redundant page requests.
  expect(fetchCount).toBe(2);
});

test('restores location after live posts are prepended', async ({ page }) => {
  await page.clock.install();

  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  await page.getByTestId('feed-sentinel').scrollIntoViewIfNeeded();

  await expect(page.getByRole('article')).toHaveCount(40);

  const card = page.locator('#feed-post-post-025');

  const link = card.getByRole('link', {
    name: /view post/i,
  });

  await link.scrollIntoViewIfNeeded();

  const beforeTop = await card.evaluate(
    (element) => element.getBoundingClientRect().top,
  );

  await link.click();

  await expect(page).toHaveURL('/posts/post-025');

  // Simulate the next live event while on details.
  await page.clock.fastForward(10_000);

  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  // One live post has been prepended.
  await expect(page.getByRole('article')).toHaveCount(41);

  // The original post remains at its viewport location.
  await expect
    .poll(async () => {
      const afterTop = await card.evaluate(
        (element) => element.getBoundingClientRect().top,
      );

      return Math.abs(afterTop - beforeTop);
    })
    .toBeLessThan(8);
});
