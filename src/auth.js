const SESSION_COOKIE = 'ig_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 15 * 60;

function toBase64Url(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(new Uint8Array(sig));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function createSessionCookie(secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}`;
  const sig = await hmac(secret, payload);
  const token = `${payload}.${sig}`;
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

export async function isAuthenticated(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = await hmac(env.SESSION_SECRET, payload);
  if (!constantTimeEqual(sig, expected)) return false;
  const expiresAt = parseInt(payload, 10);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;
  return true;
}

export function checkPassword(submitted, expected) {
  if (typeof submitted !== 'string' || typeof expected !== 'string') return false;
  // Pad to equal length before comparing so early mismatches don't leak length via timing.
  const padded = submitted.padEnd(expected.length, '\0');
  return submitted.length === expected.length && constantTimeEqual(padded, expected);
}

export function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

export async function isRateLimited(env, ip) {
  const row = await env.DB.prepare('SELECT count, window_started_at FROM login_attempts WHERE ip = ?')
    .bind(ip)
    .first();
  if (!row) return false;
  const windowAge = Math.floor(Date.now() / 1000) - Math.floor(new Date(row.window_started_at).getTime() / 1000);
  if (windowAge > LOGIN_WINDOW_SECONDS) return false;
  return row.count >= MAX_LOGIN_ATTEMPTS;
}

export async function recordLoginAttempt(env, ip, succeeded) {
  if (succeeded) {
    await env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
    return;
  }
  const row = await env.DB.prepare('SELECT count, window_started_at FROM login_attempts WHERE ip = ?')
    .bind(ip)
    .first();
  const now = new Date().toISOString();
  if (!row) {
    await env.DB.prepare('INSERT INTO login_attempts (ip, count, window_started_at) VALUES (?, 1, ?)')
      .bind(ip, now)
      .run();
    return;
  }
  const windowAge = Math.floor(Date.now() / 1000) - Math.floor(new Date(row.window_started_at).getTime() / 1000);
  if (windowAge > LOGIN_WINDOW_SECONDS) {
    await env.DB.prepare('UPDATE login_attempts SET count = 1, window_started_at = ? WHERE ip = ?')
      .bind(now, ip)
      .run();
  } else {
    await env.DB.prepare('UPDATE login_attempts SET count = count + 1 WHERE ip = ?').bind(ip).run();
  }
}
