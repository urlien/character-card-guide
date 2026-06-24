# 魅魔藏经阁技术知识库 (Knowledge Base)

> 来源：Discord「魅魔藏经阁」频道 458 篇帖子中精选 30+ 篇技术帖
> 整理时间：2025年6月
> 本知识库聚焦可操作的技术模式、代码范例和设计原则

---

## 目录

1. [状态栏 (Status Bar)](#1-状态栏-status-bar)
2. [正则 (Regex)](#2-正则-regex)
3. [全局美化 (Global Beautification)](#3-全局美化-global-beautification)
4. [世界书 (World Book / Lorebook)](#4-世界书-world-book--lorebook)
5. [侧边栏 (Sidebar)](#5-侧边栏-sidebar)
6. [写卡教程 (Card Writing Tutorials)](#6-写卡教程-card-writing-tutorials)
7. [编码系统 (Encoding Systems)](#7-编码系统-encoding-systems)
8. [监听器 (Listeners / Event Handlers)](#8-监听器-listeners--event-handlers)
9. [自动注入 (Auto-Injection)](#9-自动注入-auto-injection)
10. [开局 (Opening Scene)](#10-开局-opening-scene)
11. [图片插入 (Image Insertion)](#11-图片插入-image-insertion)
12. [容器层级与 z-index](#12-容器层级与-z-index)
13. [AI肘击技巧 (AI Elbow Techniques)](#13-ai肘击技巧-ai-elbow-techniques)
14. [常见坑与解决方案](#14-常见坑与解决方案)

---

## 1. 状态栏 (Status Bar)

### 1.1 新一代架构：Web Components + Shadow DOM

**核心贡献者**：GodCount（贪心鬼）、黑洞猫、𝓨𝓞𝓕𝓮𝓷𝓰

**关键原理**：
- 旧版状态栏使用 `img onerror` 触发渲染，新架构使用 **Web Components + Shadow DOM**
- Shadow DOM 实现**组件级隔离渲染**，避免"全局污染式渲染"
- 核心优势：样式隔离、性能优化、代码可维护性提升

**架构要点**：
```
状态栏标准 = Web Components + Shadow DOM + 模块化接口
```

**性能优化**：
- 使用 `@media` 查询区分手机端和桌面端，削减手机端动画质量
- 性能开销大头是 CSS 动画，Shadow DOM 本身开销很小
- `getPureTxt()` 逻辑大幅简化
- Shadow DOM 自带隔离，不需要复杂的逻辑来区分状态栏和正文

**代码模式**：
```html
<!-- Shadow DOM 组件式状态栏 -->
<z-live-widget id="status-bar">
  <!-- Shadow DOM 内部隔离渲染 -->
</z-live-widget>
```

**关键设计决策**：
1. 代码模块化 → 最终做成只暴露接口的样式
2. 高内聚、可移植 → 即插即用的独立组件
3. 状态栏数据格式简化为"标题：内容"格式
4. 每个状态栏数据之间必须换行

### 1.2 防截断方法

**核心原理**：让 AI 先输出状态栏，再输出正文，通过 JS 让状态栏物理沉底

**静态 HTML 状态栏防截断**：
```html
<img src="x" style="display:none" onerror="
(function(img){
  var box=img.closest('.你的外层容器类名');
  if(!box)return;
  if(box.parentNode) box.parentNode.appendChild(box);
  img.remove();
})(this)">
```

**自带解析引擎的状态栏防截断**：
在现有解析脚本中加入：
```javascript
if(box.parentNode) box.parentNode.appendChild(box);
```

**原理**：`appendChild` 作用于已存在的节点时，会自动把它拔出来强行塞到父元素的最后面，实现瞬间沉底。

**缺点**：有时状态栏内容和正文结束时不一定完全匹配。最佳方案是通过修改提示词降低正文字数+强调状态栏完整。

### 1.3 状态栏数据格式规范

**抓取式状态栏规则**（GodCount 版）：
- 使用起始/结束标识符包裹状态栏数据
- AI 在每次回复末尾生成状态栏数据块
- 正则从 AI 输出中抓取数据并渲染

**键值式格式**：
```
【#状态栏-角色名-开始#】
●时间：...
●地点：...
●好感度：...
【#状态栏-结束#】
```

**键值标记格式（<key#value>）**：
- 选择 `<key#value>` 的原因：魅魔岛的渲染会把 `<ababa>` 类被 `<>` 包裹的内容自动隐藏，所以 AI 生成错误内容时自动消失
- 实践中发现数据块太多、换行太多会导致"大鼓包"，可用隐藏代码包裹

**正则表达式**：
```
/【#状态栏-(.*?)-开始#】\s*([\s\S]*?)【#状态栏-结束#】/g
```

### 1.4 DeepSeek 稳定状态栏

DeepSeek 模型特别容易丢失状态栏内容，需要在提示词中反复强调状态栏完整性。建议：
- 状态栏放在正文之后生成（先正文后状态栏，再通过 JS 沉底）
- 使用更简单的键值格式
- 避免复杂的嵌套结构

### 1.5 多角色状态栏

多人状态栏需要在角色人设中定义每个角色的独立状态栏数据块，AI 在回复中为每个在场角色分别生成。使用不同的标识符区分：
```
【#状态栏-A-开始#】...【#状态栏-结束#】
【#状态栏-B-开始#】...【#状态栏-结束#】
```

### 1.6 状态栏组件构建器

社区已开发出可视化的状态栏构建工具（如呢银的可视化绘制网页），允许拖拽选择美化组件，降低门槛。

---

## 2. 正则 (Regex)

### 2.1 四步法正则格式

**核心贡献者**：ain（澄清）、柑硕、黑洞猫

**四步法**是一种比传统捕获式更稳定的正则格式，专门为魅魔岛平台适配：

**关键特性**：
- 不依赖传统捕获式
- 不突破魅魔每个正则捕获式的数量限制
- 炸了也不太看得出来（容错性好）
- AI 生成错误时内容自动消失

**使用方法**：
1. 下载四步法焚诀文档
2. 发给 AI（Claude 推荐，DeepSeek 也可以）
3. AI 根据文档生成符合格式的状态栏代码和正则
4. 将结果复制到魅魔平台

**避坑指南**：
- 规则 0 可能在 MMD 上不能用，删掉规则 0 改正第一句话可能成功
- JS 部分常见问题：使用 `innerHTML` 字符串拼接错误
- HTML 部分常见问题：最外层容器缺失、标签切换函数依赖全局变量
- 建议将 JS 和 HTML 部分分开问 AI 找错误

### 2.2 正则基础概念

**查找式（Search Pattern）**：
- `\` 转义：把特殊符号的特殊语义抹掉，当作普通文本
- `([\s\S]*?)` 代替 `(.*?)`：兼容换行情况，更稳定
- 如果正则剩余字数够多，建议全部用 `([\s\S]*?)`

**替换式（Replace）**：
- `$1`, `$2`... 对应查找式中的捕获组
- `<br>` 换行（不要用 `\n`）

**关键正则示例**：

状态栏正则：
```
查找：/【#状态栏-(.*?)-开始#】\s*([\s\S]*?)【#状态栏-结束#】/g
替换：<div class="teapot-status-panel">...$2...</div>
```

图片插入正则：
```
查找：/【randimg】([\s\S]*?)【\/randimg】/s
替换：<div><img src="$1" /></div>
```

### 2.3 正则自动化工具

**chahu（茶壶）** 开发了正则自动化工具：
- 包含电脑版、手机版和视频教程
- 会说话就能用
- 可通过快捷指令突破输入框字数限制

### 2.4 正则数量限制

- 魅魔平台正则字符上限已更新至 **20000 字符**
- 仍需注意每个正则的捕获组数量限制
- HTML 过长时分开放正则，拼接即可

### 2.5 Gemini 正则兼容性问题

Gemini 模型在使用正则括号内可能会出现莫名横杆 `-` 或其他符号，导致匹配失败。解决方案：
- 在正则外部用 `/` 把要查找内容框起来，最后补 `/s`
- 但牢魅平台默认已加上全局替换

### 2.6 正则按钮双引号失效

正则按钮中的双引号可能被平台转义，导致功能失效。处理办法：
- 使用单引号代替
- 或使用 HTML 实体 `&quot;`

---

## 3. 全局美化 (Global Beautification)

### 3.1 美化规则直接生成法

**核心原理**：在角色设定中直接写入美化规则，AI 在对话中自动生成美化后的界面。

**要点**：
1. 需要搭配配套提示（如"任务栏界面需按照<美化规则>进行美化输出"）
2. 光放美化规则不会有用，必须告诉 AI 在什么地方运用
3. Gemini 2.5 Pro 45 电也能生成精美美化效果

**示例**：
```
任务栏美化：任务栏界面需按照<美化规则>进行美化输出。
```

### 3.2 全局美化切换

**按钮式切换美化开关**：
- 使用 `<style>` 标签配合 `id` 控制
- 通过 JS 切换 `disabled` 属性
- 按钮可跟随全局美化一起改变颜色

**取消美化按钮**：
- 通用取消美化按钮，无需跑 AI
- 直接操作 `document.querySelector('style')` 的 `disabled` 属性

### 3.3 美化 CSS 结构

**气泡样式**：
```css
/* AI 气泡 */
.message-content { ... }
/* 用户气泡 */
.user-message { ... }
```

**常用美化元素**：
- 顶部栏 / AI气泡 / 用户气泡 / 输入框 / 底部栏
- 弹窗 / 选项 / 字体大小 / 行距

### 3.4 多主题系统

- 内置多套不同风格的完整美化主题
- 通过侧边按钮循环切换
- 支持一键开启/关闭美化效果

### 3.5 字体引入

可以通过 CSS `@font-face` 引入自定义字体，或使用 Google Fonts CDN。

---

## 4. 世界书 (World Book / Lorebook)

### 4.1 五个插入位置详解

**天台帮（焊在聊天记录最顶部）**：

| 位置 | 比喻 | 权重 | 适用场景 |
|------|------|------|----------|
| 角色人设前 | 写在角色设定扉页之前 | 中 | 世界观底层规则 |
| 角色人设后 | 紧贴在角色设定后面的附录 | **最高** | 绝大多数角色条目 |

**电梯帮（混入聊天记录中间）**：

| 位置 | 比喻 | 权重 | 适用场景 |
|------|------|------|----------|
| system | 导演悄悄话 | **极高** | AI 行为限制、场景规则 |
| user | 伪造的你说过的话 | 中高 | 暗示剧情发展 |
| assistant | 伪造的 AI 说过的话 | 低 | 补充背景知识 |

### 4.2 位置选择指南

- **大世界规则背景** → 用"角色人设前"
- **小场景设定**（如便利店）→ 用 system
- **角色核心设定** → 用"角色人设后"
- **暗示 AI 当前发生了什么** → 用 user
- **补充背景知识** → 用 assistant

### 4.3 深度选项

- 选 system/user/assistant 时有深度选项
- 深度数字越小，插入位置越靠前（越靠近最新对话），AI 印象越深
- **一般建议设 4-6**

### 4.4 世界书与正则的关系

- 世界书的触发关键词必须与 AI 输出中的内容匹配
- 世界书不会直接改变页面显示，只影响 AI 生成内容
- 状态栏数据如果触发了世界书，可能导致 AI 额外生成不需要的内容

### 4.5 世界书注意事项

- API 中角色人设和世界书只能是 user role，选什么位置不改变消息类型
- 但 MMD 平台会根据位置包装成不同格式（如 system 位置外面包一层"系统指令"标记）
- 模型训练数据里习惯了优先遵从 system 格式，所以效果上选 system 更听话

---

## 5. 侧边栏 (Sidebar)

### 5.1 防覆盖方法：加载错误图片法

**核心原理**：利用 `img onerror` 事件触发 JS 代码，将侧边栏挂载到页面 body 下，避免被聊天容器遮挡。

**基础代码**：
```html
<img src="x" style="display:none;" onerror="
(function(){
  var panel = document.getElementById('你的侧边栏ID');
  if(panel) document.body.appendChild(panel);
  this.remove();
})()">
```

**防残留版本**（带检测退出）：
```html
<span id="A-1" style="display:none"></span>
<img src="x" style="display:none" onerror="
var p=document.getElementById('侧边栏id'),
    a=document.getElementById('A_1');
if(p) document.body.appendChild(p);
var t=setInterval(function(){
  if(!document.body.contains(a)){
    if(p) p.remove();
    clearInterval(t);
  }
},500)">
```

### 5.2 onclick 事件法（更新推荐）

**比 onerror 更稳定**，直接使用点击事件：
```html
<div class="xb" id="xb-btn" onclick="
event.stopPropagation();
document.getElementById('xc-modal').classList.add('active');
const e=document.getElementById('xa-ui');
if(e && e.parentNode!==document.body){
  document.body.appendChild(e);
}">指南</div>
```

**交互流程**：
1. 点击按钮 → 从隐藏模板中复制侧边栏内容副本
2. 将副本插入到 `document.body` 并显示
3. 关闭时移除副本 → 防止带出卡或重复生成

### 5.3 搬运到容器法

**右侧容器**：
```html
<img src="x" style="display:none" onerror="
var target = document.querySelector('.mm-right-side-container');
var cargo = document.querySelector('.你的类名');
if(target && cargo) target.appendChild(cargo);">
```

**左侧容器**：
```html
<img src="x" style="display:none" onerror="
var target = document.querySelector('.mm-left-side-container');
var cargo = document.querySelector('.你的类名');
if(target && cargo) target.appendChild(cargo);">
```

### 5.4 功能栏

魅魔平台新增了功能栏（默认最高层级），侧边栏可直接放入功能栏，不再需要手动处理层级问题。

### 5.5 基础侧边栏正则代码

**写在"第一句话"里**：
```
查找：《侧边栏》
替换为：(完整的 HTML+CSS 代码)
```

按钮示例（带 onclick 事件，将指令填入输入框）：
```html
<div class="right-fixed-btns">
  <button class="fixed-btn" onclick="
    event.stopPropagation(),
    (t=document.querySelector('textarea')).value='指令内容',
    t.dispatchEvent(new Event('input'))
  ">按钮文字</button>
</div>
```

### 5.6 搜索和筛选功能

通过 JS 实现侧边栏内的搜索筛选：
- 监听输入框变化
- 遍历列表元素
- 根据关键词过滤显示

---

## 6. 写卡教程 (Card Writing Tutorials)

### 6.1 角色人设结构

**推荐分层结构**：
1. **第一句话**：初始场景描述 + 第一句话
2. **角色人设**：角色核心设定
3. **美化规则**：状态栏/侧边栏/全局美化代码
4. **图片输出协议**：随机配图等

### 6.2 折叠状态栏

```html
<div class="u" onclick="event.stopPropagation();this.classList.toggle('active');this.nextElementSibling.style.display = getComputedStyle(this.nextElementSibling).display === 'none' ? 'block' : 'none'" style="margin-bottom: 5px; cursor: pointer;">
⊳ 点击展开/折叠状态栏
</div>
<div class="t" style="display:none;">
【此处放状态栏正文】
</div>
```

### 6.3 避免小说化

- 角色人设不要写成小说
- 用关键词、标签式描述
- 分层次：核心性格 → 次要特征 → 行为模式
- 每个特征用简洁的关键词表述

### 6.4 字数优化

- 设定区标点空格也算字数
- 编码系统可以极大节省字数（60位编码 = 3万字描述）
- 使用编码时，AI 可以根据编码自动展开详细描述

### 6.5 常用提示词模板

**通用总结按钮**：
```
请你结合旧的总结内容，并在此基础上回顾现有剧情，总结目前为止我接触到的所有事件和设定，例如事件时间线、主要角色等。不要提及任何我尚未接触到的事件或设定。
```

**通用游玩按钮**：
```
请你根据作者设定并结合过往剧情描述场景和对话场景，但不要创建我的台词，优先保证状态栏完整并输出不少于1500汉字...
```

### 6.6 卡片评价标准

好的角色卡应具备：
- 角色有鲜明独特的性格
- 状态栏稳定不丢失
- 正文不截断
- 美化效果正常显示
- 世界书触发合理

---

## 7. 编码系统 (Encoding Systems)

### 7.1 编码系统概述

**首创**：柑硕；**详解**：七叶斋

编码系统用数字/字母代码压缩角色的全部信息，AI 根据编码自动展开成详细描述。

### 7.2 编码结构（60位）

```
年龄+性别+原生种族+亚人化特征+异化程度+发育阶段+身高+体脂率+
身体局部特征+肌肉特征+脸型+眉型+嘴型+前发发型+后发发型+发色+
瞳色+特殊面部特征+胡须+罩杯+肤色+常穿上装+常穿下装+常穿袜子+
常穿鞋子+美甲+额外配饰+职业+社会地位+特殊身份+外在性格+
内在性格+特殊性格+外貌评价+角色标签+世界观文化背景+所属势力+
战斗力+常用武器+与玩家亲缘关系+与玩家社会关系+与玩家特殊关系+
与玩家好感关系+性取向+乳头形状+乳晕大小+乳头乳晕颜色+阴毛分布+
私处外观形状+私处内部结构+体液量+特殊性器+敏感带+特殊敏感带+
喜爱玩法+可接受重口玩法+性经验+性知识+特殊状态+人物命运路线
```

### 7.3 编码格式

```
角色名[1,2,2,1,1,3,120c,25,2｜7｜27,1,1,5,1,3,9,7,8,25,1,10,1,26,26,...]
```

- 字段用逗号分隔
- 可复数选择的字段用 `｜` 隔开
- 同一字段中内容不可互相矛盾

### 7.4 图片编码系统

用于高效管理大量图片：
```
地点：Q~泳池；R~地铁
图片类型：A~自拍；B~他拍
角色：D~角色1；E~角色2
事件：F~事前；G~性交

示例：UBEFO = 他拍 + 角色2 + 催眠状态 + 侵犯
```

**使用方法**：
1. 为每个特征编码
2. 图片文件名改为对应编码
3. 上传图床获得链接
4. 在人设中注明编码含义
5. 只需一条正则即可管理所有图片

---

## 8. 监听器 (Listeners / Event Handlers)

### 8.1 核心原理

监听器可以监测页面变化并自动触发代码执行。

**GodCount 监听器特点**：
- 使用 `MutationObserver` 监听 DOM 变动
- 有三重时间锁防止误触发：
  1. **开屏锁**：防止进页面时误触发
  2. **5分钟锁**：防止向上滑动导致刷新触发
  3. **8秒锁**：防止无限触发卡死

### 8.2 MutationObserver 模式

```javascript
// 监听 DOM 变动
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // 检测到变化时执行逻辑
    });
});
observer.observe(targetNode, { childList: true, subtree: true });
```

### 8.3 监听器使用场景

1. **状态栏自动更新**：检测 AI 回复变化，自动渲染状态栏
2. **自动总结**：AI 每轮总结后注入到历史对话
3. **全局美化**：检测页面变化自动应用美化
4. **侧边栏自动注入**：检测特定关键词自动展示内容

### 8.4 雷达法（Sentinel Radar）

**黑洞猫**提出的全局哨兵雷达法：
- 维护一个 UI 状态栏的稳定
- 使用 `MutationObserver` + 全局变量防抖注入
- 不修改页面原生数据，只在视觉层面操作
- 使用 `document.createElement` 在内存中生成 DOM 树，组装后挂载

**与直接替换文本的区别**：
- 直接替换：`innerHTML` 正则替换后写回 → 永久改变聊天记录
- 雷达法：独立 DOM 树 → 底层数据流保持原始文本

---

## 9. 自动注入 (Auto-Injection)

### 9.1 自动注入关键词侧边栏

**原理**：在角色人设中定义关键词触发规则，当 AI 输出包含特定关键词时，侧边栏自动展示对应内容。

**实现方式**：
1. 在侧边栏中预设所有可能的内容
2. 默认全部隐藏
3. 通过 JS 检测 AI 回复内容
4. 匹配关键词后显示对应部分

### 9.2 自动注入用于自动指令

```html
<!-- 自动注入示例 -->
<img src="x" style="display:none" onerror="
var msgs = document.querySelectorAll('.message-content');
var lastMsg = msgs[msgs.length-1].textContent;
if(lastMsg.includes('关键词')) {
    // 执行对应操作
}
">
```

### 9.3 自动运行代码

**sRay 方法**：
- 利用 `img onerror` 在 AI 生成完毕时自动运行代码
- 执行顺序：文本生成完毕 → 正则加载 → 图片加载
- 图片加载触发时，文本和正则已全部完成

**防误触发**：
```html
<img src="x" class="类名" onerror="
var allimg = document.querySelectorAll('.类名');
if(this === allimg[allimg.length - 1]){
    // 只运行最后一个图片的代码
}
">
```

---

## 10. 开局 (Opening Scene)

### 10.1 开局面板设计

**卡牌手牌扇面展开**：使用 CSS transform 实现卡牌扇形展开动画

**翻页文框自定义编辑器**：用户可在开局时自定义角色信息

### 10.2 开局代码模式

**填表式开局**：
```html
<div class="character-creator">
  <input type="text" placeholder="角色名" id="char-name">
  <input type="number" placeholder="年龄" id="char-age">
  <button onclick="startGame()">开始游戏</button>
</div>
```

**塔罗牌抽卡开局**：随机抽取塔罗牌决定初始属性

### 10.3 开局工具

- 新手导览编辑器
- 自定义开局面板生成器
- 可填名字年龄并预览聊天框的开局工具

### 10.4 极简模拟器开局

适合世界模拟器类型的卡，开局提供简单的数值面板和初始状态。

---

## 11. 图片插入 (Image Insertion)

### 11.1 随机配图法

**在角色人设中定义**：
```
【自然语言指令集-随机配图】
你每次回复时,请从以下图片链接列表中随机选择一个,
然后在正文结束后立即输出图片标记。
图片链接列表如下:
链接1
链接2
输出格式为:
【randimg】你选中的链接【/randimg】
【/自然语言指令集-随机配图】
```

**正则**：
```
查找：/【randimg】([\s\S]*?)【\/randimg】/s
替换：<div><img src="$1" style="max-width:100%;" /></div>
```

### 11.2 编码式图片管理

使用编码系统管理大量图片，只需一条正则即可动态切换图片。

### 11.3 图床选择

- **免费**：jsdelivr CDN（GitHub 图床）
- **自建**：可搭建私人图床
- 格式推荐：webp（体积小、兼容好）

### 11.4 对话框内图片

在对话框中显示图片，需要用正则将文本标记替换为 `<img>` 标签。

---

## 12. 容器层级与 z-index

### 12.1 核心问题

魅魔平台的聊天容器有较高的 z-index，自定义的侧边栏/弹窗容易被遮挡。

### 12.2 解决方案

1. **加载错误图片法**：将元素挂载到 `document.body`
2. **onclick 事件法**：点击时临时挂载到 body，关闭时移除
3. **容器搬运法**：使用平台提供的 `.mm-right-side-container` / `.mm-left-side-container`
4. **功能栏**：直接使用平台功能栏（默认最高层级）

### 12.3 定位建议

- 侧边栏按钮使用 `position: fixed`
- z-index 设为 `9999` 或更高
- 使用 `writing-mode: vertical-rl` 实现竖排文字

---

## 13. AI肘击技巧 (AI Elbow Techniques)

### 13.1 选择正确的 AI 模型

| 模型 | 代码能力 | 推荐用途 |
|------|----------|----------|
| Claude (Opus/Sonnet) | ⭐⭐⭐⭐⭐ | 状态栏代码、正则生成 |
| DeepSeek (4.0/4p) | ⭐⭐⭐ | 状态栏较不稳定，需要更多强调 |
| Gemini 2.5 Pro | ⭐⭐⭐ | 可用，但正则可能出符号问题 |
| Grok | ⭐⭐ | 代码能力较弱 |
| 豆包 | ⭐⭐ | 代码确实不行 |

### 13.2 肘击 AI 的方法

1. **提供参考文档**：把四步法焚诀或 Shadow DOM 文档发给 AI
2. **分步肘击**：先生成 HTML，再生成 CSS，最后生成 JS
3. **报错截图**：截图报错信息给 AI 解决
4. **拆开问**：JS 部分和 HTML 部分分开问
5. **让 AI 总结错误**：肘击成功后让 AI 记录错误和解决方式

### 13.3 常见 AI 降智表现

- AI 把 `<ztl>` 等自定义标签弄混
- AI 自作主张把分隔符替换成 `<br>`
- AI 给你生成一个 `<xx>` 之类的无效标签
- AI 生成的代码使用 `innerHTML` 字符串拼接出错

### 13.4 模块化思维

将代码拆分为独立模块：
- HTML 结构模块
- CSS 样式模块  
- JS 功能模块
- 正则替换模块

每个模块独立测试，成功后再组合。

---

## 14. 常见坑与解决方案

### 14.1 状态栏不显示

**可能原因**：
- 正则没有正确配置
- AI 没有按格式生成状态栏数据
- onerror 事件未触发

**解决方案**：
- 检查正则表达式是否正确
- 在设定中反复强调状态栏格式
- 使用 Shadow DOM 架构

### 14.2 状态栏内容被截断

**原因**：AI 输出长度达到上限

**解决方案**：
- 降低正文字数要求
- 使用防截断沉底法
- 简化状态栏数据格式

### 14.3 侧边栏被聊天框遮挡

**解决方案**：
- 使用加载错误图片法挂载到 body
- 使用平台功能栏
- 使用容器搬运法

### 14.4 LocalStorage 无效

6.15 更新后 LocalStorage 可能失效，需要使用新的存储方式。

### 14.5 AI 无法正确识别 char/user 变量

确保在设定中正确使用 `{{char}}` 和 `{{user}}`，并让 AI 理解这两个变量的含义。

### 14.6 onerror 被禁用的风险

- 平台可能限制 onerror 事件
- 备选方案：使用 `onload` 事件（配合隐藏的 SVG 图片）
- 更稳定的方案：直接使用 onclick 事件

### 14.7 正则匹配不到内容

- AI 输出的格式与正则不匹配
- AI 可能用 `§` 代替了 `●`
- 解决：在设定中强调必须使用的符号，并在正则中包含容错

### 14.8 状态栏和选项冲突

状态栏沉底后可能跑到选项下面：
- 将状态栏和选项设计为一体
- 或为选项也添加沉底逻辑

---

## 附录：关键资源索引

| 资源 | 说明 |
|------|------|
| 四步法焚诀 (KVV4.0) | ain（澄清）的正则格式规范 |
| Shadow DOM 状态栏文档 | GodCount 的新标准架构 |
| 茶壶技术工具卡 | chahu 的正则自动化工具 |
| 月月百宝箱系列 | 侧边栏地图、色色特化侧边栏 |
| 编码系统详解 | 七叶斋的 60 位编码规范 |
| 基础侧边栏正则代码 | 逆蝶的复制即用模板 |
| 写卡经验交流 | 徐秋的飞书文档 |
| 世界书指南 | 黑白琴键的五位置详解 |
| Agentic 记忆系统 | 向量模型+LRAG 的记忆方案 |
| MVU 变量系统 | 酒馆同款变量系统实现 |
