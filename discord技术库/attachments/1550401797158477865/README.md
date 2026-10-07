# mmd-ui-kit · 使用手册

把一张卡里已经跑通的整套 UI——**功能栏 / 图鉴 / 地图 / 主角档案 / 状态栏 / 选项块 / 游玩助手 / 开局引导 / 你是谁 + 主题**——
变成「**改一份配置 → 一条命令 → 一个可导入的正则包**」。

改的是配置，不是那 12 万字符的正则。这是一条**给人也给 agent 用的命令行工具链**，不是网页、也不是平台内的 JSON。

---

## 一、60 秒上手

```bash
cd ui-editor

node uix.mjs build example       # 配置 → 包，产物在 out/example.json
```

把 `out/example.json` 拿到平台「导入正则」即可。日常只需要这一条命令。

想从一张新卡起步（换基底）：

```bash
node uix.mjs init "角色卡【xxxx】正则数据.json" mine   # 抽出模板 + 配置
# 编辑 config/mine.json
node uix.mjs build mine
```

---

## 二、命令清单

统一入口是 `uix.mjs`（也可以 `npm run <name>`）。

| 命令 | 作用 |
|---|---|
| `node uix.mjs init <源包.json> [配置名]` | 从一张卡抽出模板 + 配置。**换基底时用**，会覆盖 `src/template/`、`src/base.json`、`config/<名>.json` |
| `node uix.mjs build [配置名] [输出名]` | 配置 + 模板 → `out/<输出名>.json`。默认 `build current` |
| `node uix.mjs verify [源包.json] [产物.json]` | 回读闭环自检：产物是否等价于源包 |
| `node uix.mjs example` | 生成中性示例配置并打包 |
| `node uix.mjs list` | 列出所有可配置字段（含所在规则 id） |
| `node uix.mjs diff <配置A> <配置B>` | 对比两份配置的差异字段 |
| `node uix.mjs theme` | 重新生成主题变量槽（只在改过 -1 模板后需要） |
| `node uix.mjs check [产物.json]` | 用技能自带校验器体检（技能目录用 `UIX_SKILL_DIR` 覆盖） |

`init` 内部是三步：抽取 → 改造 -1 主题 → 回写主题默认值。**可以重复跑**，模板已改造时会自动跳过，不会重复插入变量块。

---

## 三、给 agent 用的写法

这个工具包的设计目标之一就是「agent 能直接用」。给 agent 的最短指令：

```
用 mmd-ui-kit 改这张卡的 UI：
1. 读 ui-editor/config/example.json
2. 按下面要求改 data 里的字段：<具体要求>
3. 跑 node ui-editor/uix.mjs build example
4. 如果输出里有「错误」，按提示修正配置再重跑；不要手动编辑 out/ 下的产物
```

agent 必须知道的三条纪律：

1. **只改 `config/*.json`，绝不手改 `out/` 或 `src/template/`**。产物每次都由 build 全量重建，手改会被冲掉。
2. **build 输出里的「错误」必须处理**（最常见是某条规则超 20000 字），「提示」可以酌情忽略。
3. **改完跑 `node uix.mjs verify`** 确认没走样；换过基底后这一步尤其要跑。

想让 agent 知道有哪些字段可改，让它跑 `node uix.mjs list`。

---

## 四、目录

```
ui-editor/
  uix.mjs               # 命令行入口（init / build / verify / example / list / diff / check）
  package.json
  src/
    manifest.json       # 声明哪些地方是可参数化的数据区（加模块 / 改模块动这里）
    base.json           # 源包骨架，被抽走的位置留 __TPL__ / __REGEX__ / __META__
    template/-1.txt …   # 各组件模板，数据区位置写着 __INJECT__<key>__
    theme.default.json  # 主题变量默认值
    sanitize.json       # 模板注释里会泄露原卡内容的零星文本，抽取后自动替换
  config/
    current.json        # 从 319600 原样抽出的配置（含原卡数据）
    example.json        # 中性示例配置（无原卡角色 / 图片 / 成人词）
  tools/
    lib.mjs             # 括号匹配、字面量求值、序列化、注释剥离
    extract.mjs         # 包 → 模板 + 配置
    build.mjs           # 配置 + 模板 → 包（体积校验、锚点校验、词表联动）
    verify.mjs          # 骨架逐字节比对 + 数据等价比对
    make-theme.mjs      # 把 -1 的硬编码色改造成 CSS 变量
    make-example.mjs    # 生成中性示例配置
    scan-colors.mjs     # 统计某条规则里的颜色频次（挑主题变量时用）
  out/                  # 产物，直接拿去导入
```

---

## 五、配置字段表

### meta（包级）

| 字段 | 说明 |
|---|---|
| `meta.beginning` | 第一句话。**末尾必须保留那一串组件锚点**，见第七节 |
| `meta.statusbar` | 状态栏入口，一般保持 `{{hud}}` |
| `meta.pageDepth` / `chatVersion` | 与源包一致，别动 |

### data（各组件）

| 字段 | 组件 | 结构 |
|---|---|---|
| `theme` | 全局美化 (-1) | `{vars:{"--uix-xxx":"#色值", …}, extra:"自定义 CSS"}` |
| `hud.title` | 功能栏 (-2) | 字符串，一般放卡名 |
| `hud.buttons` | 功能栏 (-2) | `[{label, fn, module}]`，`fn` 是组件暴露的全局函数名 |
| `modules` | 联动开关 | `{profile, map, bestiary, status, helper, guide, who}`，`false` = 不生成对应按钮 |
| `bestiary.title` | 图鉴 (-3) | 面板标题右侧小字 |
| `bestiary.items` | 图鉴 (-3) | `{n 名字, g 0角色/1玩家, t 副标题, e 单字, i 立绘URL, c CSS渐变, d 描述, minor?}` |
| `map.city` | 地图 (-4) | 城市名（面板标题与底图 alt 两处共用同一个 key） |
| `map` | 地图 (-4) | `{img 底图URL, areas:{key:{name,x,y,sub,lore,nodes[]}}}`，x/y 是百分比 |
| `profile` | 主角档案 (-5) | `{name, title, img, info:{键:值}, desc}` |
| `status.alias` | 状态栏 (-6) | `[{std:'好感', words:['好感','好感度',…]}]`，把 AI 的各种写法归一化 |
| `status.barFields` | 状态栏 (-6) | 画成进度条的字段名，如 `['好感','信任']` |
| `status.capLoc` | 状态栏 (-6) | 状态胶囊小字，形如「卡名 · 城市」 |
| `status.numColors` | 状态栏 (-6) | `{字段名: 'linear-gradient(…)'}` |
| `status.metaFields` / `partFields` | 状态栏 (-6) | 字段名数组 |
| `status.fallbackImg` | 状态栏 (-6) | `{角色名: 立绘URL}`，AI 没写头像时兜底 |
| `choice` | 选项块 (-9) | `{tab 标签与面板标题, desc 面板说明, empty 空态, foot 页脚}` |
| `helper.spec.general/play/pose/item` | 助手页签词库 (-11) | 字符串数组 |
| `helper.evt.palace/territory/chaos/playCmd` | 助手事件库 (-11) | 字符串数组（`playCmd` 是给 AI 的指令表） |
| `events.places` | 事件标记 `<#…>` (-12) | 字符串数组 |
| `events.events` | 事件标记 `【…】` (-12) | 字符串数组 |
| `events.autoSync` | 联动开关 | 默认开：把助手面板有、但 -12 没收的事件词自动补全 |
| `guide.steps` | 开局引导 (-13) | `[{title, desc, sel?, pos?}]`，`sel` 是要指向的选择器 |
| `who.fields` | 开局·你是谁 (-15) | `[{k 字段, ph 提示, multi 0/1}]` |

**未参数化、原样搬运**：-7/-8/-10/-14 几条纯剥离规则，以及各组件的布局与交互逻辑。
选项块 -9 只抽了可见文案，选项渲染与轮数逻辑保持原样（它余量只剩 90 字，见第八节）。

---

## 六、常见改动对照

| 想做什么 | 改哪里 |
|---|---|
| 换角色 | `bestiary.items`；同时改 `status.fallbackImg` 里的同名键 |
| 换城市 | `map.city` + `map.areas` + `status.capLoc` |
| 加事件 | `helper.evt.*`，`autoSync` 会自动把新词补进 -12 正则 |
| 去掉某个功能入口 | `modules.<模块名>` 设 false，对应按钮不再生成 |
| 改状态栏字段 | `status.alias` + `status.barFields` + `status.numColors`（三者字段名要对齐） |
| 改选项块文案 | `choice`（tab / desc / empty / foot） |
| 改开场白 | `meta.beginning`，**末尾锚点别删** |
| 换整套配色 | `theme.vars` |
| 深度改样式 | `theme.extra`，自由 CSS，追加在变量块后面 |

---

## 七、三个最容易踩的坑

### 1. 开场白末尾的组件锚点不能丢

`beginning` 末尾长这样：

```
{{slrev-skin}}{{st-kit}}{{bs-kit}}{{mp-kit}}{{np-kit}}{{slrev-choice-kit}}{{evt-kit}}
```

这些是组件的挂载点。换开场白时**必须整串保留**，否则所有 UI 都不会加载——而且**不报错**，只是页面干净得异常。`build` 会检查并在缺失时提示。

### 2. 事件词表是两处，别只改一处

助手面板的 `helper.evt.*` 和负责隐藏标记的 -12 正则用的是同一套词。
**原卡里就已经不同步**：面板有「秘密约会」「意外撞见」，-12 没收——这两个标记一直没被隐藏。
`build` 默认按面板补全（`autoSync`），设 `false` 可保持原样。

### 3. 状态栏字段名三处要对齐

`status.alias`（AI 写法 → 标准名）、`status.barFields`（哪些画成进度条）、`status.numColors`（进度条配色）
用的是同一批字段名。少写一个，那条字段就静默不显示，没有任何报错。

---

## 八、体积与限制

- 平台单条 `replaceString` 上限 **20000 字**。超限 `build` 报错，超过 95% 给预警。
  当前余量（示例配置）：-9 剩 90、-6 剩 927、-11 剩 967。**-9 基本加不动东西了**，改文案时注意。
- 产物里的数据是紧凑 JSON（无缩进），就是为了省这几百字。
- `hud` 是整段 HTML 原样插入，里面别写 `</script>`，会截断脚本。
- 抽取靠「括号匹配」定位数据区，依据是 `src/manifest.json` 里的定位串。
  改了组件源码里的变量名，要同步改 manifest，否则 extract 会报「找不到定位串」。
- 关掉模块只影响功能栏按钮，组件代码仍在包里（想彻底瘦身要自己删规则）。

---

## 九、自检说明（verify 在比什么）

| 项 | 判据 |
|---|---|
| 骨架等价 | 源包与产物都挖掉数据区、清洗注释后**逐字节相同** |
| 主题 (-1) | 把变量还原成原值后与源包逐字节相同 → 证明默认视觉没变 |
| 功能栏 (-2) | 结构化重建后与源包逐字节相同 |
| 数据等价 | 从产物里重新求值出的数据 == 配置（含 -9 文案） |
| 顶层字段 | pageDepth / chatVersion / statusbar / beginning 一致 |

当前 **48 项全过**；官方校验器跑产物是 **0 error / 3 warn**，3 条告警来自源包既有写法（规则 1、9），不是打包引入的。

从零 `init` 再 `build` 的产物，与既有产物**逐字节一致**（已实测），说明抽取与打包是确定的、可复现的。

---

## 十、还没做

- [ ] 网页版表单 UI（配置已经结构化，做界面只是加一层壳）
- [ ] 按模块裁剪产物（现在关掉模块只影响按钮）
- [ ] -9 选项块的选项词与渲染逻辑参数化（这条余量只剩 90 字，需要先瘦身才做得动）

---

## 开源提示

- `out/example.json` 与 `config/example.json` 是中性示例（题材「长夜电台」），不含原卡角色、立绘与成人向词库，可直接随仓库发布。
- `config/current.json` 与 `out/current.json` 含原卡全部数据，**开源前先删掉这两个文件或换成你自己的内容**。
- `src/sanitize.json` 是模板注释清洗表，换基底后要检查一遍是否还适用。
