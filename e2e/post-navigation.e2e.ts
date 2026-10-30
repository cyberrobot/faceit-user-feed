import { test, expect } from '@playwright/test';

test('supports post navigation, refresh and not-found handling', async ({
  page,
}) => {
  const postTitle = 'Why Gaming Means More Than Winning';
  const postUrl = '/posts/post-025';
  const finalSentence = "That's what makes the gaming community special.";

  // Load the feed.
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  // Scroll to the bottom to load page 2.
  await page.getByTestId('feed-sentinel').scrollIntoViewIfNeeded();

  const postCard = page.getByRole('article').filter({
    has: page.getByRole('heading', {
      name: postTitle,
      exact: true,
    }),
  });

  // Post 25 exists only on the second API page.
  await expect(postCard).toBeVisible({
    timeout: 15_000,
  });

  // Open the post using its actual link.
  await postCard.getByRole('link', { name: /view post/i }).click();

  await expect(page).toHaveURL(postUrl);

  const content = page.getByRole('article').locator('p').last();

  // Verify the full content, not the 100-character preview.
  await expect(content).toContainText(finalSentence);

  expect((await content.innerText()).length).toBeGreaterThan(100);

  // Return to the feed without refreshing.
  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  // Page 2 should still exist in the shared Redux store.
  await expect(
    page.getByRole('heading', {
      name: postTitle,
      exact: true,
    }),
  ).toBeVisible();

  // Reopen the post and refresh its detail page.
  await page
    .getByRole('article')
    .filter({
      has: page.getByRole('heading', {
        name: postTitle,
        exact: true,
      }),
    })
    .getByRole('link', { name: /view post/i })
    .click();

  await expect(page).toHaveURL(postUrl);

  await page.reload();

  await expect(page).toHaveURL(postUrl);
  await expect(page.getByRole('article').locator('p').last()).toContainText(
    finalSentence,
  );

  // Return to the feed after a full browser refresh.
  await page.getByRole('link', { name: /back to feed/i }).click();

  await expect(page).toHaveURL('/');

  // Redux has been recreated; initial data should load again.
  await expect(
    page.getByRole('heading', {
      name: 'An Early Morning Run',
    }),
  ).toBeVisible();

  // An invalid post must show the not-found page.
  await page.goto('/posts/does-not-exist');

  await expect(
    page.getByRole('heading', {
      name: 'Post not found',
    }),
  ).toBeVisible();

  await expect(
    page.getByRole('link', {
      name: 'Back to feed',
    }),
  ).toBeVisible();
});
