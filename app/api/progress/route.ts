import { getChatGPTUser } from '../../chatgpt-auth';
import { getDb } from '../../../db';
import { learningEvents } from '../../../db/schema';
import { eq } from 'drizzle-orm';
export const dynamic = 'force-dynamic';
const kinds = new Set(['answer','reading','learn','pin','parentRead','parentMeaning','setting']);
const reply = (data: unknown, status=200) => Response.json(data, {status, headers: {'Cache-Control':'no-store'}});
export async function GET() {
  const user=await getChatGPTUser();
  if(!user) return reply({error:'请先登录，才能同步学习记录。'},401);
  try {
    const rows=await getDb().select().from(learningEvents).where(eq(learningEvents.userId,user.userId));
    return reply({events:rows.map(({userId:_,payload,...row})=>({...row,payload:JSON.parse(payload)}))});
  } catch { return reply({error:'云端暂时无法连接，记录仍保留在本机。'},503); }
}
export async function POST(request: Request) {
  const user=await getChatGPTUser();
  if(!user) return reply({error:'请先登录，才能同步学习记录。'},401);
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return reply({error:'请求来源不一致'},403);
  const bodyText=await request.text();
  if(bodyText.length>100000) return reply({error:'记录过多，请分批重试'},413);
  let body;
  try {body=JSON.parse(bodyText);} catch {return reply({error:'记录格式不正确'},400);}
  if(!Array.isArray(body.events)||body.events.length>100) return reply({error:'记录格式不正确'},400);
  const events: {id:string;wordId:string;kind:string;at:number;payload:Record<string,unknown>}[]=body.events;
  for(const e of events) {
    if(!e || typeof e.id!=='string'|| !/^[a-zA-Z0-9-]{1,80}$/.test(e.id)||typeof e.wordId!=='string'||e.wordId.length>80||!kinds.has(e.kind)||!Number.isSafeInteger(e.at)||e.at<0||e.at>Date.now()+86400000||!e.payload||typeof e.payload!=='object'||Array.isArray(e.payload)||JSON.stringify(e.payload).length>4000) return reply({error:'记录字段不正确'},400);
  }
  try {
    if(events.length) await getDb().insert(learningEvents).values(events.map(e=>({userId:user.userId,id:e.id,wordId:e.wordId,kind:e.kind,at:e.at,payload:JSON.stringify(e.payload)}))).onConflictDoNothing();
    return reply({accepted:events.map(e=>e.id)});
  } catch {return reply({error:'暂未上传成功，本机记录已保留。'},503);}
}

