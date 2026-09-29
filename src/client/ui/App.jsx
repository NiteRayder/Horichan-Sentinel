import { useEffect, useState } from 'react';
import Dashboard from './Dashboard.jsx';

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    server: <><rect x="3" y="4" width="18" height="6" rx="2" /><rect x="3" y="14" width="18" height="6" rx="2" /><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

function Brand({ compact = false }) {
  return <div className="brand">
    <div className="brand-mark"><Icon name="shield" size={22} /></div>
    {!compact && <div className="brand-copy"><strong>HORICHAN<span> SENTINEL</span></strong><small>HORIZON FORGE STUDIOS</small></div>}
  </div>;
}

function DiscordMark() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.7 5.1a18.3 18.3 0 0 0-4.5-1.4l-.6 1.2a16.5 16.5 0 0 0-5.2 0l-.6-1.2a18.3 18.3 0 0 0-4.5 1.4C1.5 9.3.7 13.4 1.1 17.4a18.5 18.5 0 0 0 5.5 2.8l1.2-2a11.9 11.9 0 0 1-1.9-.9l.5-.4a13.2 13.2 0 0 0 11.2 0l.5.4a11.9 11.9 0 0 1-1.9.9l1.2 2a18.5 18.5 0 0 0 5.5-2.8c.5-4.7-.8-8.8-3.2-12.3ZM8.8 14.9c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.4 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z" /></svg>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetch('/api/me').then(async (response) => {
      if (!response.ok) throw new Error('signed_out');
      return response.json();
    }).then(({ user: currentUser }) => {
      if (alive) setUser(currentUser);
      return fetch('/api/guilds');
    }).then(async (response) => {
      if (!response.ok) throw new Error('Could not load your servers. Try signing in again.');
      return response.json();
    }).then(({ guilds: currentGuilds }) => {
      if (alive) {
        setGuilds(currentGuilds);
        if (window.location.pathname === '/dashboard' && currentGuilds.length === 0) {
          setError('No servers with Manage Server or Administrator permission were found on this account.');
        }
      }
    }).catch((reason) => {
      if (alive && reason.message !== 'signed_out') setError(reason.message);
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  async function chooseGuild(guild) {
    setSelected(guild);
    setOverview(null);
    setError('');
    try {
      const response = await fetch(`/api/guilds/${encodeURIComponent(guild.id)}/overview`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? 'Could not load this server.');
      setOverview(data);
    } catch (reason) {
      setError(reason.message);
    }
  }

  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.assign('/');
  }

  if (loading) return <main className="loading-screen"><Brand /><div className="loader" /><p>Preparing your workspace</p></main>;

  if (!user) return <main className="landing">
    <header className="landing-nav"><Brand /><span className="secure-label"><Icon name="lock" size={14} /> SECURE ACCESS</span></header>
    <section className="hero">
      <div className="eyebrow"><span className="status-dot" /> HORICHAN MANAGEMENT SUITE</div>
      <h1>Control your<br /><span>community.</span></h1>
      <p className="hero-copy">A clear, secure workspace for managing your Horichan-powered Discord servers. Everything important, without the clutter.</p>
      <a className="primary-button" href="/auth/discord"><DiscordMark /> Continue with Discord <Icon name="arrow" size={17} /></a>
      <div className="trust-note"><Icon name="lock" size={14} /> Sign-in is handled securely through Discord OAuth2.</div>
    </section>
    <section className="feature-grid">
      <article className="feature-card"><div className="feature-icon"><Icon name="server" /></div><h3>Server overview</h3><p>Find eligible servers and access their management workspace.</p></article>
      <article className="feature-card"><div className="feature-icon"><Icon name="shield" /></div><h3>Permission-aware</h3><p>Server access is checked on the backend, not trusted to the browser.</p></article>
      <article className="feature-card"><div className="feature-icon"><Icon name="settings" /></div><h3>Built to integrate</h3><p>A separate dashboard foundation designed to connect to Horichan's API.</p></article>
    </section>
    <footer className="page-footer"><span>HORICHAN SENTINEL</span><span>HORIZON FORGE STUDIOS © {new Date().getFullYear()}</span></footer>
  </main>;

  return <Dashboard user={user} guilds={guilds} selected={selected} setSelected={setSelected} overview={overview} chooseGuild={chooseGuild} logout={logout} error={error} setError={setError} />;
}
