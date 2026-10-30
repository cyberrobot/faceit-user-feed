# FACEIT User Feed

A paginated user feed built using Next.js App Router,
React, TypeScript and Redux Toolkit.

## Requirements

- Node.js: [tested version]
- npm
- Internet access for installation and external avatars

No environment variables or external API keys are required.

## Getting started

Install dependencies:

```bash
npm ci
```

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
