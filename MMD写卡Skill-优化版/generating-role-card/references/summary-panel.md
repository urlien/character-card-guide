# 剧情总结 / 记忆管理：可复用结构与样式

当前状态（2026-09-16）：用户确认“平台兼容了，现在没问题了”。此前 v6 导入后 summary 样式未转发的阻断已由平台解决；新卡可以复用 `[data-host="summary"]` 编写主题和居中布局。此状态来自用户实际使用反馈，本次资料审核不冒充重新完成浏览器或所有设备验收。

## 实现入口

根属性直接挂在 `.summary-sheet` 本身，根样式写 `[data-host="summary"]`，不能写 `[data-host="summary"] .summary-sheet`。主面板、正文编辑 `.summary-ov-edit` 与添加锚点 `.summary-ov-anchor` 均在同一个根内，不需要新造接口或额外弹窗。

已附可直接改写的完整[总结主题样式模板](../assets/summary-popup.example.css)，取自用户反馈恢复正常的 v6 交付。把文件内容放入完整正则包某条规则的 `<style>`；它不是独立导入 JSON。模板自带视口居中、固定标题/保存区、正文滚动、选中态、编辑与锚点输入区、窄屏及短屏适配。配色和尺寸均为示例，可以按新卡重新设计，不固定为雨幕来信风格。

按需求改模板：根的 background/color/border/radius 控制外观；width/height/top 配套调整位置与大小；`.summary-top` / `.summary-edit-header` 控制标题；`.summary-card` / `.summary-tier.selected` / `.summary-preset-item.selected` 控制内容及选中态；`.summary-footer` / `.summary-save-btn` 控制操作区。变更组件名、定位祖先或平台过滤规则时才定向复核，不要求每张新卡都重新从零探测。

该模板保留原生 transform、开关位移、禁用态、数据、价格、权限和事件。不以 CSS 取消真实禁用限制，不替换图标/业务文案。主题自由度限于平台开放的样式范围，不等于允许任意脚本或绕过样式过滤。

## 布局关系

```text
.u-transition                         平台动画层
  .u-popup__content
    [data-host="summary"].summary-sheet
      .summary-top                    标题和关闭
      .summary-body                   原生滚动区
      .summary-footer                 费用说明和保存
      .summary-overlay.summary-ov-edit    条件出现：正文编辑
      .summary-overlay.summary-ov-anchor  条件出现：添加锚点
```

根 flex column、有界宽高，正文 `flex:1;min-height:0;height:0`，头尾不收缩。编辑层沿用根内 absolute 覆盖关系。居中不使用 transform 替代平台动画/键盘避让；目标环境的定位祖先变化时按[居中配方](host-popup-recipes.md)复核。

以下结构来自此前实际打开的面板，不把模型、档位、价格、轮数、容量和条数样本写死成新卡数据。

## 已观察结构

缩进表示包含关系，省略部分包装；`[.selected]` 表示条件状态，不是字面选择器。

```text
[data-host="summary"].summary-sheet.theme-dark / theme-light
  .summary-top
    .summary-top-title
    .summary-close
  .summary-body                          uni-scroll-view 与原生包装
    .summary-master-bar                  off（已观察关闭态）
      .summary-master-left
        .summary-master-icon
        .summary-master-info
          .summary-master-title
          .summary-master-desc
      .summary-tgl                       on / off
    .summary-disabled-wrap               summary-disabled-show（关闭时）
      .summary-disabled-overlay
        .summary-disabled-text           关闭说明，阻挡下方交互
      .summary-auto-bar                  dimmed（关闭时）
        .summary-auto-left
          .summary-auto-icon
          .summary-auto-info
            .summary-auto-title
            .summary-auto-desc
              .summary-round-input
                uni-input .uni-input-input  number
            .summary-auto-range-hint
        .summary-tgl                     on / off
      .summary-section                   当前总结正文
        .summary-label .summary-label-count
        .summary-card
          .summary-content-shell
            .summary-content-box
              .summary-content-empty    本次为空
          .summary-content-actions
            .summary-btn.secondary      disabled（条件）
      #tierSection.summary-section       总结容量档位
        .summary-label
        .summary-card .summary-tier-row
          .summary-tier                 selected
            .summary-tier-num
            .summary-tier-cost
      .summary-section                   总结模型
        .summary-label
        .summary-card
          .summary-preset-item          selected
            .summary-pi-left .summary-pi-name
            .summary-pi-right
              .summary-pi-cost
              .summary-pi-radio
      #summaryPromptSection.summary-section  总结提示词/预设
        .summary-label
        .summary-card
          .summary-preset-item          selected
            .summary-pi-left .summary-pi-name
            .summary-pi-right
              .summary-pi-help
              .summary-pi-radio
      .summary-divider
      .summary-section                   记忆锚点
        .summary-label .summary-label-count
        .summary-anchor-empty           本次无锚点
    .summary-body-spacer
  .summary-footer.bottom
    .summary-cost-summary
      .summary-cost-plan
      .summary-cost-note
    .summary-save-btn.btn                保存设置
```

界面已见：记忆启用开关、自动总结及触发轮数、正文编辑/恢复入口、容量档位、模型、提示词/自定义预设、锚点区域与费用说明。轮数范围、容量、模型名、价格、预设和锚点限额由平台返回；此次配置样本不是写卡常量。

## 已打开核对的内部编辑层

两层均是 `summary` 根的后代，当前无需虚构独立 `data-host`。原生均为 `position:absolute;inset:0;z-index:30`，覆盖主面板内部；修改主根尺寸时保留这个包含关系，不清除覆盖层定位。

```text
[data-host="summary"]
  .summary-overlay.summary-ov-edit
    .summary-edit-header
      .summary-edit-back             原生返回
      .summary-edit-title
      .summary-edit-save             保存，未点击
    .summary-ov-body
      .summary-ov-textarea-shell.summary-edit-input
        uni-textarea.summary-ov-textarea
          .uni-textarea-wrapper
            textarea.uni-textarea-textarea   本次 maxlength=-1
      .summary-ov-count              原生业务字数提示

  .summary-overlay.summary-ov-anchor
    .summary-edit-header
      .summary-edit-back
      .summary-edit-title
      .summary-edit-save
    .summary-ov-body
      .summary-oa-tip
      .summary-edit-input.summary-anchor-input-shell
        uni-textarea.summary-oa-input
          .uni-textarea-wrapper
            textarea.uni-textarea-textarea   本次 maxlength=200
      .summary-oa-hint
```

DOM 的 maxlength 不等于完整业务额度：总结容量及锚点限制保留平台运行时逻辑，不能由 `-1` 推导为无限容量。恢复按钮当前 disabled；未触发恢复或删除确认。自定义预设编辑和已有锚点的编辑/删除层仍待核对。

## 验证来源与剩余未知项

- 浏览器已核对：真实根、主面板结构、选中/关闭状态、正文编辑和新增锚点打开及原生返回。
- v6 本地复现已检查：桌面、窄屏、短屏居中与滚动，固定保存区，编辑/锚点输入区，以及编辑返回。
- 用户最新确认：平台已兼容，当前使用已无问题。旧的空根、未注入结论不再是当前阻断。
- 未单独细查的分支：有内容的锚点条目编辑/删除确认、自定义总结预设编辑、恢复确认，以及所有设备软键盘和保存持久化组合。不能把用户整体反馈扩写为这些分支均已由助手逐项实测。

## 历史故障的排查价值

曾先后出现“无根”“根为空节点”“规则已在沙盒但宿主没有 summary 样式”，现均不应作为新卡的默认限制。若未来出现类似回归，依次核对：导入规则存在 → 样式已抽取到宿主 → 真实根命中 → 计算样式/定位祖先。确认是样式转发缺失时，不通过增加 !important 或虚构面板绕过。当前仍遵循宿主过滤规则：平铺选择器、开放根前缀，不使用已知被过滤的 :has()/url()/原生嵌套。
