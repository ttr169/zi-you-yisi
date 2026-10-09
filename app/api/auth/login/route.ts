import { authSettings, SESSION_COOKIE } from '../../../email-auth';
import { makeSession, normalizeEmail, verifyPassword } from '../../../email-session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: '请求来源不一致。' }, { status: 403 });
  if (!(request.headers.get('content-type') ?? '').startsWith('application/json')) return Response.json({ error: '请求格式不正确。' }, { status: 415 });
  const raw = await request.text();
  if (raw.length > 1000) return Response.json({ error: '请求内容过长。' }, { status: 413 });
  let body: { email?: unknown; password?: unknown };
  try { body = JSON.parse(raw); } catch { return Response.json({ error: '请求格式不正确。' }, { status: 400 }); }
  if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || body.password.length > 256) {
    return Response.json({ error: '请输入邮箱和密码。' }, { status: 400 });
  }
  const email = normalizeEmail(body.email);
  const { accounts, secret } = authSettings();
  if (!secret || Object.keys(accounts).length === 0) return Response.json({ error: '登录尚未配置完成，请稍后再试。' }, { status: 503 });
  const account = accounts[email];
  if (!account || !(await verifyPassword(body.password, account))) {
    return Response.json({ error: '邮箱或密码不正确。', diagnostic: { accountFound: Boolean(account), saltLength: account?.salt?.length ?? 0, hashLength: account?.hash?.length ?? 0 } }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const session = await makeSession(email, secret);
  const response = Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  return response;
}
