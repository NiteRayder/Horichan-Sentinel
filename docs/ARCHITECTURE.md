# Architecture

Horichan Sentinel is intentionally separate from the Horichan bot repository.

## Request flow

1. The browser sends the user to `/auth/discord`.
2. Discord OAuth2 returns to the server callback.
3. Passport stores the authenticated identity and OAuth access token in the server-side session.
4. The browser calls same-origin `/api/*` endpoints using its HTTP-only session cookie.
5. Sentinel fetches the user's current Discord guild permissions.
6. Only after confirming Manage Server or Administrator access, Sentinel calls Horichan's versioned API over a server-to-server connection.

## Trust boundaries

- Browser: presentation and user interaction only. It is not trusted to enforce authorization.
- Sentinel server: owns OAuth secrets, session handling, and the shared Horichan API token.
- Discord API: source for the user's current guild permissions, checked on every guild overview request.
- Horichan API: authenticates Sentinel's service token and independently fetches the guild with Horichan's bot credentials. It returns an overview only when the bot can access the guild.

The bearer token authenticates the Sentinel service; it does not replace the per-user Discord authorization check. Never send the service token or bot token to the browser.

## Horichan API v1 contract

Set `HORICHAN_API_BASE_URL` to the private API origin (for example `http://127.0.0.1:3001` when both services run on one host) and set the same strong, unique `HORICHAN_API_TOKEN` in both services.

Every request uses `Authorization: Bearer <HORICHAN_API_TOKEN>` and receives `Cache-Control: no-store`.

- `GET /api/v1/health` — bot readiness, guild count, and process uptime.
- `GET /api/v1/guilds/:guildId/overview` — minimal guild details and bot identity/status.

Guild IDs must be Discord snowflakes. Horichan checks the bot's own Discord access for the requested guild. Unknown or inaccessible guilds return `404 guild_not_found`. The API does not expose member lists, roles, channels, or user OAuth data. It is read-only; no moderation or configuration actions are exposed yet.

The bot API binds to loopback by default. If Sentinel runs on another host, use an HTTPS-protected private connection or authenticated tunnel and restrict ingress to Sentinel. Do not expose the API directly to the public internet.

## Session storage

Express's default MemoryStore is used by this starter for local development only. Before production, configure a persistent session store such as PostgreSQL, use HTTPS, and set the correct proxy configuration for the hosting platform.
