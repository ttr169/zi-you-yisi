import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../public/curriculum.json',import.meta.url),'utf8'));
test('all 27 lessons, 108 terms and 324 semantic questions present',()=>{assert.equal(data.lessons.length,27);assert.equal(new Set(data.lessons.map(l=>l.unit)).size,8);const words=data.lessons.flatMap(l=>l.words);assert.equal(words.length,108);assert.equal(new Set(words.map(w=>w.id)).size,108);const qids=new Set();for(const w of words){assert.ok(w.pinyin&&w.meaning&&w.example&&w.oralPrompt);assert.equal(w.questions.length,3);assert.equal(new Set(w.questions.map(q=>q.kind)).size,3);for(const q of w.questions){assert.ok(!qids.has(q.id));qids.add(q.id);assert.equal(new Set(q.options).size,3);assert.ok(q.answer>=0&&q.answer<q.options.length);}}assert.equal(qids.size,324);});
