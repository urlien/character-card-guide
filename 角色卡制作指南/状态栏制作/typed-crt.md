# typed-crt — CRT 风格文字生成器

用于角色卡状态栏的 CRT 复古终端风格。

## 网址

- 在线版（直接用）：https://crt.twimark.cc.cd/edit
- 仓库：https://github.com/Steve245270533/typed-crt

## 说明

浏览器内编辑文字与颜色，实时生成带打字动画、扫描线、荧光屏质感的 CRT 画面，导出为独立 SVG。导出的 SVG 自包含，不需要外部资源或脚本。

七个主题：default / monochrome-green / green-scanlines / apple / vintage / ibm-3278 / futuristic

在线版路径：/edit（编辑器）、/svg（输出页）

本地跑（需要改源码时）：pnpm install + pnpm dev

## 用途

可露希尔角色卡状态栏的 CRT 风格参照。

状态栏的「替换内容」本质是一段 HTML/CSS/JS（用 $1 $2 占位符接收正则捕获组）。所以做法是：参照 typed-crt 的 CRT 视觉，先写一版 CRT 风格的静态 HTML，再把固定文字改成占位符，做成动态状态栏。

即：typed-crt 的价值是提供 CRT 风格的视觉起点，不是直接导出成品。

> 注：typed-crt 导出的是 SVG（文字固定）。状态栏需要动态数值，因此借其视觉风格（扫描线/荧光绿/打字机感/暗角）用 HTML/CSS 复刻。
