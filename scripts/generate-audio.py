import asyncio,json,pathlib,sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[3]/'.tts-runtime'))
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'public/curriculum.json').read_text(encoding='utf-8'))
out=ROOT/'public/audio';out.mkdir(exist_ok=True)
items=[]
for lesson in data['lessons']:
    for w in lesson['words']:
        items.append((w['term'], '不肯降' if w['term']=='降' else w['term']))
        items.append((w['meaning'], w['meaning']))
items=list(dict(items).items())
manifest={}
async def main():
    sem=asyncio.Semaphore(4)
    async def one(i,text,spoken):
        filename=f'zh-{i:03}.mp3'; path=out/filename
        async with sem:
            if not path.exists() or path.stat().st_size<500:
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(spoken,'zh-CN-XiaoxiaoNeural',rate='-12%').save(str(path));break
                    except Exception:
                        if attempt==2:raise
                        await asyncio.sleep(2)
            manifest[text]='/audio/'+filename
            if (i+1)%20==0:print(f'{i+1}/{len(items)}',flush=True)
    await asyncio.gather(*(one(i,*item) for i,item in enumerate(items)))
    (ROOT/'public/audio-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8')
    print(f'完成 {len(manifest)} 段普通话音频',flush=True)
asyncio.run(main())
