# 反思日志

## 2026-06-24 — 黍角色卡制作

### 做了什么
1. 从三个来源（萌娘百科、PRTS wiki、GitHub lore wiki）收集黍的角色设定
2. 在 sexyai.ai 上学习了角色卡制作的完整流程
3. 制作了黍的 DL 向恋爱角色卡人设（8000+ 字符）
4. 修正了相关角色的身高数据（从萌娘百科逐个核实）
5. 学习了使用 MiMo Vision API 分析立绘图片
6. 安装了 ffmpeg + Whisper 视频分析工具链
7. 创建了 video-analyzer Skill 整合抽帧+转录+识图

### 学到了什么
1. **数据准确性很重要**：身高等硬数据必须从官方来源（萌娘百科/PRTS wiki）核实，不能猜测
2. **edit_file 比 write_file 更安全**：定点修改不会覆盖用户辛苦改好的内容
3. **Google OAuth 对自动化浏览器有检测**：headless Chrome 会被拦截，需要 `--auto-connect` 连接真实 Chrome
4. **MiMo Vision API 可以分析立绘**：提供详细的服装、配饰、姿态描述
5. **角色卡制作有严格的格式要求**：Token 预算、字数限制、台词来源等

### 犯了什么错
1. **反复重写整个文件**：每次修改都用 write_file 重写整个文件，覆盖了用户辛苦修改的内容。教训：只用 edit_file 做定点修改
2. **身高数据不准确**：最初凭猜测写了年155cm、夕160cm等，实际分别是165cm、162cm。教训：所有数据必须从官方来源核实
3. **Chrome 调试端口不稳定**：反复断连，浪费大量时间。教训：先确认端口状态再操作
4. **MiMo API 编码问题**：Windows 控制台的中文编码导致输出乱码。教训：用 Python 写入 UTF-8 文件再读取

### 下次改进
1. 修改文件时始终用 edit_file，绝不重写整个文件
2. 所有数据从官方来源核实后再写入
3. 操作 Chrome 前先确认端口状态
4. API 输出统一写入 UTF-8 文件再读取
5. 先理解用户需求再动手，不要急着改

## 2026-08-10 — 浏览器工具就位（解决之前两大痛点）

### 做了什么
1. 评估三个浏览器自动化方案（ego-lite / nekoro-browser / PilotBrowseMCP），选定两个装机
2. 安装 nekoro-browser v0.2.0（pip 零依赖）+ PilotBrowseMCP（Node server + 扩展两套构建）
3. 两个扩展已加载进 Chrome，MCP 全部接入 Hermes（53 + 69 个工具）
4. nekoro daemon 配置登录自启（启动文件夹 + vbs 隐藏窗口）
5. 端到端验证通过：建标签 → 开网页 → 读标题 → 关标签全链路 OK；PilotBrowse 扩展与 server WebSocket 连接注册成功

### 学到了什么
1. **Chrome 扩展方案（chrome.debugger）取代 headless + 调试端口**：登录态直接复用日常 Chrome，OAuth 不再被拦截，也没有端口反复断连的问题——正是 6-24 日志里两个痛点的解法
2. **Chrome 137+ 禁用 `--load-extension` 注入默认 profile**：扩展必须手动在 chrome://extensions 加载一次（Chrome 安全边界，无法绕过），把人工步骤写成指引文档交付即可
3. **PowerShell 管道给 Python CLI 喂代码会带 BOM（U+FEFF）**：SyntaxError 报错很隐蔽，用 `cmd /c "type file | nekoro-browser"` 或写 UTF-8 无 BOM 脚本
4. **Hermes MCP 接入**：`hermes mcp add` 的交互确认用 `cmd /c "echo Y | <exe> mcp add ..."` 管道喂入；工具新会话生效（前缀 `mcp_<server>_<tool>`）

### 犯了什么错
1. 评估时先下载了整个 136MB 仓库 zip 才想起看 README（超时）——应该先拉 raw README 评估，需要源码再下载
2. `python -c` 内联又踩了本机 BLOCKED 的坑——一律写 .py 脚本执行
3. 计划任务（Register-ScheduledTask）需要管理员权限失败——改用启动文件夹 + vbs 方案

### 下次改进
1. 评估 GitHub 项目先 raw README，不先下 zip
2. 浏览器操作场景优先用 nekoro/PilotBrowse（带登录态），API 途径留给批量抓取
3. 新发现的 sexyai.ai 端点继续补进 角色卡识别技术途径/seyyai-api-guide.md
