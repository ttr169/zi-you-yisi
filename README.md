# 字有意思 · 四年级语文

按人教社 2022 年出版的四年级上册同步字词学习手册目录编排。8 单元、27 课，每课 4 个精选字词，共 108 项。释义、例句与 324 道语义练习题均为原创；这是精选练习，不是教材完整字表。还没有核对孩子手中教材的版次，详见 [内容来源](content/sources.md)。

网站区分认读自查、家长听读确认、提示后练习和独立理解；隔天在不同题型中再次答对后才标为较稳固。孩子遇到题库外的不认识字词，可以在“字词花园”自行补充，补充词还需家长口述抽查，才可能标为较稳固。普通话字词音频在 `public/audio/`，设备语音用于朗读动态题目和自加字词。

## 在线访问

GitHub Pages 地址：[字有意思](https://ttr169.github.io/zi-you-yisi/)。Pages 版本直接运行学习网站，记录只保存在当前浏览器；换设备时，在“家长查看”导出 JSON 备份，再到另一设备导入。此版本**没有邮箱登录、访问限制或自动云端同步**，因此请勿把导出的学习记录提交到仓库。

原 [Sites 版本](https://furui-chinese-g4-reading.pluckykrill3.chatgpt.site/)仍保持原来的私有访问方式。仓库中的 Sites 服务端包含指定邮箱认证与云端同步的实现，但当前托管入口没有开放给无需 ChatGPT 账号的访客。不要把真实密码、密码摘要或签名密钥提交到 GitHub。

## 开发

这是使用 Sites Vinext starter 的应用。`pnpm install` 后运行 `pnpm dev`。修改 `content/curriculum.js` 后运行 `node scripts/import-curriculum.mjs` 更新公开练习数据，运行 `node --test tests/*.test.mjs` 检查题库与进度判定。

运行 `npm run build:pages` 会把可独立访问的静态网站生成到 `docs/`。GitHub Pages 从 `main` 分支的 `docs/` 发布。Sites 部署使用 `.openai/hosting.json` 中的项目身份和 Sites 工作流。
