import { SESSION_COOKIE } from '../../../email-auth';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: '请求来源不一致。' }, { status: 403 });
  const response = Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  return response;
}
