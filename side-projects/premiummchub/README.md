# Premium MC Hub

A full-stack catalog of Minecraft clients, mods and macros with a public storefront-style UI and a password-protected admin panel. Data is stored in Upstash Redis and served through a Vercel serverless API, so changes sync across every browser and device.

**Live demo:** https://premiummchub.vercel.app

> The visual design is modeled after the existing site premiumvault.vercel.app. The code in this repository is my own implementation.

## Features

**Public site**
- Home page with hero, stats, featured, popular and recent items
- Browse clients and mods/macros with filtering, sorting and pagination
- Item detail pages with image gallery and download buttons (each click is logged)
- Full-text search across name, description, content, author and tags

**Admin panel**
- Login-protected dashboard with stats, recent downloads and backend status
- Create, edit and delete clients, mods and macros
- Media manager with image upload (stored as base64)
- Analytics: 30-day chart, top items, breakdown by type
- Site settings: site name, SEO, upload limit, data reset

## Tech stack

| Area | Tools |
| ---- | ----- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 3 |
| Routing | react-router-dom v6 |
| Charts / icons | recharts, lucide-react |
| Backend | Vercel Serverless Function (`api/data.js`) |
| Database | Upstash Redis (`@upstash/redis`) |
| Hosting | Vercel |

## Security model

- **Server-side authentication.** `POST /api/data?action=login` checks the admin credentials against server-only environment variables (constant-time comparison) and returns an HMAC-signed session token that expires after 8 hours. Changing the admin password invalidates all sessions.
- **Protected writes.** Every write action (`items`, `media`, `settings`, `downloads`, `analytics`, `reset`) and the admin-only reads (`downloads`, `analytics`) require `Authorization: Bearer <token>`. The browser UI redirects are only a convenience; the API enforces access.
- **Visibility.** Anonymous visitors only receive published, non-archived items. Drafts and download logs are admin-only.
- **Abuse limits.** Login attempts (10 per 15 min per IP) and public download logging (30 per minute per IP) are rate-limited with Redis counters.
- **No secrets in the browser.** Credentials are never prefixed with `VITE_`, so they are not bundled into the client build. Same-origin API, no wildcard CORS, basic security headers via `vercel.json`.

## Project structure

```
api/data.js              Single serverless function: auth, validation, data actions
src/lib/api.ts           Typed API wrapper (adds the session token to requests)
src/lib/auth.ts          Login / logout / session helpers
src/lib/DataContext.tsx  Loads all data on mount and exposes it to the app
src/pages/               Public pages
src/pages/admin/         Admin pages
src/components/          Shared UI components
```

## Getting started

```bash
npm install
npm run dev
```

The serverless API only runs on Vercel. Locally, the UI falls back to an in-memory seed so you can still inspect the design.

### Environment variables

Copy `.env.example` to `.env.local` and fill in your own values. Never commit real credentials.

| Name | Description |
| ---- | ----------- |
| `ADMIN_USERNAME` | Admin username (server-side) |
| `ADMIN_PASSWORD` | Admin password (server-side) |
| `SESSION_SECRET` | Long random string used to sign session tokens |
| `UPSTASH_REDIS_REST_URL` | REST URL from your Upstash database |
| `UPSTASH_REDIS_REST_TOKEN` | REST token from your Upstash database |

### Deploy

1. Push the repo to GitHub and import it into Vercel.
2. Create a free Upstash Redis database.
3. Add the environment variables above in the Vercel project settings.
4. Deploy. The catalog is seeded automatically on the first request.

## Roadmap

- Store uploaded media in object storage instead of base64.
- Add automated tests.
- Add a CSP header and per-item pagination in the API.

## License

Released under the MIT License. See [LICENSE](LICENSE). The visual design is modeled after another site and is not covered by this license.

## Author

Sandro Iobidze - https://github.com/sandro9800
