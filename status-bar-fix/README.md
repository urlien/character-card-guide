# 状态栏修改

## ⚡ 待办（下次上线优先做）

1. **拿到斯卡蒂状态栏的代码文件路径**（用户截图中的代码，不在杰西卡日记仓库里，是另一个项目）
2. **修复第三个按钮"询问"的引号不匹配问题**：
   - 开头：`'` (U+2018 LEFT SINGLE QUOTATION MARK)
   - 结尾：`'` (U+0027 APOSTROPHE) ← 错误，应改为 `'` (U+2019)
3. **检查其他按钮是否有类似引号问题**

## 📋 问题描述

角色互动页面（斯卡蒂/Arknights 相关），三个选项按钮通过 JS 往 textarea 填入预设文本：

| 按钮 | 状态 |
|------|------|
| 摸头发 | ✅ 正常 |
| 擦头发 | ✅ 正常 |
| 询问 | ❌ 引号不匹配，导致 JS SyntaxError，状态栏崩溃 |

## 🔧 修复方法

```javascript
// 修复前（崩溃）
t.value = '...现在我只想待在这里。"';
//                                  ^ U+0027 直引号

// 修复后（正常）
t.value = '...现在我只想待在这里。"';
//                                  ^ U+2019 弯引号
```

## 📁 文件

- [status-bar-crash-fix.md](./status-bar-crash-fix.md) — 完整排查记录
- [2026-06-10.md](./2026-06-10.md) — 2026-06-10 工作日志

## 🔗 相关仓库

- [jessica-diary](https://github.com/urlien/jessica-diary) — 杰西卡日记（**无关项目，不要混**）
- [jessica-build-env](https://github.com/urlien/jessica-build-env) — 杰西卡编译环境（**无关项目，不要混**）
