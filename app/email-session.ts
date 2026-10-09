const encoder = new TextEncoder();
const SESSION_DAYS = 30;

export type AuthAccount = { salt: string; hash: string; userId: string };
export type SessionUser = { email: string; userId: string };

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function parseAccounts(value: string | undefined): Record<string, AuthAccount> {
  if (!value) return {};
  try {
    const raw = JSON.parse(value);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const result: Record<string, AuthAccount> = {};
    for (const [email, account] of Object.entries(raw)) {
      const a = account as Partial<AuthAccount>;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          typeof a?.salt === 'string' && typeof a?.hash === 'string' &&
          typeof a?.userId === 'string' && a.userId.length > 0) {
        result[normalizeEmail(email)] = { salt: a.salt, hash: a.hash, userId: a.userId };
      }
    }
    return result;
  } catch { return {}; }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4));
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  } catch { return null; }
}

async function signingKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function makeSession(email: string, secret: string, now = Date.now()): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ email: normalizeEmail(email), expires: now + SESSION_DAYS * 86400000 })));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(payload)));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function readSession(token: string | undefined, secret: string, accounts: Record<string, AuthAccount>, now = Date.now()): Promise<SessionUser | null> {
  if (!token || token.length > 1500 || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const signature = fromBase64Url(parts[1]);
  if (!signature || signature.length !== 32) return null;
  const valid = await crypto.subtle.verify('HMAC', await signingKey(secret), signature as BufferSource, encoder.encode(parts[0]));
  if (!valid) return null;
  const bytes = fromBase64Url(parts[0]);
  if (!bytes) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof payload.email !== 'string' || !Number.isSafeInteger(payload.expires) || payload.expires <= now || payload.expires > now + SESSION_DAYS * 86400000) return null;
    const email = normalizeEmail(payload.email);
    const account = accounts[email];
    return account ? { email, userId: account.userId } : null;
  } catch { return null; }
}

export async function passwordHash(password: string, salt: string): Promise<string> {
  const saltBytes = fromBase64Url(salt);
  if (!saltBytes || saltBytes.length < 16) throw new Error('Invalid password salt');
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes as BufferSource, iterations: 210000 }, key, 256);
  return toBase64Url(new Uint8Array(bits));
}

export async function verifyPassword(password: string, account: AuthAccount): Promise<boolean> {
  if (!password || password.length > 256) return false;
  try {
    const actual = fromBase64Url(await passwordHash(password, account.salt));
    const expected = fromBase64Url(account.hash);
    if (!actual || !expected || actual.length !== expected.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index++) difference |= actual[index] ^ expected[index];
    return difference === 0;
  } catch { return false; }
}

export function newSalt(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(24)));
}
