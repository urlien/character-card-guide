# 口语意图 → 规则配方

本文件的相对脚本路径以技能目录为起点，执行时解析为绝对路径。

一行配方 + 去哪点读。**别整本读手册**，找到对应小节再读那一节。手册在本 skill 的 [authoring/](authoring/README.md)。写卡不要去翻 `h5-new/` 或沙箱组件源码。

## 角色人设

创卡页字段是 `personality`，上限 10000 字。公开审核按人设与符合条件的常驻世界书合计 2000–15000 计算，第一句话至少 200；草稿可短。**不要**套用创卡页占位那段恋爱文案。

人设喂给模型，不是页面 HTML。里面不要写 `<style>` / `<script>` / `sdk.*`。

角色名直接写真实名称，玩家只用 `{{user}}`。用户没给角色名时，根据设定补一个可直接使用的名字；禁止 `$#char#$`、`$#user#$`、`{{char}}`。完整格式见 [references/persona-format.md](references/persona-format.md)。

用成对的单行标签组织人设。每个开始标签都要在内容末尾写同名闭合标签；`<角色设定 名字：真实角色名>` 按基础名闭合为 `</角色设定>`。仅对不改变核心设定的细节补合理默认，章节按需求选用：

1. `<角色设定 名字：真实角色名>`：必须存在，角色正文继续直接使用该名称
2. `<基本信息>` 与 `<与{{user}}的关系>`：身份、职责、起始关系与边界
3. `<外貌特征>`、`<性格特点>`、`<说话方式>`：两三句能入戏，说明会做 / 绝不会做
4. `<背景设定>` 与 `<行为逻辑>`：经历、动机、决策顺序和不能崩的人设底线
5. `<道具>`、`<能力与限制>`：只写会影响剧情的物件和真实限制
6. `<当前情景>`：这一刻在哪、刚发生什么（和 `beginning` 同方向，但人设写设定，开场白写第一句戏）
7. `<输出格式>`（需要模型生成匹配标记时才写）：模型必须打出正则能吃到的字。血条 → `血量：数字`；状态块 → `[status]…[/status]`；骰子 → `〖骰=…〗`。标记表见 [kits/rpg.md](kits/rpg.md)。约定写不出，规则等于没写。

`beginning` 是玩家看见的第一句话，直接写真实角色名，玩家写 `{{user}}`，可以夹触发串 `{{intro}}`。不要把整篇人设贴进开场白。

只写人设时交付 `-persona.txt`；用户另要第一句话再提供，不生成无用正则包。

## 世界设定 / 世界书 / lorebook

世界书使用独立的 `entries` 对象 JSON，不能放进「导入正则」。读 [references/worldbook-import.md](references/worldbook-import.md) 后生成 `*-worldbook.json`；导入边界见 [references/role-import.md](references/role-import.md)。

按下面顺序取舍，先保留高频、会影响每轮回复的设定：

1. 世界核心规律：时间、资源、能力边界、社会规则
2. 真实角色名 / `{{user}}` 的身份、关系与不能越过的行为边界
3. 主要地点与 3～8 名常驻 NPC；每人只留身份、语气、目标、秘密 / 限知
4. 任务与成长路线、逐步揭示的长期秘密
5. 状态块、选项块等界面输出约定

拆条原则：每个条目只负责一类稳定设定。世界核心与每轮硬规则可常驻；地点、NPC、事件和快捷指令按关键词触发，避免全部设为 `constant: true`。角色名直接写真实名称，玩家写 `{{user}}`，新内容用成对的单行标签。

新建或修复世界书时用：

```bash
node scripts/normalize-worldbook.mjs --in source.json --out xxx-worldbook.json --character 角色名
node scripts/validate-worldbook.mjs xxx-worldbook.json
```

若用户从零创建世界书，可直接生成标准格式并校验；只有输入形状需要转换时再运行标准化脚本。最终交付规范化后的 `*-worldbook.json`，原文件仅作为来源备份。

只有用户明确要求压入人设，或目标入口确实不支持独立世界书时才用：

```bash
node scripts/pack-worldbook.mjs --persona xxx-persona.txt --worldbook xxx-worldbook.json --character 角色名 --out xxx-persona-packed.txt
```

打包会跳过 `disable: true` 的条目，并把关键词触发条件写进标签正文，避免把条件条目误当成无条件常驻规则。合并后人设必须 ≤ 10000 字，公开审核按独立的固定传输规则计算。

## 换肤 / 配色

| 用户会说 | 怎么做 | 点读 |
| --- | --- | --- |
| 深色、赛博、古风、暖色 | 一条只放 `<style>` 的规则，在 `[data-chat="root"]` 上改 `--chat-*` 变量 | [01-style.md](authoring/01-style.md) 开头 |
| 改底栏、输入框、快捷按钮或宿主弹窗配色 | 使用独立的 `--chat-composer-*` / `--chat-shortcut-*` / `--chat-input-*` / `--chat-modal-*`；不换平台图标 | [01-style.md](authoring/01-style.md)「改底栏、输入框和白名单弹窗」 |
| 原生弹窗重排、顶部设置抽屉、选择指令居中 | 依现有 DOM 和业务事件换肤，分清宿主/沙盒；总结面板按最新 summary 根结构适配 | [结构与交互配方](references/host-popup-recipes.md) |
| 只改 AI 气泡 / 只改用户气泡 | `[data-chat="message"][data-from="ai"] [data-chat="message-body"]` 上改 `--chat-bubble-*` | [03-dom.md](authoring/03-dom.md) 「改某一块：直接抄」 |
| 改顶栏 / 输入框字号 | `[data-chat="header"]`、`[data-chat="input"]` | 同上 |
| 藏掉底部输入区 | `[data-chat="composer"]{display:none}`，但要另给一条发消息的路（`composer.hide` + 自己的发送按钮） | [01-style.md](authoring/01-style.md) 「藏掉底部输入区」 |

可改的变量：`--chat-bg` `--chat-surface` `--chat-text` `--chat-text-muted` `--chat-border` `--chat-accent` `--chat-bubble-user-bg` `--chat-bubble-ai-bg` `--chat-bubble-text` `--chat-viewport-height`。

## 功能栏 / HUD

- `statusbar` 只放短触发串（如 `{{hud}}`），真 UI 写在规则的替换内容里。
- 平台没给 `[data-slot="statusbar"]` 任何样式，背景 / 高度 / `position:sticky` 都要自己写。
- 功能栏那块 HTML 由平台整块写入，**JS 往里塞节点留不住**；会变的内容写进规则，长期面板放舞台。
- 点读：[01-style.md](authoring/01-style.md) 「改功能栏」。

## 侧边栏（新页）

不要写 14 个 `【侧边栏N】`（`statusbar` 只有 200 字；新页功能栏是可见槽位，不是屏外注入口）。

- `statusbar` 只放 `{{hud}}`。HUD 是 1～3 个按钮（默认：状态、背包、骰子；按用户口语改名）
- 点击 `sdk.stage.open('content')`，往 `sdk.stage.el()` 填对应页，**不要每次重建 DOM**
- 按钮用 class / `onclick`，z-index 1000–1999
- `[data-slot="left"]` / `right` 窄屏上可能不在，只作可选增强，不当前提
- 结构骨架：[kits/rpg.md](kits/rpg.md)

## 状态块（传统消息标记模式）

先读 [状态与存档](references/state-variables.md)。本节适用于未启用平台状态变量的卡；`save` 不自动回溯，也不自动进入 AI 上下文。

两层都要，缺一层就只是「看起来有」：

1. **消息标记**：模型每轮写一块（默认小字段，别上 40 个键）

```
[status]
hp=70
mp=30
loc=客栈
gold=12
[/status]
```

一条真正则吃掉整块，气泡里变成状态卡。键值用脚本在 `message:done` 里解析更稳。

2. **舞台面板**：同一块标记写入 `sdk.save`（进度）/ `sdk.cache`（本会话展示），刷新已打开的状态页。`conversation:switch` 清缓存、重读存档。

人设「输出约定」必须列出这些键。标记表：[kits/rpg.md](kits/rpg.md)。

不要把 `[status]` 拆成 `[sta` + `tus]` 两条切片。

## 骰子

显示和投掷共用一种短标记（ASCII 分隔，不要 ①②③）：

```
〖骰=检定名|属性|目标|出目|成功或失败〗
```

- 规则：`/〖骰=([^|〗]+)\|([^|〗]+)\|([^|〗]+)\|([^|〗]+)\|([^〗]+)〗/` → 判定卡（`$1`…`$5`）
- HUD「掷骰」：本地 `1+Math.floor(Math.random()*100)`，`sdk.input.set` 填好标记。**不要**在 `message:done` 里自动 `message.send`
- 人设约定：玩家消息里已有 `〖骰=〗` 就用那组数字结算，模型不要重掷；模型自己发起检定时也输出同一标记
- 对抗检定本轮不做，用户点名再加

不引入 teapot（`onerror` 图、`window.teapot*`）。骨架：[kits/rpg.md](kits/rpg.md)。

## AI 正文里的数值变成 UI

用户说「AI 写『血量：70』就出一根血条」→ 这种才用真正则：

```
findRegex:      /血量[:：]\s*(\d+)/
replaceString:  <div class="my-bar" style="width:$1%;height:8px;border-radius:4px;background:var(--chat-accent)"></div>
```

- `$1` `$2` 取捕获组；首个捕获组形如 `血量::10;;金币::3` 时可用 `$血量`
- `{{random:甲::乙::丙}}` 三选一
- 计算出来的值写在标签的 `style=""` 上（内联压过 `<style>`）
- 点读：[README.md](authoring/README.md) 「一条规则怎么写」

## 按钮 / 交互

| 用户会说 | 怎么做 | 点读 `04-sdk.md` |
| --- | --- | --- |
| 点按钮往输入框填字 | `message:mount` 里 `addEventListener` + `sdk.input.set` | `### sdk.input.set` |
| 点了直接发出去 | `sdk.message.send`（非用户手势会弹授权；进行中再调返回 BUSY，不排队、不占本次限频） | `### sdk.message.send` |
| 追加 / 插入到草稿 | `sdk.input.add` / `sdk.input.insert` | 对应小节 |
| 记住展开状态、滚动位置 | `sdk.cache.*`（刷新即失） | `### sdk.cache.set` |
| 存进度、存养成数据 | `sdk.save.*`（最多 10 个 key，有限频） | `### sdk.save.set` |
| 显示角色名 / 玩家昵称头像 | `sdk.role.get()` / `sdk.user.get()` | 对应小节 |

按钮也可以走 `onclick="tap()"`：脚本顶层的 `function` 会挂到 `window` 上。`svg` 里的 `onclick` 会被删。

## 常驻面板 / 地图 / 画布

气泡会滚出屏幕被销毁，所以长期存在的东西挂舞台：`sdk.stage.open('content'|'full')` + `sdk.stage.el()`。开关多次内容还在，别每次重建。用户按返回键平台会关舞台并发 `stage:close`。点读 [02-script.md](authoring/02-script.md) 「一直在的面板：挂舞台」与 `04-sdk.md` 的 `## 舞台`。

### 地图卡的作者私有存档

先按 [状态与存档](references/state-variables.md) 确定来源。需要持久化且由作者私有存档管理时，将实际用到的状态合成版本化对象，例如 `map_game`；以下字段按玩法选用：

- 玩家：当前地图、`x/y` 坐标、时间、体力、金币
- NPC：各自地图、`x/y`、是否见过、交谈次数、关系与剧情阶段
- 世界：资源节点状态、农田阶段、已触发事件
- 系统：背包、任务、小游戏次数/最高分、存档版本号

初始化与切换流程固定为：`ready` → 同步 `sdk.save.get('map_game')` → 校验并合并白名单字段 → 初始化地图；`conversation:switch` 清临时 `cache` 后重新 `get`。移动结束、地图切换、NPC 状态变化、任务交付与小游戏结算后调用同一个防抖保存函数；不要在逐帧动画、路径每一步或 `message:stream` 中直接写。`save.set` 一分钟最多 20 次且最多 10 个名字，优先只占一个名字并 `.catch` 记录失败。游客存档不保证跨登录迁移，因此存档失败不能让核心玩法失效。

最小骨架：

```js
var mapSaveTimer=null;
function loadMapGame(){mergeKnownFields(sdk.save.get('map_game'));}
function saveMapGame(){
  if(mapSaveTimer)clearTimeout(mapSaveTimer);
  mapSaveTimer=setTimeout(function(){
    sdk.save.set('map_game',gameState).catch(function(err){sdk.debug.log('地图存档失败',err&&err.code);});
    mapSaveTimer=null;
  },300);
}
sdk.on('ready',loadMapGame);
sdk.on('conversation:switch',function(){
  if(mapSaveTimer){clearTimeout(mapSaveTimer);mapSaveTimer=null;}
  sdk.cache.remove('map_runtime');loadMapGame();
});
sdk.on('dispose',function(){if(mapSaveTimer)clearTimeout(mapSaveTimer);});
```

恢复时只复制已知键并限制地图名、坐标范围、数值上下限；不要直接用外部对象替换运行时状态。采集按本次玩法结算与保存；只有用户需要小游戏时才加入小游戏，不把旧例子的实现变成所有地图卡的要求。

## 需要看事件的场合

- AI 说完一句要读最终文本 → `message:done` 的 `msg.content`（不要读气泡 DOM）
- 舞台 / 打字机要跟字 → `message:stream` 的 `msg.content`（与气泡同步的已揭示累计文字，直接替换显示，不反复追加）
- 每条气泡出现时绑按钮 → `message:mount`（`unmount` 里清）。**不要**在 mount 里读 `message-body` 当回复：空气泡一挂上那里是「消息生成中」
- 用户切深浅色 → `theme:change`；切会话 → `conversation:switch`（自己清会话内计数）
- 点读 `04-sdk.md` 的 `### 先看用哪个`

## 外链库

`https://` 开头、域名要在平台白名单里，按书写顺序加载，同一 URL 只加载一次。失败不中断整卡，只在调试面板留一行。点读 [02-script.md](authoring/02-script.md) 「外链库」。

## 拆条建议

- 一条 CSS（`{{卡名-style}}`，谁都不引用；匹配式里别带 `css` / `html` / `body` 这些保留字）
- 每块可见 UI 一条（触发串进 `statusbar` 或 `beginning`）
- 一条只放 `<script>`（`{{卡名-kit}}`，谁都不引用）
- 单条替换内容超 20000 字才继续拆；不要一上来就切成 19 段，也不要切 14 条侧边栏
