# 弹窗换肤与交互复用配方

按用户当前卡的风格选择颜色、圆角、宽度、字体、分栏和入口形式，不把“雨幕来信”的配色、角色名或七个入口固化成所有卡的要求。结构取[图谱](host-popup-structures.md)，范围及过滤规则取[探针说明](host-popup.md)。

以下 CSS 为可改写配方，放进正则规则的 `<style>`；不等于完整正则导入文件。配方不提供业务接口。静态检查、本地布局复现和实际平台导入是不同验证级别。

## 1. 先确定改哪里

| 目标 | 复用路径 |
| --- | --- |
| 全部已有白名单弹窗只改配色 | [18 个底栏/弹窗变量](../authoring/01-style.md)，原生布局保持 |
| 模型、设置、用户人设等内部组件换肤 | 开放宿主根 + 图谱的内部 class，按选中/禁用态分别定义 |
| 底部弹出改居中 | 先确认根及祖先定位，再用本文件第 3 节的有界布局 |
| 顶部一个设置入口，右侧列出平台功能 | 在功能栏定义作者抽屉，以 CSS 重排现有 shortcut/model-chip，见第 4 节 |
| 选择指令改为居中面板 | 第 5 节；仍是沙盒的真实 instruction-bar |
| 剧情总结改居中 | 平台已兼容且用户确认正常；直接复用[总结结构与完整样式模板](summary-panel.md) |

## 2. 主题与真实选中态

先选背景、正文、次要文字、边框、强调色、选中背景/文字六类颜色。只改颜色优先 `--chat-modal-*`；更细的组件用根后代，别写全局 `.btn`/`uni-view`。宿主与沙盒是两棵树，不能假设作者的自定义 CSS 变量自动继承到宿主；示例使用可替换的明确颜色。

```css
[data-host="model-setting"] .mp-card {
  background: #f7f2e6;
  color: #334a40;
  border: 1px solid #bac4ab;
  border-radius: 12px;
}
[data-host="model-setting"] .mp-token-btn.selected {
  background: #294c40 !important;
  color: #fff5df !important;
  border-color: #294c40 !important;
}
[data-host="model-setting"] .mp-preset-item.selected {
  background: #dce6ce !important;
  border-color: #748858 !important;
}
[data-host="style"] .cs-style-item.active {
  background: #294c40 !important;
  color: #fff5df !important;
  border-color: #294c40 !important;
}
[data-host="persona"] .gender-item.active {
  background: #294c40 !important;
  color: #fff5df !important;
  border-color: #294c40 !important;
}
[data-host="models"] .model-item-active {
  background: #dce6ce !important;
  border-color: #748858 !important;
}
```

把这些颜色替换成目标游戏主题即可；不要求所有角色卡都用纸色和绿色。普通态、hover 与选中态分别处理，选中态应放在普通态之后且具更高优先级。保留 `.disabled`、`[disabled]`、权限锁、开关位置、原生文字与图标，不通过 pointer-events 覆盖权限。

### 用户人设顶部三模式的例外

**默认做法：删除主题里覆盖 `.uni-radio-input` 的通用背景，保留原生选中底色。** 已核对的性别 `.active` 不能套用于顶部模式。宿主不接受 `:has(svg)`，无法据此给整个父按钮着色。

若当前 DOM 仍然只有选中圆点包含 SVG，可用下面的简单后代增强其对比；这个方案来自本地 v5 复现，平台导入后的效果仍需验证。它只强化真实勾选图形，不承诺整个模式按钮出现选中底色。

```css
[data-host="persona"] .uni-radio-input svg {
  background-color: #294c40 !important;
  border: 3px solid #294c40 !important;
  border-radius: 50% !important;
  box-sizing: content-box !important;
  box-shadow: 0 0 0 2px #bac4ab !important;
}
```

不要改 SVG 的 path 内容/形状，不要为不存在的 `.radio-item.selected` 编造状态。如果平台更新提供选中属性，再根据真实属性给父项换肤。

## 3. 宿主居中：根定位 + 头尾固定 + 正文滚动

适用前提：该根已开放；弹窗打开并完成动画后，确认定位祖先没有仍生效的 transform/filter/contain 或裁切，使 `position:fixed` 错以祖先作为定位容器；确认原生遮罩和关闭仍覆盖正确范围。2026-09-15 模型设置祖先观察到动画结束后 `transform:none`，不能外推所有版本/弹层。

不用 `translate(-50%,-50%)` 覆盖宿主的键盘变换。下面只演示模型设置；其他根按后面的布局表适配，而非将所有 19 类一刀切成相同高度。示例尺寸和配色可按卡自由修改。

```css
[data-host="model-setting"] {
  position: fixed !important;
  top: max(16px, calc((100dvh - min(680px, 82dvh)) / 2)) !important;
  bottom: auto !important;
  left: 0 !important;
  right: 0 !important;
  margin: 0 auto !important;
  width: min(920px, calc(100vw - 32px)) !important;
  height: min(680px, 82dvh) !important;
  max-height: 82dvh !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border-radius: 16px !important;
}
[data-host="model-setting"] .mp-top,
[data-host="model-setting"] .mp-info-bar,
[data-host="model-setting"] .bottom {
  flex: 0 0 auto !important;
}
[data-host="model-setting"] .mp-setting-body {
  flex: 1 1 0% !important;
  min-height: 0 !important;
  height: 0 !important;
  max-height: none !important;
}
```

这里不改原生滚动包装的滚动机制，不碰宿主的 z-index/transform，不强行显示原本隐藏的备用编辑器。软键盘适配必须再测；若定位祖先不满足条件，保留原生定位并说明边界，不能跨根去改全站 popup。

| 根 | 头尾保持可见 | 承担剩余高度的正文 | 特别约束 |
| --- | --- | --- | --- |
| `models` 列表 | `.title-row`、`.model-filter-tabs` | `.model-list` | 同根帮助层另做自然高度；列表内部网格不要撑死滚动 |
| `model-setting` | `.mp-top`、`.mp-info-bar`、`.bottom` | `.mp-setting-body` | Token 按钮若用网格，同步解除原固定宽高 |
| `style` | `.cs-modal-header` | `.cs-modal-content` 内 `.outer-scroll-view` | 外层 min-height:0，保留分组折叠/内嵌滚动 |
| `persona` | `.header-scope` | `.role-setting` | 模式变化内容高度不同；不能去除只读状态 |
| `conversations` | `.title-row`、`.bottom` | `.conversation-list` | 条目 height:auto、正文 min-width:0，保留原生创建入口 |
| `summary` | `.summary-top`、`.summary-footer` | `.summary-body` | 正文编辑/锚点层为根内 absolute，保留原生覆盖关系；完整模板见总结文档 |
| `instructions` | 两视图各自 `.header-scope` | 各自 `.content-scope` | `.list-scope`/`.edit-scope` 均需要有界高度/flex，防止换页后撑出窗口 |

不认识的根先做整体配色，别猜头尾布局。固定宽度用 `min(..., calc(100vw - ...))`，正文 `min-height:0`；标题/页脚 padding 增大时也要解除原生固定高度。实际测试短屏、长列表、输入聚焦与二次确认。

## 4. 顶部设置 → 右侧抽屉

这是可选交互，不是所有写卡任务必须加的模块。功能栏规则可生成 `<details class="card-settings"><summary>设置</summary>…</details>`；抽屉内容使用白名单 `div`、`button`、`span`。作者标题可以定制，平台原生按钮的文案与事件保留。

实现组合：

1. 作者 details 控制抽屉遮罩/面板；脚本只管理作者 open 状态、关闭与焦点，不能把宿主设置搬进作者 DOM。
2. 根据沙盒 `[data-chat="root"]:has(.card-settings[open])`，把现有 `shortcut` 和 `model-chip` 以 fixed 定位到侧栏可点区域。该 `:has()` 仅用于沙盒 CSS，不能挪到宿主选择器。
3. 完整覆盖快捷栏原固定高度/隐藏状态；抽屉关闭时这些覆盖不生效，让指令模式自行接管。
4. 用户点击现有平台按钮时收起作者抽屉，原生事件继续打开对应功能。监听在卡销毁时清理，会话切换时关闭抽屉；Esc/遮罩/关闭按钮可退出并把焦点交还入口。

下面是对已有抽屉的关键补丁，**不含完整标题、遮罩和 model-chip 的定位，不能单独作为抽屉成品交付**。需按实际抽屉尺寸配齐，避免隐藏原生按钮后没有替代入口。

```css
[data-chat="root"]:has(.card-settings[open]) [data-chat="shortcut"] {
  display: flex !important;
  position: fixed !important;
  top: 210px !important;
  right: 24px !important;
  bottom: auto !important;
  left: auto !important;
  width: min(332px, calc(100vw - 48px)) !important;
  height: auto !important;
  max-height: calc(100dvh - 260px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  flex-direction: column !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transform: none !important;
  z-index: 1702 !important;
}
[data-chat="root"]:has(.card-settings[open]) [data-chat="shortcut"] button {
  flex-shrink: 0 !important;
  width: 100% !important;
  height: auto !important;
  min-height: 48px !important;
}
[data-chat="root"]:has(.card-settings) [data-chat="author-stage"] {
  z-index: 1500 !important;
}
```

这里清除的是**沙盒快捷栏的隐藏位移**，不是宿主键盘避让，适用范围不能混淆。短屏降低 top 或将整个侧栏滚动，不能让 max-height 变成无可用空间。model-chip 需要独立预留位置，其真实内容可能只有价格/用量信息，不要把它当模型名称字段。

层级示例：舞台 1500 → 抽屉遮罩 1700 → 抽屉面板 1701 → 原生入口 1702。检查 stacking context；仅改一个数字不能穿透具有 transform/filter 的祖先。

## 5. 将“选择指令”重排成居中面板

沿用 `[data-chat="instruction-bar"]`、真实 `instruction-chip` 和 `instruction-back`。依据当前 `.hidden` 状态显示，指令展开时快捷栏虽不可见仍在 DOM，抽屉再次打开必须恢复第 4 节完整状态。

可复用布局要点：

- 用作者卡标记限定作用域：`[data-chat="root"]:has(.card-settings)`，不影响其他角色卡。
- 通常隐藏指令栏；`:not(.hidden)` 时设 fixed 居中，视口边距至少可容纳返回按钮，有界高度（例如 `min(520px,82dvh)`），显式恢复 opacity/pointer-events/隐藏位移。
- 标题和遮罩放作者自己的节点，以同一沙盒状态选择器同步显示；不要给宿主新增数据或覆盖平台文字。
- 原生 `instruction-back` 固定在面板内部左上；已核实的直接 `div.instruction-scroll` 用可滚动网格，`min-height:0`；桌面两列/窄屏一列可按游戏风格修改。
- 指令按钮取消 nowrap、允许长名称换行，保留原事件。用原生返回退出模式，不只藏作者遮罩。
- 若设计为指令面板打开时关闭抽屉，指令层可用 1800 段；若允许二者同时显示，应按明确交互安排遮罩，不能留下看得到点不到的侧栏按钮。

选择指令居中在本地复现中已检查，未将 v5 导入平台完成验收。未来新卡应在实际导入后测试：打开指令→原生返回→再开设置；全部入口均可点，隐藏的指令层不拦截页面。不要把本地模拟回调当成已验证真实发送/保存。

## 6. 下次创建新卡时的最小复用流程

按当前请求挑选弹窗与主题 → 查图谱的真实状态和滚动区 → 应用相关配方到完整正则包 → 保留人设/世界书导入语义 → 静态校验 → 实际导入验证已用入口。

没有平台结构变化迹象时，可直接用本图谱起稿，不必重新从零探测每个弹窗。出现选择器未命中、过滤规则消失、权限/数据结构改变时再定向复核；把新观察补入对应文件，并保留验证程度。总结的根挂载和平台兼容问题已解决，可直接按模板起稿；新卡的不同布局仍按实际改动验证。用户使用反馈与助手逐项验收分别记录。
