# Security Policy

Please do not publish credentials, session cookies, OAuth tokens, or exploitable vulnerabilities in public issues.

Report security concerns privately to the repository owner through GitHub's private vulnerability reporting feature, if enabled, or another private channel agreed with the maintainers.

## Security requirements

- Never expose Discord client secrets, bot tokens, session secrets, or Horichan API tokens to frontend code.
- Use HTTPS in production.
- Configure a persistent session store before production deployment. The default Express memory store is development-only.
- Verify user permissions and bot guild access server-side on every management endpoint.
- Validate and encode identifiers; do not trust client-supplied guild IDs.
- Request only the Discord OAuth scopes needed by implemented features.
