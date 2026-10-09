export function buildCustomWords(events,baseWords){
  return events.filter(e=>e.kind==='customWord').map(e=>{
    const {term,pinyin,meaning,example}=e.payload;
    const others=baseWords.filter(w=>w.term!==term);
    const meanings=[...new Set(others.map(w=>w.meaning).filter(x=>x!==meaning))].slice(0,2);
    const scenes=[...new Set(others.map(w=>w.example).filter(x=>!x.includes(term)&&x!==example))].slice(0,2);
    if(meanings.length<2||scenes.length<2)return null;
    const id=e.wordId;
    return {id,term,pinyin,meaning,example,confusion:'先用自己的话讲清这个字词在原句里的意思，再想一个新例子。',oralPrompt:`请用自己的话解释“${term}”，再说一个和原句不同的例子。`,lesson:{id:0,title:'我的补字',unit:0},questions:[
      {id:id+'-meaning',kind:'meaning',prompt:`“${term}”在原句里是什么意思？`,options:[meaning,...meanings],answer:0,explanation:`这里的“${term}”表示：${meaning}。`},
      {id:id+'-transfer',kind:'transfer',prompt:`哪一个句子可以用来理解“${term}”？`,options:[example,...scenes],answer:0,explanation:`这个句子符合“${term}”的意思。`},
      {id:id+'-boundary',kind:'boundary',prompt:`下面哪个句子正确使用了“${term}”？`,options:[example,...scenes],answer:0,explanation:`“${term}”表示：${meaning}。`},
    ]};
  }).filter(Boolean);
}
