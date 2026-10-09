import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('content/curriculum.js','utf8'),context);
fs.writeFileSync('public/curriculum.json',JSON.stringify(context.window.CURRICULUM,null,2));

