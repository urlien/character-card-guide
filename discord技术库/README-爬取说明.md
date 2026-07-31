# Discord 技术帖爬取说明

## 背景

本目录包含从 Discord「魅魔藏经阁」服务器爬取的技术帖。

- 服务器ID：`1205870897769095229`
- 频道ID：`1261224189931556865`（论坛频道）
- 上次爬取：2026-06-24（466篇帖子）

## 爬取脚本

`scrape_new_threads.py` — 自动爬取新帖子并保存为 Markdown。

### 前置条件

1. Python 3.8+
2. `pip install requests`
3. 有效的 Discord 用户 token

### 使用方法

```bash
cd character-card-guide/discord技术库
python scrape_new_threads.py
```

### 脚本功能

1. 获取论坛频道的活跃+归档帖子列表
2. 筛选出上次爬取后的新帖子
3. 爬取每个帖子的全部消息（分页获取）
4. 保存为 Markdown 文件（格式与现有帖子一致）
5. 更新 `thread-list.json` 索引

### Token 获取方法

1. 打开 Discord 网页版（discord.com）
2. 按 F12 打开开发者工具
3. 切换到 Network 标签
4. 随便点一个请求，查看 Request Headers 中的 `authorization` 字段
5. 复制整个 token 值

⚠️ **Token 是你的登录凭证，不要泄露给任何人！**

### 代理配置

如果在国内，需要配置代理。脚本默认使用 `http://127.0.0.1:7897`（Clash Verge）。

修改脚本中的 `PROXY` 变量即可。

### 输出

- 新帖子保存为 `帖子名.md`
- `thread-list.json` 更新为最新索引

## 文件格式

每个帖子一个 Markdown 文件，格式：

```markdown
# 帖子标题

创建时间: 2026-07-XX
消息数: XX

---

**作者** (2026-07-XX HH:MM:SS):
消息内容

**作者** (2026-07-XX HH:MM:SS):
消息内容
```

## 注意事项

- Discord API 有限速，脚本已内置延迟（每条消息间隔0.5秒，每个帖子间隔1秒）
- 大型帖子（100+消息）会自动分页获取
- 文件名自动清理特殊字符，最长200字符
- Token 脚本内嵌，运行完后建议删除或改用环境变量
