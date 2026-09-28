import { Router } from 'express';
import { passport } from '../auth/discord.js';
import { discordOAuthConfigured } from '../config.js';

export const authRouter = Router();

authRouter.get('/discord', (req, res, next) => {
  if (!discordOAuthConfigured) {
    return res.status(503).send('Discord sign-in is not configured. Set the OAuth environment variables first.');
  }
  return passport.authenticate('discord')(req, res, next);
});

authRouter.get('/discord/callback', (req, res, next) => {
  if (!discordOAuthConfigured) return res.redirect('/?auth=unavailable');

  passport.authenticate('discord', {
    failureRedirect: '/?auth=failed',
  })(req, res, () => {
    req.session.regenerate((error) => {
      if (error) return next(error);
      req.login(req.user, (loginError) => {
        if (loginError) return next(loginError);
        return res.redirect('/dashboard');
      });
    });
  });
});
