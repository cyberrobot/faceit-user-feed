# FACEIT User Feed

A paginated user feed built using Next.js App Router,
React, TypeScript and Redux Toolkit.

## Requirements

- Node.js: 24.15+ (24.x)
- npm
- Internet access for installation and external avatars

No environment variables or external API keys are required.

## Getting started

Install dependencies:

```bash
npm ci
```

If using NVM, run `nvm install` and `nvm use` before installing dependencies.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm run start
```

## Testing

```bash
npm run lint
npm run test
```

For browser tests, first install Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

The Playwright configuration starts its own development
server on port 3100, so a separate server is not required.

On Linux, Playwright may require system dependencies (`npx playwright install --with-deps chromium`). Browser tests use Chromium only.

## Features and architecture

- **Feed:** Shows 20 API posts per page. `IntersectionObserver` loads subsequent pages near the bottom; the UI includes loading, empty, error and retry states. Feed previews truncate the body to 100 characters.
- **Post details:** `/posts/[id]` displays full content and supports direct URLs, refreshes, back navigation and not-found handling. Known mock post IDs are available at build time.
- **Redux Toolkit:** `lib/features/feed/feedSlice.ts` stores posts in `postsById`, preserves display order in `feedIds`, and tracks the next page, loading, errors and end-of-feed state. A memoised selector derives the visible posts. Request guards prevent overlapping page loads and unnecessary requests after the last page.
- **Persistent subscription:** `FeedUpdatesSubscriber`, mounted within the root `StoreProvider`, continues receiving simulated posts while the user is viewing a detail page. Returning to the feed retains in-memory state.
- **Post highlighting:** Newly received posts are highlighted for four seconds. Duplicate events do not restart the highlight timer.
- **Scroll restoration:** Returning from post details restores the previous feed position and loaded posts, even when new posts arrive during navigation.

Key locations: `app/components/feed/` (UI), `app/api/posts/` (route handlers), `lib/data/` (mock records), `lib/mocks/mockPostEvents.ts` (event source), `lib/features/feed/feedSlice.ts` (state), `e2e/` (browser tests).

## Mock REST API

Next.js route handlers read from **40 fixed posts** in `lib/data/posts.ts`; no backend service is required.

| Request                   | Behaviour                                                |
| ------------------------- | -------------------------------------------------------- |
| `GET /api/posts?page=1`   | First 20 posts (also the default when `page` is omitted) |
| `GET /api/posts?page=2`   | Remaining 20 posts                                       |
| `GET /api/posts?page=3`   | Empty posts array                                        |
| `GET /api/posts?page=0`   | HTTP 400 for invalid page number                         |
| `GET /api/posts/post-025` | Full post object                                         |
| `GET /api/posts/unknown`  | HTTP 404                                                 |

A list response has the shape:

```json
{
  "posts": [],
  "page": 1,
  "pageSize": 20,
  "total": 40
}
```

`posts` above is abbreviated to an empty array to illustrate the response structure; page 1 actually returns 20 post objects. Each post includes an ID, title, author, content and creation timestamp.

## Simulated real-time updates

This is a **browser timer**, not SSE or WebSockets. `subscribeToMockPosts()` emits one of **22 predefined live posts every 10 seconds** and stops after the last event. The root-level subscriber dispatches `postReceived` to Redux; new IDs are prepended and duplicates are updated without creating extra cards. These events **do not advance API pagination**: 20 API posts plus 10 live posts correctly results in 30 visible cards. The subscription survives in-app navigation but restarts after a full page reload.

## Design decisions and limitations

| Choice                             | Reason / limitation                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local mock API                     | Reproducible without credentials or backend; records are fixed, with no writes or persistence.                                                    |
| Redux normalised state             | Keeps feed data across route navigation and deduplicates by ID; state resets on full refresh.                                                     |
| Page-based pagination              | Simple and predictable for a fixed dataset; a changing production feed would favour cursor-based pagination.                                      |
| Timer-based events                 | Easy to demonstrate and test; not a real multi-client push system, with only 22 events.                                                           |
| All loaded cards rendered          | Straightforward at this scale; very long feeds may need virtualisation.                                                                           |
| Remote avatars with local fallback | Missing/failed avatars have a fallback; working remote images still depend on network access.                                                     |
| Navigation                         | Feed state and scroll position are preserved during client-side navigation; a full page reload resets the in-memory state.                        |
| Tests                              | Vitest covers logic/components and Playwright covers browser flows and accessibility checks; not exhaustive cross-browser or real-device testing. |

Possible production extensions include a durable API, cursor pagination, SSE/WebSocket reconnect and replay handling, persistent client cache, scroll restoration and virtualised lists. These are **not implemented** in this exercise.
