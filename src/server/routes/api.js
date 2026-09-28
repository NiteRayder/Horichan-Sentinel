import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { fetchManageableGuilds } from '../integrations/discord.js';
import { isHorichanApiConfigured, horichanRequest } from '../integrations/horichan.js';

export const apiRouter = Router();

apiRouter.get('/me', requireAuth, (req, res) => {
  const { id, username, globalName, avatar } = req.user;
  res.set('Cache-Control', 'no-store');
  res.json({ user: { id, username, globalName, avatar } });
});

apiRouter.get('/guilds', requireAuth, async (req, res, next) => {
  try {
    const guilds = await fetchManageableGuilds(req.user.accessToken);
    res.set('Cache-Control', 'no-store');
    res.json({ guilds });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/guilds/:guildId/overview', requireAuth, async (req, res, next) => {
  try {
    // Validate access to the guild through the user's current Discord permissions.
    const guilds = await fetchManageableGuilds(req.user.accessToken);
    const guild = guilds.find((item) => item.id === req.params.guildId);
    if (!guild) return res.status(403).json({ error: 'guild_access_denied' });

    if (!isHorichanApiConfigured()) {
      return res.json({
        guild,
        botConnected: null,
        integrationConfigured: false,
        message: 'Horichan API integration is not configured yet.',
      });
    }

    // The Horichan API must independently verify that Horichan is in this guild
    // and that the caller is authorized for the requested operation.
    const overview = await horichanRequest(`/guilds/${encodeURIComponent(guild.id)}/overview`);
    return res.json({
      guild,
      botConnected: typeof overview?.botConnected === 'boolean' ? overview.botConnected : null,
      integrationConfigured: true,
      overview,
    });
  } catch (error) {
    return next(error);
  }
});
