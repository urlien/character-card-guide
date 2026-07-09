# 角色卡识别技术途径

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
