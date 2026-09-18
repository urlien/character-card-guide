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

明日方舟可露希尔角色卡的状态栏风格。具体做法等制作时再讨论。

> 注：导出的 SVG 文字是固定的。若状态栏需要动态数值，需借其视觉风格（扫描线/荧光绿/打字机感）用 HTML/CSS 另行实现。
