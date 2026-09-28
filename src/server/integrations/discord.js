const DISCORD_API = 'https://discord.com/api/v10';

export async function fetchCurrentUser(accessToken) {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Discord user request failed (${response.status}).`);
  return response.json();
}

export async function fetchManageableGuilds(accessToken) {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Discord guild request failed (${response.status}).`);

  const guilds = await response.json();
  const MANAGE_GUILD = 0x20n;
  const ADMINISTRATOR = 0x8n;

  return guilds
    .filter((guild) => {
      const permissions = BigInt(guild.permissions ?? '0');
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
        || (permissions & ADMINISTRATOR) === ADMINISTRATOR;
    })
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: Boolean(guild.owner),
      permissions: guild.permissions,
    }));
}
