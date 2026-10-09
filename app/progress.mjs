export const DAY=86400000;
export function mergeEvents(...sets) {
  const map=new Map(); for(const set of sets) for(const e of set) map.set(e.id,e);
  return [...map.values()].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
}
export function wordState(events,id,now=Date.now()) {
  const rows=events.filter(e=>e.wordId===id);
  const answers=rows.filter(e=>e.kind==='answer');
  const lastFailure=rows.filter(e=>(e.kind==='answer'&&!e.payload.correct)||(e.kind==='parentMeaning'&&!e.payload.ok)).at(-1);
  const good=answers.filter(e=>e.payload.correct&&!e.payload.assisted&&e.at>(lastFailure?.at??0));
  const kinds=new Set(good.map(e=>e.payload.questionKind));
  const contexts=new Set(good.map(e=>e.payload.questionId));
  const spaced=good.length>1 && good.at(-1).at-good[0].at>=DAY;
  const hasOral=rows.some(e=>e.kind==='parentMeaning'&&e.payload.ok&&e.at>(lastFailure?.at??0));
  let meaning=spaced&&kinds.size>=3&&(!id.startsWith('custom-')||hasOral)?'较稳固':contexts.size>=2?'初步理解':good.length?'有一点证据':rows.some(e=>e.kind==='learn')?'已学习':'待检测';
  const parentMeaning=rows.filter(e=>e.kind==='parentMeaning').at(-1);
  if(parentMeaning?.payload.ok && parentMeaning.at>(lastFailure?.at??0) && meaning!=='较稳固') meaning='口头表达已确认';
  if(parentMeaning&&!parentMeaning.payload.ok && parentMeaning.at>(answers.at(-1)?.at??0)) meaning='需要再理解';
  if(lastFailure && !good.length) meaning='需要再理解';
  const read=rows.filter(e=>e.kind==='reading'||e.kind==='parentRead').at(-1);
  const reading=!read?'待听读':!read.payload.ok?'需要练读':read.kind==='parentRead'?'家长已确认':'自行核对过';
  const latest=rows.filter(e=>['answer','reading','parentRead','parentMeaning'].includes(e.kind)).at(-1);
  const lapse=latest && (latest.payload.correct===false||latest.payload.ok===false);
  const dueAt=latest?latest.at+(lapse?DAY:meaning==='较稳固'?7*DAY:meaning==='初步理解'?3*DAY:DAY):0;
  return {meaning,reading,due:!!latest&&dueAt<=now,dueAt,seen:!!rows.length,pinned:!!rows.filter(e=>e.kind==='pin').at(-1)?.payload.on,good:good.length,contexts:contexts.size,latest,answers,lastFailure,needsHelp:reading==='需要练读'||meaning==='需要再理解'};
}
export function wasRecentlyHelped(events,id,now=Date.now()) {
  return events.some(e=>e.wordId===id&&e.kind==='learn'&&now-e.at<10*60000&&now>=e.at);
}
