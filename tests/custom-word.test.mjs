import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildCustomWords} from '../app/custom-word.mjs';
import {wordState,DAY} from '../app/progress.mjs';
const base=JSON.parse(fs.readFileSync(new URL('../public/curriculum.json',import.meta.url),'utf8')).lessons.flatMap(l=>l.words);
test('a personally added word has usable cards and questions',()=>{const e={id:'event',wordId:'custom-1',kind:'customWord',at:1,payload:{term:'犹豫',pinyin:'yóu yù',meaning:'拿不定主意',example:'面对两本书，他犹豫了一会儿。'}};const [word]=buildCustomWords([e],base);assert.equal(word.lesson.title,'我的补字');assert.equal(word.questions.length,3);assert.ok(word.questions.every(q=>q.options.length===3&&q.options[q.answer]));assert.equal(wordState([e],word.id).meaning,'待检测');});
test('personal word requires parent oral check before durable mastery',()=>{const id='custom-1';const evt=(i,at,kind='answer',payload={})=>({id:String(i),wordId:id,at,kind,payload:{correct:true,assisted:false,questionId:String(i),questionKind:['meaning','transfer','boundary'][i%3],...payload}});const events=[evt(0,100),evt(1,200),evt(2,DAY+300)];assert.notEqual(wordState(events,id).meaning,'较稳固');events.push(evt(3,DAY+400,'parentMeaning',{ok:true}));assert.equal(wordState(events,id).meaning,'较稳固');});
