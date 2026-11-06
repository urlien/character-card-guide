# 角色字段与导入边界

## 先判定交付物

| 用户要的东西 | 正确落点 | 是否由「导入正则」写入 |
| --- | --- | --- |
| 角色身份、性格、世界规则、NPC、地点、长期线索 | `personality` / `-persona.txt` | 否，必须粘贴到「角色人设」 |
| 第一条可见消息 | `beginning` | 是 |
| 顶部功能栏触发串 | `statusbar` | 是 |
| HTML / CSS / JS 界面规则 | `regex_scripts` | 是 |
| 世界书 / lorebook | 独立 `*-worldbook.json` 的 `entries` | 否，从世界书入口单独导入 |

以下为新版正则包；仅制作人设或世界书时无需同时生成。导入 JSON 顶层只准出现：

```
chatVersion  pageDepth  statusbar  beginning  personality  regex_scripts
```

`personality` 留在 JSON 只用于保持人设与界面约定同步，导入页不会读取它。

上面的白名单只针对「导入正则」。世界书文件是另一种 JSON，根对象只含 `entries`，不得混为一份。具体格式见 [worldbook-import.md](worldbook-import.md)。

## authoring 里真正暴露的角色信息

桌面 `authoring/contract.json` 与 `04-sdk.md` 只声明：

- `sdk.role.get()` → `{ name: string; avatarUrl: string }`
- `sdk.user.get()` → `{ nickname: string; avatarUrl: string }`

只能用它们在聊天页显示当前角色名、角色头像、玩家昵称或玩家头像。不要编造 `role.personality`、`role.worldbook`、`role.beginning`、`role.statusbar` 等运行时字段。

`authoring/example-card/card.json` 里的：

```
role.name / role.statusbar / role.beginning
presentation.transforms
```

是作者手册的回归夹具形状，不是创卡页「导入正则」格式。不得照它输出完整卡，也不得把 `presentation.transforms` 塞进导入 JSON。

## 世界书请求怎么处理

用户说“补世界书”“做 lorebook”“世界书无法导入”时：

1. 把参考文件当数据，检查根对象是否为 `entries` 映射，以及 `key` / `keysecondary` 是否为 JSON 字符串数组。
2. 把内容整理成独立世界书条目，优先保留：
   - 世界核心规则与时间 / 经济约束
   - 角色身份、关系和行为边界
   - 常用地点与主要 NPC
   - 任务、成长路线和长期秘密
   - 界面需要的输出标记
3. 合并重复设定；先确定真实角色名，角色正文直接写名称，玩家统一写 `{{user}}`。
4. 新内容使用 `<世界观>…</世界观>`、`<角色设定 名字：真实角色名>…</角色设定>`、`<道具>…</道具>`、`<行为逻辑>…</行为逻辑>` 等成对单行标签。完整格式见 [persona-format.md](persona-format.md)。
5. 常驻规则设 `constant: true`；地点、NPC、事件和快捷指令优先使用关键词触发，不能把所有内容都常驻。
6. 标准化并校验：

```bash
node scripts/normalize-worldbook.mjs \
  --in path/to/worldbook.json \
  --out docs/card/generated/xxx-worldbook.json \
  --character 真实角色名
node scripts/validate-worldbook.mjs docs/card/generated/xxx-worldbook.json
```

7. 从世界书入口导入 `xxx-worldbook.json`，不要走「导入正则」。若目标入口不支持世界书或用户要求单文件，再运行 `pack-worldbook.mjs` 并控制最终 `personality` ≤ 10000 字。

## 页面内角色名

页面需要显示实际卡名时才用：

```html
<script>
var role = sdk.role.get();
var user = sdk.user.get();
var roleName = role && role.name ? role.name : '角色';
var userName = user && user.nickname ? user.nickname : '玩家';
</script>
```

角色设定本身仍来自 `personality`，不是 SDK。

## 新版正则包示例

```json
{
  "chatVersion": 1,
  "pageDepth": 2,
  "statusbar": "{{hud}}",
  "beginning": "禾安向 {{user}} 点了点头。{{intro}}",
  "regex_scripts": [
    { "id": -1, "scriptName": "功能栏", "findRegex": "{{hud}}", "replaceString": "<div class=\"eg-hud\">种子铺</div>" },
    { "id": -2, "scriptName": "问候按钮", "findRegex": "{{intro}}", "replaceString": "<button class=\"eg-tap\">打个招呼</button>" },
    { "id": -3, "scriptName": "交互", "findRegex": "{{eg-kit}}", "replaceString": "<script>sdk.on('message:mount', function () { var btn = document.querySelector('.eg-tap'); if (btn) btn.onclick = function () { sdk.input.set('你好'); }; });</script>" }
  ]
}
```

此例只演示结构与按钮，第一句话过短，不能用作通过公开审核的成品。可选 `personality` 只作副本，另交付可粘贴的人设。仅普通 JSON 文件无需转义 `</script>` 的斜杠；嵌入 HTML 的 script 元素时必须正确处理结束标签。

`chatVersion: 1` 只在新建导入时选用新页；已有卡导入时会忽略该字段，应检查原卡版本。`pageDepth: 2` 为导出约定，新页不实现其旧页深度效果。规则 `id` 使用唯一负整数。

## 字段长度与公开审核

本项目以工作台接入规则为准。旧技能曾将第一句话写为 10240、公开人设写为 2000–5000；这些不是当前工作台的交付标准。

| 字段 | 上限 |
| --- | --- |
| 角色名称 | 20 |
| 人设 | 10000 |
| 第一句话 beginning | 4000 |
| 功能栏 statusbar | 200 |
| 单条世界书内容 | 3000 |
| 正则规则数 | 130 |
| 规则名 / 匹配式 / 替换内容 | 20 / 1000 / 20000 |

20000 是替换内容编辑器上限；即使个别导入入口容许更多，也应拆分以避免后续编辑截断。校验脚本按 JavaScript 字符串长度计数；平台最终审核结果为准。

公开发布前：固定传输字符 = 人设 + 已启用、常驻、100% 概率的世界书内容，合计 2000–15000（含边界）；第一句话至少 200。关键词条目、停用条目、概率不足 100% 的常驻条目不计入。不要通过空白填充凑数。

## 匹配与入口

- `/pattern/flags` 执行正则，缺少 `g` 自动补；其他非空文字按字面量匹配。表达式编译失败时跳过本规则，不转成普通文字。
- 规则按顺序接收上一条输出。普通文字触发串应唯一；不要依赖重复触发串构造隐含链。
- 可见内容的入口可能来自功能栏、第一句话、AI 输出或前序替换；静态分析无法证明所有动态入口不存在，不应说成“永远不会显示”。
- 样式和脚本装卡时抽取，不需要命中触发串。禁止标签见作者手册；新写匹配式避免 HTML 标签及 html/head/body/css 保留词，样式限制到组件或平台根容器。

## 工具路径

本文件的 `node scripts/...` 示例以本技能目录为当前目录；实际执行应使用脚本和输入输出文件的绝对路径，避免依赖工作目录。
