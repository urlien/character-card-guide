# 已知弹窗结构图谱

取证日期：2026-09-15，MMD 测试站新版聊天页。开放范围和规则以[弹窗探针](host-popup.md)为准。这里保存当前 DOM，供新角色卡直接选取相关组件换肤；未把内部类升级为稳定 SDK 契约。

目录：1 模型列表/帮助；2 模型设置；3 对话设置；4 用户人设；5 会话列表；6 自定义指令管理；7 消息编辑；8 沙盒入口/选择指令/舞台；9 未核实的条件层。

图中缩进表示结构包含，可能省略中间包装，不一律等价于 CSS 的 `>`。`[.active]` 等表示可选状态 class，不是需原样复制的选择器；并列组件可按实际布局调整。列表内容、数量、档位、价格、模型、人设及指令来自平台，不能抄成固定业务数据。

通用 `uni-scroll-view` 常包含 `.uni-scroll-view > .uni-scroll-view > .uni-scroll-view-content`。外层负责滚动，内容层默认 `height:100%`。修改网格前检查计算高度，不能一律把所有滚动层改成 `overflow:visible`。

## 1. 模型切换与模型帮助 · models

**证据：两个层均已打开。** 根本身带 `.model-switch-scope` 或 `.model-help-scope`。

```text
[data-host="models"].model-switch-scope
  .title-row
    .title
    .close-btn                         data-host-model-op="close"
  .model-filter-tabs                   uni-scroll-view + 通用包装
    .model-filter-tab                  active / active-dark / active-light
  .model-list                          uni-scroll-view + 通用包装
    .model-item                        model-item-active
      .corner-check .checkmark .css-check
      .model-top-scope
        .model-title
        .model-opt-btn                 保留原 uni-image 图标
          [data-host-model-op="open-setting"]
          [data-host-model-op="open-help"]
      .model-intro
      .model-bottom-scope
        .model-battery .icon-battery
        .model-peak-label               peak-valley
        .model-success-rate .success-badge
        .model-perm .paid-icon
    .model-list-spacer

[data-host="models"].model-help-scope
  .title
  .content
  .bottom .btn                         原生关闭帮助
```

类别、当前模型、用量/价格、权限提示随账号及平台变化。模型帮助不应触发模型切换。若统一给所有 `models` 根设置大固定高度，帮助层也会被拉成同样大小；只改列表内部时用 `.model-list` 等已核对后代。

原生列表曾为列式布局、高约 550px、横向 padding 15px，分类栏高约 30px、关闭钮绝对定位。做网格时保留外层滚动，按实际结构解除内容层的 100% 高度；小屏回到单列。以上尺寸用于解释约束，不是平台常量。

## 2. 模型设置 · model-setting

**证据：已打开。** 实际设置有输出 Token 档位、流式输出、预设提示词；没有据此证实温度/top-p 等额外字段。

```text
[data-host="model-setting"].model-setting-scope.theme-dark / theme-light
  .mp-top
    .mp-title
    .mp-close                          data-host-model-setting-op="close"
  .mp-info-bar
    .mp-model-name
    .mp-energy-pill .mp-ev .mp-el
  .mp-setting-body                     uni-scroll-view + 通用包装
    .mp-card
      .mp-card-head .mp-card-title .mp-card-hint
      .mp-tokens
        .mp-token-btn                  selected；data-host-model-token="实际值"
    .mp-switch-row                     data-host-model-setting-op="stream"
      .mp-sw-left .mp-sw-title .mp-sw-desc
      .u-switch
        .u-switch__bg
        .u-switch__node                u-switch__node--on
    .mp-explain
    .mp-preset-card
      .mp-card-head
      .mp-preset-list
        .mp-preset-item                selected
          .mp-pi-left .mp-pi-name
          .mp-pi-right .mp-preset-help .mp-pi-radio
  .bottom .btn                         data-host-model-setting-op="save"
```

根曾有 max-height 550px、overflow hidden、padding 0 16px 16px；正文 max-height 400px。仅加标题/卡片 padding 会挤掉底部确定按钮。重排采用根有界高度 + flex column，正文 `flex:1;min-height:0`，顶部、信息条、底部不收缩。

Token 原生按钮宽 `calc(25% - 4px)`、高约 30px；改网格需同时解除固定宽高。开关的行内 transform/位置表达状态，不能为配色把它清除。帮助图标必须继续走原事件，避免盖住点击区域。

## 3. 对话设置 · style

**证据：空态与有配置状态均已打开，折叠/自定义输入已查看，取消退出。** 不同角色配置不同，不因空态自行创建平台选项。

```text
[data-host="style"].conv-style-modal
  .cs-modal-header
    .cs-header-left                    取消
    .cs-header-center .cs-header-title
    .cs-header-right .confirm-btn      确定
  .cs-modal-content
    .outer-scroll-view                 uni-scroll-view + 通用包装
      .cs-group-card
        .section.behavior-section
          .cs-section-header
            .cs-title-row .cs-section-title
              .collapse-icon          is-collapsed；内含 .u-icon
            .cs-section-subtitle
          .cs-collapsible              is-open
            .cs-content-inner
              .sub-section.cs-style-section
                .style-scroll-view    内嵌滚动
                  .cs-style-grid
                    .cs-style-item    active / fixed-item
                      .style-label
                      .style-icon
                      .intro-icon-wrapper .intro-icon
                .cs-custom-input      条件显示
                  .cs-custom-textarea uni-textarea 包装
                    .uni-textarea-textarea   maxlength=1000
                  .char-count
      .bottom-spacer
    或 .empty-container .empty-text   暂无配置数据
```

此次有数据的分组包括“总结剧情、抢话设置、文风设置、人称视角、输出字数、剧情推进模式”。这是运行时配置样本，不是所有卡必须有六组。这里的“总结剧情”是对话设置里的配置项；独立记忆管理面板另见[最新总结结构](summary-panel.md)。

`.cs-style-item.active` 才是实测选中态。`.cs-collapsible.is-open` 通过 max-height/opacity 展开；不能强行把所有折叠内容显示。内嵌风格列表曾限制约 150px，头部原生约 50px；增加头部 padding 时改为自适应高度，正文保留 `min-height:0` 与滚动。

**仅已加载样式中出现，当前未验证其完整 DOM/交互：** `.cs-switch-group.disabled-interaction`、`.cs-switch-btn.active`、`.divider`、`.style-header-row`、`.btn-common`、`.fixed-item` 的全部条件状态。使用前按目标卡复核，不能凭这些类增加开关。

## 4. 用户人设 · persona

**证据：三种模式与可编辑/只读状态已查看，临时修改未保存；用户截图已显示居中后的界面。** 权限可能异步加载，初始禁用不能立即判成永久不可用。

```text
[data-host="persona"].role-profile-modal
  .header-scope .header-box
    .icon-back                        取消
    .page-title
    .complete-btn                     保存
  .role-setting
    .switch-card
      .radio-group                    uni-radio-group
        .radio-item                   uni-label ×3
          uni-radio                   禁止时 disabled=true
            .uni-radio-wrapper        选中时有原生行内颜色
              .uni-radio-input        uni-radio-input-disabled（条件）
                svg > path            已观察仅选中项存在此勾选图形
          uni-text
          .radio-lock                 可选
    .card
      .card-header .card-title        称呼
      .input-wrapper
        input.vig-native-input__el.input-dark  maxlength=20；disabled/disabled类
        .limit
    .forbidden-tag                    条件权限提示
      .ico-disable .tag-text
    .card
      .card-title .card-desc          性别
      .gender-box
        .gender-item                  active / disabled
    .card.textarea-wrapper
      .card-title .card-desc          我是谁
      textarea.vig-native-textarea__el.textarea-dark  maxlength=500；disabled/disabled类
      .count-text
```

模式为“仅使用称呼 / 全局人设 / 单独设置”。全局模式的已有称呼、描述只读，单独设置可编辑；实际权限仍以原生组件为准。性别按钮可用 `.gender-item.active`，但**顶部模式没有观察到可直接使用的 `.selected`/`.checked` 父项类**。

已复现缺陷：统一覆盖 `.uni-radio-input` 浅色背景后，原生选中底色被盖住；作者的 `.radio-item:has(svg)` 和 `.uni-radio-input:has(svg)` 又被宿主过滤器删除，导致勾选几乎看不见。

优先保留原生圆点底色，只改外框/文字。需要强化选中颜色可按当前 DOM 对 `.uni-radio-input svg` 做简单后代样式，见配方；该增强只经过本地复现，尚无实际导入后的验收。不能伪造父按钮的选中类，或用脚本越界同步宿主人设状态。

根与 `.role-setting` 可用有界高度/flex滚动布局；不要清除 textarea 的键盘适配行内高度或禁用属性。`.switch-title`、`.switch-desc`、`.apply-btn` 仅见于已加载样式，条件映射待核对。

`persona-confirm` 为独立根；不能用 `[data-host="persona"] .confirm-scope` 代替。见第 9 节。

## 5. 会话列表 / 新的聊天 · conversations

**证据：列表已打开，未创建、改名、删除会话。** “新的聊天”入口先打开列表，由其原生按钮创建。

```text
[data-host="conversations"].conversation-list-scope
  .title-row
    .title
    .close-btn                         data-host-conv-op="close"
  .conversation-list                   uni-scroll-view + 通用包装
    .conversation-item                 data-host-conv="实际会话标识"
      .left-scope .avatar img
      .center-scope
        .title-scope .cur-conversation
        .content-scope
      .right-scope
  .bottom .btn                         data-host-conv-op="create"；创建新的聊天
```

会话 ID、名称、当前标记及条数均保留运行时值。已加载样式另有 `.edit-icon`、`.delete-icon`，未执行相关动作；确认层各有独立开放根。

原生列表 max-height 约 400px，条目约 81px，头像约 62px，正文 min-width 70%、标题固定高度约 23px。大 padding/分栏容易溢出：调整条目 `height:auto` 和正文 `min-width:0`，不要靠 overflow hidden 截掉操作按钮。

## 6. 自定义指令管理 · instructions

**证据：加号菜单打开列表，添加表单已打开后返回；未添加、保存、重置、删除或执行指令。** 它不是底栏“选择指令”。

```text
[data-host="instructions"].custom-instruction-scope
  .list-scope                          列表视图
    .header-scope
      .close-btn uni-image
      .title
      .btn-scope uni-view              重置
        .add-btn                      添加
    .sub-title                        平台提供当前数量/上限
    .content-scope                     uni-scroll-view + 通用包装
      .item
        .left                         指令名称
        .right .gap uni-image         原生操作图标，实测每项四个
  或 .edit-scope                       编辑/添加视图
    .header-scope
      .back-btn uni-image
      .title
      .btn-scope .save-btn
    .content-scope
      .form-item
        .label
        .value.input-scope
          uni-input .uni-input-input  maxlength=5
          .word-count
      .form-item
        .label
        .value.custom-textarea-box
          .custom-textarea
            uni-textarea .uni-textarea-textarea  maxlength=1000
          .word-count
```

列表/编辑两种视图都要适配有界高度，标题与正文分别分配空间。原生标题有绝对定位 + `translate(-50%)`，保留这类组件对齐变换；不要批量清除所有 transform。原生列表最小高约 400px、内容最大约 500px，编辑 textarea 最小约 250px、最大约 340px；居中后由正文承担滚动。

仅样式中见 `.empty-default-show`、`.word-count.red`；嵌套弹层占位存在，但实际确认结构/根映射未打开核实。四个操作图标的具体动作不能靠顺序猜测和重绑。

## 7. 消息编辑 · message-edit

**证据：在页面隐藏 DOM 中看到，未打开验证。** 不能在通用主题中强制 `display:flex/block`，否则可能把闲置编辑器一直显示。

```text
[data-host="message-edit"].msg-edit-scope     原生行内 display:none
  .edit-input-box
    .edit-surface[contenteditable="true"]
  .option-box
    .option-item                     简转繁 / 繁转简 / 去除异常符号 / 去除异常文字
  .save-btn-box
    .save-btn
```

只可把该记录作为下一次定向核对起点；未验证可编辑态、保存及其独立确认层。

## 8. 沙盒入口、选择指令和阅读舞台

**证据：真实 DOM 与指令展开/返回状态已看。** 这些位于聊天沙盒，不能写成 `data-host` 弹窗。

```text
[data-chat="root"]
  [data-slot="statusbar"]             可承载作者的顶部 settings details
  [data-chat="author-stage"]          阅读舞台
  [data-chat="composer"]
    .composer-shortcut-wrap
      [data-chat="shortcut"]          与 instruction-bar 交替 hidden
        button[data-action="model"]          模型设置
        button[data-action="style"]          对话设置
        button[data-action="instructions"]   选择指令
        button[data-action="summary"]        剧情总结
        button[data-action="conversations"]  新的聊天
        button[data-action="persona"]        用户人设
      [data-chat="instruction-bar"]
        [data-chat="instruction-back"]
        div.instruction-scroll
          [data-chat="instruction-chip"]     平台实际指令，数量不固定
    [data-chat="model-chip"]           模型切换，包含当前用量/价格信息
```

上图省略中间包装，不保证 `model-chip` 与快捷区为直接兄弟。`data-action` 值、`.hidden`、`.composer-shortcut-wrap`、`.instruction-scroll` 都是此版观察，不自动升级为永久 API。

- 快捷包装/栏原高度 `calc(76 * var(--rpx))`，本次约 38px；包装 `position:relative;overflow:hidden`。搬到侧边栏若只改 display，会裁掉其他按钮，须同时处理高度、滚动及定位祖先。
- 隐藏状态 `.hidden` 曾用 `opacity:0;pointer-events:none;transform:translateX(-30rpx);position:absolute;inset:0`，不是仅 `display:none`。打开指令后，再开设置抽屉必须恢复整套快捷栏可见/可点状态；关闭抽屉时让原生状态重新接管。
- 保留现有 DOM 和事件，以 CSS 重排已有按钮；不 clone/重建按钮，不按文字造平台调用，不替换原生内容。
- 指令栏可重排成居中面板，仍使用原生 `instruction-back` 返回。原生指令点击的业务行为不变；调试中不要为了验证布局执行会发送消息的指令。
- 舞台曾默认 `z-index:2000`，会覆盖作者 1700 段抽屉。要求舞台低于侧栏时，限定到该卡把舞台降为 1500，抽屉遮罩/面板/原生入口 1700/1701/1702，指令面板 1800 段。这是可替换的相对层级示例，不是所有角色卡强制值；仍保持作者层 1000–1999，平台更高层交互优先。

## 9. 尚未确认的条件层

已加载样式见 `.confirm-scope`、`.title`、`.content`、`.bottom`、`.btn-gap`、`.cancel-btn`、`.ok-btn`；另有 `.alert-scope`、`.alert-title`、`.alert-content`、`.alert-bottom`、`.ok-btn`。尚未通过实际打开核实各自映射到哪个根、权限分支和按钮行为，不能当作已核实 `persona-confirm` 或通用确认组件配方。

其余开放根仅按[根目录表](host-popup.md)保存名称。将来补录时记录真实根、标题/正文/滚动/操作区、选中/禁用/空态和父级定位；未出现的内容保留待核对，不填入猜测结构。

## 10. 剧情总结 / 记忆管理 · summary（2026-09-16 更新）

最新实测根直接挂在 `.summary-sheet`，正文编辑与添加锚点均为根内覆盖层。完整主面板/子层结构、状态、可复用样式和剩余验证项统一维护在[总结结构](summary-panel.md)，避免两份结构记录不同步。
