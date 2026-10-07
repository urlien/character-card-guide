# 状态栏崩溃问题 - 排查与修复记录

## 问题概述

角色互动页面（斯卡蒂相关）中，三个选项按钮（摸头发、擦头发、询问）的 JS 代码在添加引号后导致状态栏崩溃。

## 根因分析

**引号不匹配**：第三个按钮"询问"的 `t.value` 字符串中，开头使用弯引号（`'` U+2018），结尾误用了直引号（`'` U+0027），导致 JavaScript 语法解析失败。

```
U+2018 ' LEFT SINGLE QUOTATION MARK  ← 开头
U+0027 ' APOSTROPHE (直引号)          ← 结尾（错误）
```

JS 引擎遇到不匹配的引号时会抛出 `SyntaxError`，导致整个 `<script>` 块执行失败。

## 代码对比

### 按钮1 "摸头发" ✅
```javascript
event.stopPropagation();
var t = document.querySelector('textarea');
if(t) {
  t.value = '你抬手轻轻抚上她湿漉漉的银发，指尖顺着发丝滑下。斯卡蒂没有躲开，反而微微低下头。"……你的手很干燥。"她的声音比刚才更轻了。';
  t.dispatchEvent(new Event('input', {bubbles: true}));
}
```
- 开头：`'` (U+2018)
- 结尾：`'` (U+2019)
- ✅ 引号匹配

### 按钮2 "擦头发" ✅
```javascript
event.stopPropagation();
var t = document.querySelector('textarea');
if(t) {
  t.value = '"头发不吹干会感冒的。"你拿起她搭在椅背上的干毛巾，站到她身后。斯卡蒂愣了一下，然后安静地转过身去，把后背交给了你。银发在指间沉甸甸的，带着海水残留的咸味。';
  t.dispatchEvent(new Event('input', {bubbles: true}));
}
```
- 开头：`'` (U+2018)
- 结尾：`'` (U+2019)
- ✅ 引号匹配

### 按钮3 "询问" ❌
```javascript
event.stopPropagation();
var t = document.querySelector('textarea');
if(t) {
  t.value = '"劳伦缇娜刚才发消息问你去不去吃宵夜。"斯卡蒂沉默了两秒。"……明天吧。现在……"她收紧了怀里的布偶，"现在我只想待在这里。"';
  t.dispatchEvent(new Event('input', {bubbles: true}));
}
```
- 开头：`'` (U+2018)
- 结尾：`'` (U+0027) ← **直引号，不匹配！**
- ❌ 导致 SyntaxError

## 修复方案

将第三个按钮结尾的直引号 `'` (U+0027) 替换为弯引号 `'` (U+2019)：

```diff
- t.value = '...现在我只想待在这里。"';
+ t.value = '...现在我只想待在这里。"';
```

## 页面结构参考

| 属性 | 值 |
|------|-----|
| 按钮 CSS 类名 | `skd-opt-b` |
| 事件处理 | `onclick` + `event.stopPropagation()` |
| 目标元素 | `document.querySelector('textarea')` |
| 内容更新通知 | `new Event('input', {bubbles: true})` |

## 预防措施

1. **编辑器设置**：确保文本编辑器不会自动将弯引号转换为直引号
2. **代码审查**：在粘贴中文文本到 JS 字符串时，检查引号是否匹配
3. **使用模板字面量**：考虑用反引号 `` ` `` 包裹长文本，避免引号冲突：
   ```javascript
   t.value = `...文本内容...`;
   ```
