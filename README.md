# 字有意思 · 四年级语文

按人教社 2022 年出版的四年级上册同步字词学习手册目录编排。8 单元、27 课，每课 4 个精选字词，共 108 项。释义、例句与 324 道语义练习题均为原创；这是精选练习，不是教材完整字表。还没有核对孩子手中教材的版次，详见 [内容来源](content/sources.md)。

网站区分认读自查、家长听读确认、提示后练习和独立理解；隔天在不同题型中再次答对后才标为较稳固。孩子遇到题库外的不认识字词，可以在“字词花园”自行补充并跨设备同步；补充词还需家长口述抽查，才可能标为较稳固。普通话字词音频在 `public/audio/`，设备语音用于朗读动态题目和自加字词。

## 在线访问

GitHub Pages 地址：[字有意思](https://ttr169.github.io/zi-you-yisi/)；它将打开带账号进度同步的 [学习网站](https://furui-chinese-g4-reading.pluckykrill3.chatgpt.site/)。云端学习记录储存在 Sites 的 D1 数据库，GitHub 仓库和 Pages 不储存孩子的答题记录。不同设备请使用同一个 ChatGPT 账号。GitHub Pages 自身只提供访问入口，`docs/index.html` 指向实际学习站点。

## 开发

这是使用 Sites Vinext starter 的应用。`pnpm install` 后运行 `pnpm dev`。修改 `content/curriculum.js` 后运行 `node scripts/import-curriculum.mjs` 更新公开练习数据，运行 `node --test tests/*.test.mjs` 检查题库与进度判定。部署使用 `.openai/hosting.json` 中的 Sites 项目身份和 Sites 工作流。`docs/` 可从 GitHub Pages 的 `main` 分支发布。
