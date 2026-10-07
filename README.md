## ⛔ 删除保护

**此仓库及其所有内容严禁自行删除。任何删除操作必须经过赵的明确同意。**

---

# AI 角色卡制作指南

AI角色卡制作指南：网络查阅方法、魅魔岛（sexyai.ai）使用、角色卡格式与制作流程。

## 📁 目录结构

```
character-card-guide/
├── 角色卡制作指南/          ← 原始指南：制作流程、格式模板、网络查阅、资源汇总
│   ├── card-creation.md    ← 角色卡制作流程与要求
│   ├── card-format.md      ← 角色卡人设形式与模板
│   ├── network-access.md   ← 链接网络的方法
│   ├── sexyai-guide.md     ← AI魅魔岛网址与登录方法
│   ├── research-methods.md ← 如何自主查阅角色卡
│   ├── resources.md        ← 访问网址的资料汇总
│   ├── reflection-log.md   ← 反思日志
│   └── README.md
├── 明日方舟剧情/           ← 明日方舟全剧情原文（465个活动，按活动合并为txt）
│   ├── 辞岁行.txt         ← 示例：2026春节活动剧情
│   ├── 怀黍离.txt         ← 示例：2024春节活动剧情
│   └── ...                ← 共463个txt文件
└── README.md           ← 制作指南说明
├── discord技术库/           ← Discord「魅魔藏经阁」技术帖爬取（466篇/18917条消息）
│   ├── KNOWLEDGE-BASE.md   ← 14个技术领域知识库
│   ├── thread-list.json    ← 帖子索引
│   └── *.md                ← 458篇帖子原文
├── 角色卡识别技术途径/       ← sexyai.ai API 接入与技术文档
│   ├── README.md           ← API 快速开始
│   └── sexyai-api-guide.md ← 完整调用指南
└── README.md
├── 明日方舟剧情/           ← 明日方舟全剧情原文（465个活动，按活动合并为txt）
│   ├── 辞岁行.txt         ← 示例：2026春节活动剧情
│   ├── 怀黍离.txt         ← 示例：2024春节活动剧情
│   └── ...                ← 共463个txt文件
└── README.md               ← 本文件
```

## 🎯 核心目标

1. 掌握通过网络查阅角色设定的方法
2. 学会在 sexyai.ai 上制作和发布角色卡
3. 建立一套可复用的角色卡制作流程
4. 积累角色设定资料库
5. 掌握 sexyai.ai API 技术接口

## 📝 更新记录

- 2026-06-24：添加 Discord 魅魔藏经阁技术库 + sexyai.ai API 技术途径
- 2026-06-24：项目初始化，完成网络查阅、角色卡制作学习、黍角色卡制作
- 2026-07-10：新增「明日方舟剧情」目录，465个活动全部剧情原文（463个txt），数据来源：ArknightsGameData GitHub 镜像

## 🔧 明日方舟剧情数据 API

- **剧情索引**：`https://r2.m31ns.top/zh_CN/gamedata/excel/story_review_table.json`
- **剧情原文**：`https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/story/[storyTxt].txt`
- **干员语音**：`https://wiki.biligame.com/arknights/index.php?title=[干员名]/默认/中文-普通话&action=raw`
