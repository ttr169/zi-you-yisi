import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { parseAccounts, readSession } from './email-session';

export const SESSION_COOKIE = 'ziyouyisi_session';

export function authSettings() {
  const secret = env.AUTH_SESSION_SECRET ?? '';
  return {
    accounts: parseAccounts(env.AUTH_ACCOUNTS),
    secret: secret.length >= 32 ? secret : '',
  };
}

export async function getEmailUser() {
  const { accounts, secret } = authSettings();
  if (!secret || Object.keys(accounts).length === 0) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return readSession(token, secret, accounts);
}
