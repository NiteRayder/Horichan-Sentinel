# AGENTS.md — Horichan Sentinel (Base44)

## What this is

Horichan Sentinel: an Express + Vite/React dashboard for managing Horichan Discord
servers. Discord OAuth2 sign-in, session-backed identity, server list from Discord,
and a fail-closed integration boundary for the Horichan bot API.

## Stack

- Node.js 22 (see `.nvmrc`), npm (no lockfile is committed; `npm install` creates one)
- Express server (`src/server/`) on port 3000 — serves `/health`, `/auth/*`, `/api/*`, `/logout`
- Vite + React client (`src/client/`) — Vite proxies `/api`, `/auth`, `/logout` to Express
- No database required for local dev (in-memory session store); `connect-pg-simple` + `pg` are present for production session storage only

## Running here (docker compose)

`docker compose -f docker-compose.base44.yml up -d` starts a single `app` service
(node:22 image, source bind-mounted at /app):

- `npm install` runs on container startup, then `concurrently` launches:
  - `node --watch src/server/index.js` (Express on port 3000 inside the container)
  - `vite --host 0.0.0.0 --port 5173` (Vite dev server)
- Host port 3000 maps to container port 5173 (Vite = the web entry point).
- Vite proxies `/api`, `/auth`, `/logout` to `http://localhost:3000` (Express) inside the container.
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through so Vite accepts the preview proxy Host header.

## Environment / secrets

All Discord and Horichan API vars are optional at boot — the app starts and shows a
landing page without them. `SESSION_SECRET` has a dev fallback but a generated
placeholder is delivered via `/run/base44/app.env`.

To enable Discord sign-in, the user must provide `DISCORD_CLIENT_ID`,
`DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI` (set to
`https://3000-${BASE44_PUBLIC_HOST_SUFFIX}/auth/discord/callback` for the preview)
and add that exact URI to their Discord app's OAuth2 Redirects.

## Verifying it works

- `curl -sf localhost:3000/health` → `{"status":"ok"}` (Express)
- Loading the preview shows the Sentinel landing page with a "Continue with Discord" button
- Without Discord credentials, `/auth/discord` returns 503 (expected)
- `npm test` runs the server integration tests (`node --test`)
- `npm run lint` runs ESLint

## Key files

- `src/server/config.js` — Zod-validated env config; all Discord/Horichan vars optional
- `src/server/auth/discord.js` — passport-discord strategy (only registered when configured)
- `src/server/routes/api.js` — `/api/me`, `/api/guilds`, `/api/guilds/:id/overview`
- `src/server/integrations/horichan.js` — fail-closed adapter for the bot API
- `src/client/ui/App.jsx` — full dashboard UI (landing + authenticated dashboard)
