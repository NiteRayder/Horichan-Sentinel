# Architecture

Horichan Sentinel is intentionally separate from the Horichan bot repository.

## Request flow

1. The browser sends the user to `/auth/discord`.
2. Discord OAuth2 returns to the server callback.
3. Passport stores the authenticated identity and OAuth access token in the server-side session.
4. The browser calls same-origin `/api/*) endpoints using its HTTP-only session cookie.
5. The server queries Discord and, once configured, the trusted Horichan management API.

## Trust boundaries

- Browser: presentation and user interaction only. It is not trusted to enforce authorization.
- Sentinel server: owns OAuth secrets, session handling, and API credentials.
- Discord API: source for the user's current guild permissions.
- Horichan API: must independently validate the bot's guild membership and authorize each operation.

## Planned management API contract

The initial adapter expects `GET /guilds/:guildId/overview`. The real Horichan API must define and implement its contract before the dashboard can show real bot status or management data. Future endpoints should use explicit schemas, rate limits, audit records, and per-action authorization.

## Session storage

Express's default MemoryStore is used by this starter for local development only. Before production, configure a persistent session store such as PostgreSQL, use HTTPS, and set the correct proxy configuration for the hosting platform.
