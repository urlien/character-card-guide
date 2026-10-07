# 角色卡识别技术途径

> ## 🆕 2026-08-10 更新：浏览器工具已就位，不再只有 API 一条路
>
> 本机（Windows 11）已装好两个浏览器自动化工具并接入 Hermes MCP：
>
> | 工具 | 方式 | 特点 |
> |------|------|------|
> | **nekoro-browser** v0.2.0 | Chrome 扩展驱动日常 Chrome | 保留登录态，OAuth 不再被拦截，53 个 MCP 工具 |
> | **PilotBrowseMCP** | Chrome 扩展 + Node server | 网络抓包 / JS 逆向 / SQLi 检测，69 个 MCP 工具 |
>
> 现在 Hermes 可以**直接打开浏览器访问 sexyai.ai**（复用你日常 Chrome 的登录态），
> 此前"无法打开浏览器、只能靠 API 看网站"的限制已解除。
> 两条路互补：**批量抓数据用 API（本文档），页面交互/发卡改卡用浏览器**。

本目录收录 AI 角色卡平台（sexyai.ai / 魅魔岛）的 API 接入与技术文档。

> **给 MiMo Claw 的说明：** 你无法直接打开浏览器访问 sexyai.ai，但可以通过 API "看到"网站上的所有内容。下面是完整操作流程。

## 📁 文件说明

| 文件 | 内容 |
|------|------|
| [api-config.json](api-config.json) | 🔑 API 认证配置（token、rptoken、调用示例） |
| [sexyai-api-guide.md](sexyai-api-guide.md) | 📖 API 完整调用指南：端点列表、数据结构、代码模板 |

## 🚀 MiMo Claw 操作流程

### 第一步：读取配置

```
读取本目录下的 api-config.json，获取：
- authorization: Bearer token
- rptoken: JWT cookie
- base_url: https://www.sexyai.ai
```

### 第二步：调用 API

所有请求都是 **POST**，需要同时带上 token 和 rptoken：

```python
import requests

# 从 api-config.json 读取
TOKEN = "Bearer <authorization值>"
RPTOKEN = "<rptoken值>"

headers = {"Authorization": TOKEN, "Content-Type": "application/json", "lang": "ZH"}
cookies = {"rptoken": RPTOKEN}
base = "https://www.sexyai.ai"
```

### 第三步：用 API "看到"网站内容

| 你想看什么 | 怎么调用 |
|-----------|---------|
| **自己的角色卡列表** | `POST /api/role/customize/list` body: `{"pageNo":1,"pageSize":10,"viewStatus":[1]}` |
| **某张卡的完整人设** | `POST /api/role/query` body: `{"id":卡ID}` |
| **某张卡的世界书** | `POST /api/role/lorebooks/fetch` body: `{"id":卡ID}` |
| **某张卡的评论** | `POST /api/role/comment/page` body: `{"id":卡ID,"pageNo":1,"pageSize":10}` |
| **用户信息** | `POST /api/user/info` body: `{}` |
| **热门卡** | `POST /api/role/list/hot` body: `{"pageNo":1,"pageSize":10}` |

### 第四步：理解返回数据

`/api/role/query` 返回的角色卡包含所有字段：

| 字段 | 说明 | 举例 |
|------|------|------|
| `name` | 角色昵称 | "蕾缪安" |
| `roleDesc` | 角色描述/简介 | 一段文字 |
| `personality` | 角色人设（JSON字符串） | 包含外貌、性格、人际关系、台词等 |
| `beginning` | 第一句话/开场白 | 长文本，末尾含状态栏模板 |
| `statusbar` | 状态栏配置 + 正则 + 功能标记 | 模块声明 + 正则表达式 |
| `regex_scripts[]` | 各功能模块的完整 HTML/CSS/JS | 数组，每个元素含 findRegex + replaceString |
| `example` | 消息示例/台词 | 角色对话示例 |
| `prologue` | 开场白/欢迎语 | 数组 |
| `backgroundUrl` | 背景图 URL | 图片链接 |
| `topics` | 标签 | 话题数组 |
| `categoryIds` | 分类 ID | 数组 |

### 第五步：理解状态栏三件套

角色卡的状态栏由三部分组成：

1. **文本** — AI 每次回复末尾输出的 `【状态栏开始】...键值对...【状态栏结束】`
2. **正则** — 从 AI 输出中捕获数据的正则表达式
3. **替换模板** — HTML/CSS/JS 代码，用 `$1~$N` 占位符渲染可视化面板

`regex_scripts[]` 数组中的每个元素：
```json
{
  "findRegex": "触发标记",
  "scriptName": "模块名称", 
  "replaceString": "<style>...</style><div>...</div><script>...</script>"
}
```

## ⚠️ 注意事项

1. **Token 过期判断**：如果 API 返回 `{"code":401}`，说明 token 过期，需要重新获取
2. **所有请求必须用 POST 方法**
3. **`viewStatus` 参数是数组类型**（如 `[1]`），不是单个数字
4. **Token 和 rptoken 需要同时提供**
5. **建议请求间隔 500ms 以上**
6. **rptoken 是 JWT**，`exp` 字段为过期时间戳

## 📋 常见操作速查

```
# 查看某张卡的完整人设
POST /api/role/query  body: {"id":144742}

# 查看自己的所有卡
POST /api/role/customize/list  body: {"pageNo":1,"pageSize":50,"viewStatus":[1]}

# 查看某张卡的世界书
POST /api/role/lorebooks/fetch  body: {"id":144742}

# 查看某张卡的正则和状态栏
POST /api/role/query  body: {"id":144742}
→ 看返回数据中的 statusbar 和 regex_scripts 字段
```

## 🆕 浏览器直连途径（2026-08-10 新增）

Hermes 新会话中可直接用浏览器工具操作 sexyai.ai（登录态 = 你日常 Chrome 的登录态）：

| 需求 | 工具（前缀 mcp_） | 示例 |
|------|------|------|
| 打开/登录网站 | `mcp_nekoro_browser_new_tab` / `navigate` | 直接访问 https://www.sexyai.ai |
| 页面点击/填表 | `mcp_nekoro_browser_click` / `fill_input` | 点「创作」、填卡名 |
| 看页面/截图 | `mcp_nekoro_browser_capture_screenshot` / `page_info` | 确认渲染效果 |
| 抓接口数据 | `mcp_pilot_browse_browser_network_search` / `browser_network_analyze` | 监控页面请求、分析 API 结构 |
| 批量抓卡 | `mcp_pilot_browse_browser_save_content` / `browser_get_markdown` | 整页转 Markdown 存盘（省 token） |

> 与 API 途径配合：页面新功能先在浏览器里看请求（network 工具），发现新端点后补进
> [seyyai-api-guide.md](seyyai-api-guide.md)，下次直接 API 批量调用。
