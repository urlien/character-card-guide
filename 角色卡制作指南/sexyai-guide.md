# AI魅魔岛（sexyai.ai）使用指南

## 网址

- 主站：https://www.sexyai.ai/
- 创作者中心：https://www.sexyai.ai/#/pages/creator/creator

## 登录方式

### Google OAuth 登录（推荐）
1. 访问 https://www.sexyai.ai/
2. 点击"我的" → "我已满18岁，开始登录吧！"
3. 选择"使用 Google 账号登录"
4. 在 Google 弹窗中完成认证
5. 登录成功后自动跳转

**注意**：Google OAuth 对自动化浏览器有检测，headless Chrome 会被拦截。推荐使用 `--auto-connect` 连接已登录的真实 Chrome。

### 通过 agent-browser 登录
```bash
# 1. 用调试端口启动 Chrome
Start-Process "chrome.exe" -ArgumentList "--remote-debugging-port=9222"

# 2. 手动在 Chrome 中完成 Google 登录

# 3. 连接已登录的 Chrome
npx agent-browser --auto-connect open "https://www.sexyai.ai/"

# 4. 保存登录状态
npx agent-browser --auto-connect state save "auth-states/sexyai.json"
```

## 创作者中心功能

### 查看我的角色卡
- 访问：https://www.sexyai.ai/#/pages/creator/creator
- 需要登录状态才能看到自己创建的角色卡
- 可以查看数据：对话数、游玩人数、收获电量、评分

### 编辑角色卡
- URL格式：`https://www.sexyai.ai/#/pages/role/create?id=<角色ID>`
- 只有作者本人可以编辑
- 支持实时预览和对话测试

### 角色卡页面
- 角色详情：`https://www.sexyai.ai/#/pages/role/index?roleId=<角色ID>`
- 聊天页面：`https://www.sexyai.ai/#/pages/chat/chat?roleId=<角色ID>`

## 角色卡数据

### 角色卡统计（截至2026-06-24）

| 角色 | ID | 对话数 | 游玩人数 | 收获电量 | 设定字数 |
|------|-----|--------|----------|----------|----------|
| 阿尔图罗 | 249119 | - | - | - | - |
| 薇薇安娜 | 232305 | 448.2K | 152 | 143.18K | 9633 |
| 白金 | 186722 | - | - | - | - |
| 拉芙希妮 | 238853 | 209.2K | 90 | 65.22K | 9940 |

## 注意事项

- 角色人设 + 世界书 Token 总预算 ≤ 15000 字符
- 公开角色卡字数要求 2000-5000 字
- 台词必须来自官方来源（萌娘百科/PRTS wiki），严禁编造
- 每日公开次数有限
