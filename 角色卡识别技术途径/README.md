# 角色卡识别技术途径

本目录收录 AI 角色卡平台（sexyai.ai / 魅魔岛）的 API 接入与技术文档。

## 📁 文件说明

| 文件 | 内容 |
|------|------|
| [sexyai-api-guide.md](sexyai-api-guide.md) | sexyai.ai API 完整调用指南：认证方式、端点列表、数据结构、PowerShell 模板 |

## 🔑 快速开始

### 1. 获取 Token

1. 打开 https://www.sexyai.ai 并登录
2. 按 `F12` → 网络标签
3. 清空请求，点一下页面（如"最热"）
4. 找任意 **POST** 的 `/api/` 请求
5. 复制 `Authorization` 值 + `Cookie` 中的 `rptoken`

### 2. 调用 API

```powershell
# 所有请求都是 POST + 双重认证
$headers = @{
    Authorization = "Bearer <你的token>"
    "Content-Type" = "application/json"
    lang = "ZH"
}
$cookie = "rptoken=<你的jwt>"
$body = '{"pageNo":1,"pageSize":5,"viewStatus":[1]}'
Invoke-RestMethod -Uri "https://www.sexyai.ai/api/role/customize/list" -Method POST -Headers $headers -Body $body
```

### 3. 已验证端点

| 端点 | 功能 |
|------|------|
| `/api/user/info` | 用户信息 |
| `/api/role/customize/list` | 自己的卡（含草稿） |
| `/api/role/query` | 任意卡详情（含人设全文） |
| `/api/role/list/hot` | 热门卡 |
| `/api/role/list/recommend` | 推荐卡 |
| `/api/role/lorebooks/fetch` | 世界书 |
| `/api/role/comment/page` | 卡片评论 |

## ⚠️ 注意事项

- 所有请求必须用 **POST** 方法
- `viewStatus` 参数是**数组**类型（如 `[1]`）
- Token 和 rptoken 需要**同时提供**
- rptoken 是 JWT，有效期约 30 天
- 建议请求间隔 500ms 以上
