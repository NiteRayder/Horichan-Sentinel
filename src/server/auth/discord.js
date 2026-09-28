import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { config, discordOAuthConfigured } from '../config.js';

if (discordOAuthConfigured) {
  passport.use(new DiscordStrategy({
    clientID: config.DISCORD_CLIENT_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: config.DISCORD_REDIRECT_URI,
    scope: ['identify', 'guilds'],
    state: true,
  }, (accessToken, _refreshToken, profile, done) => {
    done(null, {
      id: profile.id,
      username: profile.username,
      globalName: profile.global_name ?? profile.username,
      avatar: profile.avatar ?? null,
      accessToken,
    });
  }));
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export { passport };
