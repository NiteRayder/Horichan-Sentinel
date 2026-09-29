import { useState } from 'react';

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
    activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    alert: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    zap: <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></>,
    trending: <><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>,
    scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" /></>,
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${accent || ''}`}><Icon name={icon} size={20} /></div>
      <div className="stat-card-body">
        <strong>{value}</strong>
        <span>{label}</span>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

function LiveStat({ icon, label, value }) {
  return (
    <div className="live-stat">
      <Icon name={icon} size={15} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function GuildCard({ guild, selected, onSelect }) {
  return (
    <button className={`guild-card ${selected?.id === guild.id ? 'selected' : ''}`} onClick={() => onSelect(guild)}>
      <div className="guild-avatar">
        {guild.icon
          ? <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=96`} alt="" />
          : guild.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="guild-details">
        <strong>{guild.name}</strong>
        <small>{guild.owner ? 'Server owner' : 'Manage Server access'}</small>
      </div>
      <Icon name="arrow" size={17} />
    </button>
  );
}

export default function Dashboard({ user, guilds, selected, setSelected, overview, chooseGuild, logout, error, setError }) {
  const totalGuilds = guilds.length;
  const ownedGuilds = guilds.filter(g => g.owner).length;
  const managedGuilds = totalGuilds - ownedGuilds;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="shield" size={22} /></div>
          <div className="brand-copy">
            <strong>HORICHAN<span> SENTINEL</span></strong>
            <small>HORIZON FORGE STUDIOS</small>
          </div>
        </div>
        <div className="side-section-label">WORKSPACE</div>
        <button className="nav-item active"><Icon name="grid" /> Overview</button>
        <button className="nav-item" onClick={() => setError('Choose a server first. Management modules will appear when the Horichan API is connected.')}>
          <Icon name="server" /> Servers <span className="nav-count">{totalGuilds}</span>
        </button>
        <button className="nav-item" onClick={() => setError('Moderation history will be available when the Horichan API is connected.')}>
          <Icon name="shield" /> Moderation
        </button>
        <button className="nav-item" onClick={() => setError('Automation controls will be available when the Horichan API is connected.')}>
          <Icon name="zap" /> Automations
        </button>
        <button className="nav-item" onClick={() => setError('Server statistics will be available when the Horichan API is connected.')}>
          <Icon name="trending" /> Analytics
        </button>
        <button className="nav-item" onClick={() => setError('Integration settings will be available when the Horichan API is connected.')}>
          <Icon name="settings" /> Settings
        </button>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="status-dot status-online" /> Dashboard online
            <small>Bot integration may be pending</small>
          </div>
          <button className="nav-item" onClick={logout}><Icon name="logout" /> Sign out</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">HORICHAN SENTINEL <span>/</span> OVERVIEW</div>
            <h1>Dashboard</h1>
          </div>
          <div className="profile">
            <div className="avatar">
              {user.avatar
                ? <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`} alt="" />
                : user.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{user.globalName || user.username}</strong>
              <small>Discord account</small>
            </div>
          </div>
        </header>

        {error && (
          <div className="notice">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* Status bar — Double Counter style */}
        <div className="status-bar">
          <div className="status-bar-item">
            <span className="status-dot status-online" />
            <span>All systems operational</span>
          </div>
          <div className="status-bar-divider" />
          <div className="status-bar-item">
            <Icon name="shield" size={14} />
            <span>Sentinel v0.1</span>
          </div>
          <div className="status-bar-divider" />
          <div className="status-bar-item">
            <Icon name="clock" size={14} />
            <span>Session active</span>
          </div>
        </div>

        {/* Stats overview — greed.best style stat cards */}
        <section className="stats-grid">
          <StatCard icon="server" label="Managed servers" value={totalGuilds} sub={`${ownedGuilds} owned · ${managedGuilds} managed`} accent="blue" />
          <StatCard icon="users" label="Total reach" value="—" sub="Awaiting Horichan API" accent="purple" />
          <StatCard icon="activity" label="Bot status" value={overview?.botConnected === true ? 'Online' : overview?.botConnected === false ? 'Offline' : 'Pending'} sub={overview?.integrationConfigured ? 'API connected' : 'API not configured'} accent={overview?.botConnected === true ? 'green' : 'amber'} />
          <StatCard icon="alert" label="Active alerts" value="0" sub="No threats detected" accent="green" />
        </section>

        {/* Welcome panel */}
        <section className="welcome-panel">
          <div>
            <div className="eyebrow"><span className="status-dot" /> YOUR WORKSPACE</div>
            <h2>Welcome back, {user.globalName || user.username}.</h2>
            <p>Select a server to view its Horichan integration status and management controls.</p>
          </div>
          <div className="welcome-mark"><Icon name="shield" size={38} /></div>
        </section>

        {/* Guild grid */}
        <div className="section-heading">
          <div>
            <h2>Your servers</h2>
            <p>Servers where your Discord account has management permissions.</p>
          </div>
          <span className="count-pill">{totalGuilds} FOUND</span>
        </div>
        {totalGuilds ? (
          <div className="guild-grid">
            {guilds.map(guild => (
              <GuildCard key={guild.id} guild={guild} selected={selected} onSelect={chooseGuild} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="server" size={25} /></div>
            <h3>No eligible servers yet</h3>
            <p>Make sure your Discord account has Manage Server or Administrator permission in a server.</p>
          </div>
        )}

        {/* Server detail panel */}
        {selected && (
          <section className="server-panel">
            <div className="section-heading">
              <div>
                <h2>{selected.name}</h2>
                <p>Integration status & overview</p>
              </div>
              <span className="count-pill">SERVER ID · {selected.id}</span>
            </div>
            {!overview ? (
              <p className="muted">Loading server overview…</p>
            ) : (
              <div className="server-detail">
                <div className="integration-status">
                  <div className="status-symbol"><Icon name="shield" size={22} /></div>
                  <div>
                    <strong>{!overview.integrationConfigured ? 'Waiting for Horichan connection' : overview.botConnected ? 'Horichan is in this server' : 'Horichan is unavailable'}</strong>
                    <p>{overview.message || 'Server access is verified. Management modules will remain unavailable until their API endpoints are implemented.'}</p>
                  </div>
                  <span className={overview.botConnected ? 'pill-ready' : 'pill-pending'}>
                    {!overview.integrationConfigured ? 'PENDING' : overview.botConnected ? 'BOT ONLINE' : 'BOT OFFLINE'}
                  </span>
                </div>

                {/* Live monitoring stats — Double Counter style */}
                <div className="live-stats-row">
                  <LiveStat icon="eye" label="Monitoring" value={overview.botConnected ? 'Active' : 'Standby'} />
                  <LiveStat icon="scan" label="Verification" value={overview.botConnected ? 'Enabled' : 'Disabled'} />
                  <LiveStat icon="bell" label="Alerts" value="0" />
                  <LiveStat icon="database" label="Data points" value={overview.botConnected ? 'Live' : '—'} />
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="dashboard-footer">
          <span>HORICHAN SENTINEL <b>·</b> HORIZON FORGE STUDIOS</span>
          <span><span className="status-dot status-online" /> Secure session</span>
        </footer>
      </main>
    </div>
  );
}
