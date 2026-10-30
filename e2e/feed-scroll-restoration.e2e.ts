import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Install the mock clock before navigating.
  await page.clock.install({
    time: new Date('2026-10-30T12:00:00Z'),
  });
});

async function loadFeedAndPauseEvents(page: Page) {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  await expect(page.getByRole('article')).toHaveCount(20);

  // Pause with enough margin to avoid a clock race.
  const now = await page.evaluate(() => Date.now());

  await page.clock.pauseAt(new Date(now + 2_000));

  await page.getByTestId('feed-sentinel').scrollIntoViewIfNeeded();

  await expect(page.getByRole('article')).toHaveCount(40);
}

test('restores loaded posts and viewport position', async ({ page }) => {
  let fetchCount = 0;

  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/posts') {
      fetchCount++;
    }
  });

  await loadFeedAndPauseEvents(page);

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

  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  await expect(page.getByRole('article')).toHaveCount(40);

  await expect
    .poll(async () => {
      const afterTop = await card.evaluate(
        (element) => element.getBoundingClientRect().top,
      );

      return Math.abs(afterTop - beforeTop);
    })
    .toBeLessThan(8);

  expect(fetchCount).toBe(2);
});

test('restores location after live posts are prepended', async ({ page }) => {
  await loadFeedAndPauseEvents(page);

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

  // Explicitly trigger the next live event.
  await page.clock.fastForward(10_000);

  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  // Exactly one live post should have arrived.
  await expect(page.getByRole('article')).toHaveCount(41);

  await expect
    .poll(async () => {
      const afterTop = await card.evaluate(
        (element) => element.getBoundingClientRect().top,
      );

      return Math.abs(afterTop - beforeTop);
    })
    .toBeLessThan(8);
});

test('restores position using browser Back', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  await page.getByTestId('feed-sentinel').scrollIntoViewIfNeeded();

  await expect(page.getByRole('article')).toHaveCount(40);

  const card = page.locator('#feed-post-post-025');
  const link = card.getByRole('link', { name: /view post/i });

  await link.scrollIntoViewIfNeeded();

  await link.click();

  await expect(page).toHaveURL('/posts/post-025');

  await page.goBack();

  await expect(page).toHaveURL('/');

  await expect(card).toBeInViewport();

  await expect(page.getByRole('article')).toHaveCount(40);
});
