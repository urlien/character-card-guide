# 1. 样式

把下面整段贴进某条规则的**替换内容**。所有规则里的 `<style>` 会合成一张全页样式表，后写的盖住先写的。

## 改气泡颜色

用变量，深浅色切换时会跟着变。不要写死 `#fff`。

<!-- fixture:style-bubble -->

```html
<style>
[data-chat="root"] {
  --chat-bubble-ai-bg: #1b2430;
  --chat-bubble-text: #e6f0ff;
  --chat-accent: #7cc0ff;
}
</style>
```

## 改自己画的块

消息或功能栏里的 HTML，class 你自己起。建议加前缀，免得撞上平台内部名字。

<!-- fixture:style-hud -->

```html
<div class="my-hud">状态：<b class="my-hp">10</b></div>
<style>
.my-hud {
  padding: 6px 10px;
  font-size: 13px;
}
.my-hp {
  color: var(--chat-accent);
}
</style>
```

## 改功能栏

`[data-slot="statusbar"]` 平台没给它写样式，背景、高度、粘在顶部都要你自己填。`statusbar` 留空的话，这个节点不会出现。

<!-- fixture:style-statusbar -->

```html
<style>
[data-slot="statusbar"] {
  position: sticky;
  top: 0;
  padding: 8px 12px;
  background: linear-gradient(90deg, #1b2430, #24344a);
  color: var(--chat-text);
}
</style>
```

功能栏的 HTML 由平台按 `statusbar` 字段整块写进去。改里面已有节点的文字、class 没问题；**用 JS 往里塞新节点留不住**——创卡页里你每改一次规则这块就重画一次，插进去的东西会一起没。会变的内容写进规则，长期面板放舞台，见[第 2 章](02-script.md)。

## 只跟着某个节点走

进度条宽度、血条颜色这种算出来的值，写在标签的 `style=""` 上。

<!-- fixture:style-inline -->

```html
<div class="my-bar" style="width: 70%; background: var(--chat-accent); height: 8px; border-radius: 4px;"></div>
```

注意：内联 `style=""` 压过上面 `<style>` 里的规则。颜色仍尽量用 `var(--chat-accent)`，才会跟主题走。

## 藏掉底部输入区

只是视觉上藏。用户还要能发消息的话，用 SDK 的 `composer.hide`，并自己给一条发送的路，见[第 4 章](04-sdk.md)。

<!-- fixture:style-hide-composer -->

```html
<style>
[data-chat="composer"] {
  display: none;
}
</style>
```

## 浮层别盖住平台按钮

你的面板用 `1000–1999`。再高会挡住长按菜单和提示。

<!-- fixture:style-zindex -->

```html
<style>
.my-panel {
  position: absolute;
  z-index: 1200;
}
</style>
```

## 改底栏、输入框和白名单弹窗

`--chat-bg`、`--chat-text`、`--chat-accent` 只对应消息区域的语义配色，不能带动底栏及宿主弹窗。底栏、快捷按钮、输入框和会话列表/模型/角色资料/记忆管理等白名单弹窗使用下面的独立变量；不用于更换发送键、顶栏或加号菜单中的平台图标，也不要据此推断所有系统弹窗都可换肤。

下面是一套深色示例配色；用户要求随主题切换时分别为浅色/深色设置对应值，不把固定色值误称为会自动适配。

<!-- fixture:style-host-theme -->

```html
<style>
[data-chat="root"] {
  --chat-composer-bg: #121418;
  --chat-composer-text: #e8e8e8;
  --chat-shortcut-bg: #2a2c32;
  --chat-shortcut-text: #d0d0d0;
  --chat-input-bg: #1a1b20;
  --chat-input-text: #ffffff;
  --chat-input-placeholder: #8a8a8a;
  --chat-input-border: #7cc0ff;
  --chat-modal-bg: #121418;
  --chat-modal-surface: #2a2c32;
  --chat-modal-text: #e8e8e8;
  --chat-modal-muted: #9aa0a6;
  --chat-modal-accent: #7cc0ff;
  --chat-modal-input-bg: #1a1b20;
  --chat-modal-input-text: #ffffff;
  --chat-modal-cancel-bg: #3a3d44;
  --chat-modal-btn-bg: #2a2c32;
  --chat-modal-btn-border: transparent;
}
</style>
```

各变量作用见 [契约参考](reference.md) 的“底栏和白名单弹窗”表。气泡换肤和底栏换肤分别选择所需变量，只有用户要求整套主题时同时处理。

## 能改的颜色变量

`--chat-bg`、`--chat-surface`、`--chat-text`、`--chat-text-muted`、`--chat-border`、`--chat-accent`、`--chat-bubble-user-bg`、`--chat-bubble-ai-bg`、`--chat-bubble-text`、`--chat-viewport-height`。

气泡那三个默认等于页面的背景和文字，只改其中一个也不会和整页脱节。

页面上还能选中哪些块，见[第 3 章](03-dom.md)。

## 改宿主弹窗

只服务新卡。在同一张作者 `<style>` 里写开放根名，规则会抽到宿主、滤完再注入。最左必须是开放 `[data-host="…"]`。内部件对着开发者工具抄 class，写成后代（空格或 `>`）。下面夹具里的 `.complete-btn` 是例子，不是承诺；class 会变，弹窗改布局了你自己改卡。

原手册开放这些根：`conversations`、`conv-delete`、`conv-rename`、`conv-limit`、`models`、`model-setting`、`persona`、`persona-confirm`、`extra`、`style`、`instructions`、`reset`、`background`、`assistant-intro`、`message-edit`、`message-delete`、`message-backtrack`、`share-role`、`share-records`。

原手册不开放：`recharge`、`sdk-prompt`、`sandbox-lost`、`boot-loading`、登录页；另新增的 `summary` 根已由用户确认平台兼容正常，见本节末尾复用资料。不能换图标、不能改平台文案。`persona-confirm` 不在 `persona` 子树里，要单独写。平台自己带 `!important` 的零件不保证盖得过。`transform` 可能打坏键盘避让，不保证。原生嵌套写法整条丢，摊平再写。`url(` 会丢掉该声明。

<!-- fixture:style-host-popup -->

```html
<style>
[data-host="conversations"] {
  background: #1b2230;
  color: #e8e8e8;
}
[data-host="persona-confirm"] {
  background: #2a2c32;
}
[data-host="persona"] .complete-btn {
  background: #2a2c32;
  color: #e8e8e8;
}
</style>
```

只写 `--chat-modal-*`、不写 `data-host` 时，弹窗仍走上面那套色变量，不会注入这张宿主表。

弹窗名称、探针使用与验收见[宿主弹窗探针](../references/host-popup.md)。

2026-09-15 实际宿主过滤还丢弃了 `:has()` 规则；沙盒可用不等于宿主可用。人设顶部三模式不能猜 `.selected` 父项类，统一覆盖原生圆点底色会遮掉选中态。已核对的内部层级、状态及滚动约束见[结构图谱](../references/host-popup-structures.md)，可改写的配色、居中、侧栏及指令面板见[复用配方](../references/host-popup-recipes.md)。

独立剧情总结/记忆管理现在可用 `[data-host="summary"]` 定位真实面板及根内的正文编辑/添加锚点层；完整结构与示例见[总结接入复核](../references/summary-panel.md)。2026-09-16 用户确认平台兼容后正常，可直接复用完整总结主题模板；新卡改动后的布局和目标设备仍应验证。
