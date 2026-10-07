# MMD 新版 UI 编排台

这是一个可离线打开的单文件 HTML 编辑器，针对 MMD 新版聊天页（`chatVersion: 1`）。

## 使用

1. 打开 `mmd-ui-editor-new-page.html`。
2. 在左侧编辑基础、主题、功能栏、图鉴、地图、状态栏、选项块、助手、引导和事件词表。
3. 「检查与导出」确认没有错误。
4. 点击「导出正则包」，得到可在 MMD 创卡页使用的 `*-regex.json`。
5. 点击「备份项目」，得到下次可继续编辑的 `*-project.json`。

## 新版导入注意

- 正则包必须在 MMD 创卡页以新建卡方式导入。
- 首次保存前选择「使用新版」聊天页。
- `chatVersion: 1`、`pageDepth: 2`、`statusbar` 和开场组件锚点由编辑器固定维护。
- 创卡页预览不具备完整 SDK，导入后请回聊天页验收。

## 文件

- `output/mmd-ui-editor-new-page.html`：最终单文件编辑器，直接打开即可。
- `web-src/`：编辑器源码（HTML 壳、CSS、JS）。
- `build_web.py`：重新嵌入模板并生成单文件 HTML。
- `source/`：原始 UI 配置、模板和命令行工具链。

所有编辑、构建、检查和本地自动保存都在浏览器本地完成，不会上传项目内容。
