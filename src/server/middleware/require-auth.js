export function requireAuth(req, res, next) {
  if (!req.isAuthenticated?.() || !req.user?.accessToken) {
    return res.status(401).json({ error: 'authentication_required' });
  }
  return next();
}
