---
name: sexyai-api
description: sexyai.ai API 认证与调用完整指南：获取 token、双重认证、已验证端点、角色卡数据结构
---

# SexyAI API 访问指南

## 认证方式

sexyai.ai 需要**双重认证**：Bearer Token + rptoken Cookie。

### 获取 Token

1. 打开 https://www.sexyai.ai 并登录
2. 按 F12 → 网络标签
3. 清空请求，点一下页面（如"最热"）
4. 找任意 POST 的 `/api/` 请求
5. 复制 Request Headers 中的 `Authorization` 值（Base64 格式）
6. 复制 Request Headers 中 `Cookie` 里的 `rptoken=eyJ...` 值

### 调用方式

所有请求都是 **POST**，需要：
- Header: `Authorization: Bearer <token>`
- Header: `Content-Type: application/json`
- Header: `lang: ZH`
- Cookie: `rptoken=<jwt_value>`
- Body: JSON

## PowerShell 调用模板

```powershell
$token = "你的Authorization值"
$rptoken = "Cookie里的rptoken值"

function Invoke-SexyAI($path, $body) {
    $handler = [System.Net.Http.HttpClientHandler]::new()
    $cc = [System.Net.CookieContainer]::new()
    $uri = [System.Uri]::new("https://www.sexyai.ai")
    $cc.Add($uri, [System.Net.Cookie]::new("rptoken", $rptoken))
    $handler.CookieContainer = $cc
    $client = [System.Net.Http.HttpClient]::new($handler)
    $client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Bearer", $token)
    $client.DefaultRequestHeaders.Add("lang", "ZH")
    $content = [System.Net.Http.StringContent]::new($body, [System.Text.Encoding]::UTF8, "application/json")
    $resp = $client.PostAsync("https://www.sexyai.ai$path", $content).Result
    $resp.Content.ReadAsStringAsync().Result
}
```

## 已验证的 API 端点

### 用户相关
| 端点 | Body | 说明 |
|------|------|------|
| `/api/user/info` | `{}` | 当前用户信息 |

### 角色卡管理（自己的卡）
| 端点 | Body | 说明 |
|------|------|------|
| `/api/role/customize/list` | `{"pageNo":1,"pageSize":10,"viewStatus":[1]}` | 已发布的卡（viewStatus=[0]是草稿） |
| `/api/role/query` | `{"id":卡ID}` | 查询任意卡详情（含人设全文） |

### 公开浏览
| 端点 | Body | 说明 |
|------|------|------|
| `/api/role/list/hot` | `{"pageNo":1,"pageSize":10}` | 热门卡 |
| `/api/role/list/recommend` | `{"pageNo":1,"pageSize":10}` | 推荐卡 |
| `/api/role/public/top` | `{}` | 公开置顶卡 |
| `/api/role/point/top` | `{}` | 积分排行 |
| `/api/role/list/fav` | `{"pageNo":1,"pageSize":10}` | 收藏列表 |

### 世界书
| 端点 | Body | 说明 |
|------|------|------|
| `/api/role/lorebooks/fetch` | `{"id":卡ID}` | 获取世界书 |
| `/api/role/lorebooks/entry/list` | `{"id":卡ID}` | 世界书条目列表 |
| `/api/role/lorebooks/info` | `{"id":卡ID}` | 世界书信息 |

### 评论
| 端点 | Body | 说明 |
|------|------|------|
| `/api/role/comment/page` | `{"id":卡ID,"pageNo":1,"pageSize":10}` | 卡片评论 |

### 其他
| 端点 | Body | 说明 |
|------|------|------|
| `/api/role/category/list` | `{}` | 分类列表 |
| `/api/role/category/list` | `{"id":分类ID}` | 分类详情 |
| `/api/conf/activity/category/list` | `{"id":0}` | 活动分类 |
| `/api/role/score/create` | `{"id":卡ID,"score":10}` | 评分 |
| `/api/role/like` | `{"id":卡ID}` | 点赞 |
| `/api/role/favourite` | `{"id":卡ID}` | 收藏 |
| `/api/user/search` | `{"keyword":"用户名"}` | 搜索用户 |
| `/api/role/topic/search` | `{"keyword":"关键词"}` | 搜索话题 |

## 角色卡数据结构

`/api/role/query` 返回的完整字段：
```
id, userId, name, nameEn, descEn, roleDesc,
avatar, imageUrl, beginning, beginningZh,
example, exampleZh, personality, personalityZh,
status, originType, sort, viewStatus, categoryId,
usageNum, authorName, scoreNum, score, playerNum,
personalityWordCount, categoryIds, statusbar, pageDepth
```

- `personality` / `personalityZh`: 角色人设全文（JSON格式，含外貌/性格/背景等）
- `beginning` / `beginningZh`: 开局场景全文
- `descEn`: 角色简介
- `statusbar`: 状态栏代码

## Token 过期处理

- rptoken 是 JWT，有有效期（约30天）
- 如果返回 401，需要重新登录获取新 token
- token 和 rptoken 都需要同时更新

## 注意事项

1. 所有请求必须用 POST 方法
2. `viewStatus` 参数是**数组**类型（如 `[1]`），不是单个数字
3. 频率限制：建议每次请求间隔 500ms
4. Token 是用户级别的，不同账号有不同权限
