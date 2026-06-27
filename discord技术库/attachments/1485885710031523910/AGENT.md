# AGENT.md

## 目标

在平台原生网页中实现“界面注入 + 回复投放”能力。

本平台类似 Silly Tavern，平台本身已经提供网页结构、消息流和基础交互。agent 的任务不是重做整页网页，而是基于平台现有页面，按统一运行模型接入任意定制 UI，并把 AI 回复稳定投放到该 UI 中。

agent 的任务不是只做某一种界面，而是复用同一套运行模型，完成任意定制 UI 的接入。典型场景包括：

- 对话界面
- 状态栏
- 地图界面
- 日志面板
- 卡片列表
- 任务面板

核心原则：

1. 先放界面结构
2. 启动代码只初始化一次
3. 每次回复代码按标准执行链运行
4. 优先读取当前回复的同级中间态
5. 必须拆分为独立文件维护
6. 初始化代码和回复代码分开维护，不混写
7. 运行触发以多个 img 为基础：一个初始化 img，多个回复 img

---

## 规范优先级

执行时以本文件为准。

如果其它文档、历史方案或旧模板与本文件冲突，应优先遵守本文件中的运行模型、拆分方式和触发规则。

---

## 运行模型

整套实现固定拆成五类文件：

1. 界面文件
2. CSS 文件
3. 初始化代码文件
4. 回复代码文件
5. 中间态正则列表文件

### 1. 界面文件

负责长期存在的 DOM 结构，只负责显示内容。

### 2. CSS 文件

负责界面样式，不负责数据逻辑。

### 3. 初始化代码文件

只在页面打开时运行一次。

由初始化 img 触发，触发完成后可移除该 img。

### 4. 回复代码文件

在每条回复对应的回复 img 加载时运行。

页面打开时，历史回复对应的多个回复 img 可能会同时加载；此时必须限制只有最新那个回复 img 真正执行“最新实例主执行段”。

当新的 AI 回复生成完成，且平台已经完成该条回复的中间态正则替换后，新回复对应的回复 img 才会加载。

### 5. 中间态正则列表文件

只负责“正则式 + 替换内容”，不要把运行逻辑塞进正则列表说明中。

---

## 三层职责

整套逻辑可理解为三层职责：

### A. 核心界面

核心界面是页面中长期存在的 DOM 结构，负责显示内容。

建议至少包含：

- 外层容器
- 展示区
- 控制区
- 隐藏状态区

外层容器负责：

- 显示 / 隐藏
- 定位
- 层级
- 与原页面共存
- 阻止事件冒泡干扰原页面交互

隐藏状态区负责：

- 保存已迁移的数据
- 供翻页、切换、展开等逻辑读取

### B. 启动初始化代码

启动代码只在页面打开时运行一次。

适合放在启动代码里的内容：

- 页面定位
- 全局变量初始化
- 全局控制对象初始化
- 设置项读取与回填
- 初始化完成标记
- 缓存对象、定时器引用、运行锁初始化

不应在启动代码里写某一条回复的具体业务数据。

### C. 每次回复运行代码

回复代码在每次回复 img 触发时运行。

固定执行链采用六步结构（部分步骤可按需省略）：

1. 固定引用段（Self Capture）：固定 `self = this`
2. 初始化依赖协商段（Initialization Dependency Gate，可选）：仅在依赖初始化能力时等待
3. 当前回复自处理段（Reply-Scoped Process，可选）：各实例处理自身 `closest('.content.left')`
4. 最新回复仲裁段（Latest-Reply Arbitration，可选）：需要“最新实例逻辑”时执行仲裁
5. 最新回复处理段（Latest-Only Main Stage，可选）：仅最新实例执行全局单例视图处理
6. 结束自删段（Final Self Cleanup）：执行完当前脚本涉及逻辑后直接自删

---

## 界面架构分类（内容升级）

为避免职责混乱，界面分为两类：

### 1. 全局单例视图（Global Singleton View）

- 页面级唯一
- 跨回复复用
- 通常不随每条回复重复创建
- 常见于地图、侧边栏、弹窗、图鉴、全局面板、总控浮层

### 2. 回复级重复视图（Reply-Scoped Repeated View）

- 每条回复可有独立实例
- 数据来源是当前回复同级中间态
- 不应依赖“最新实例主执行段”才能显示
- 常见于状态栏块、选项块、日志块

两类可并存，但职责不能交叉。

---

## 触发机制

### 1. 初始化 img

初始化代码由隐藏图片的 `onerror` 触发。

要求：

- 页面打开时运行一次
- 只负责一次性初始化
- 运行完成后应移除自身节点
- 不处理某一条具体回复的数据

### 2. 回复 img

回复代码由回复区域中的回复 img 触发。

要求：

- 每条回复都拥有唯一自己的回复 img
- 历史回复在页面打开时可能同时触发
- 新生成回复会在该条回复完成生成且中间态替换完成后触发
- 回复代码按“六步执行链”组织（按需省略可选步骤）
- img 只负责触发，不作为新旧回复仲裁依据

### 3. 为什么最新仲裁必须存在

页面打开时，历史回复对应的多个回复 img 会一起加载。

这些 img 的加载顺序并不稳定，不能保证与回复时间顺序一致。

如果不做最新仲裁，旧回复和新回复可能同时运行“全局单例视图”更新，导致：

- 旧数据覆盖新数据
- 面板重复刷新
- 状态错乱
- 调试困难

因此，最新仲裁是全局单例视图更新阶段的固定规则。

---

## 平台技术边界

本平台环境受较强限制，必须按受限网页环境处理，不要按普通浏览器自由脚本环境设计。

### 1. 必须使用 img onerror 触发

禁止使用 `<script>` 标签承载执行逻辑。

运行代码应通过 `<img onerror>` 触发。

### 2. img 必须放在所属容器内部

无论是初始化 img 还是回复 img，都应放在其所属容器的内部，而不是容器闭合标签之后。

否则，基于当前触发节点向上查找容器时，可能得到空结果，导致后续逻辑无法执行。

### 3. 只使用 ES5 写法

禁止使用 ES6 及以上语法，包括但不限于：

- 箭头函数
- 模板字符串
- `let`
- `const`
- 解构赋值
- 展开运算符
- 可选链

统一使用：

- `var`
- 普通 `function`
- 字符串拼接
- 显式判空

### 4. 只使用纯 DOM API

禁止在 `onerror` 代码中使用以下模式：

- `innerHTML = '...'`
- `style.cssText = '...'`
- 任何通过字符串直接拼接大段样式或结构再整体灌入页面的方式

必须优先使用：

- `document.createElement()`
- `element.className = '...'`
- `element.textContent = '...'`
- `element.appendChild()`

### 5. CSS 预定义，不在 JS 中拼样式

样式应集中在 CSS 文件中维护。

JS 中只负责：

- 添加类名
- 切换类名
- 设置少量必要的定位数值

不要在 JS 中拼接大段样式字符串，更不要依赖 `cssText`。

### 6. 外层容器必须考虑事件隔离

如果界面会覆盖在原页面交互区域之上，最外层容器应阻止点击事件继续冒泡，避免触发原页面行为。

常见写法：

```html
<div class="ui-interface" onclick="event.stopPropagation()">
```

### 7. 避免重复 ID 和跨节点混乱

如果界面方案中需要生成带标识的节点，不要使用会在多条消息中重复出现的固定 ID。

应优先：

- 使用类名
- 使用 `data-*`
- 使用时间戳或唯一后缀

### 8. 正则替换内容不能无限膨胀

中间态正则替换应尽量保持结构清晰、长度可控。

不要在单条替换内容里塞入过长的大段代码或过度复杂的结构，以免出现截断、维护困难或平台兼容问题。

---

## 初始化代码应包含的内容

### 1. 全局变量

至少初始化这些类型的内容：

- 初始化完成标记
- 全局控制对象
- 当前状态变量
- 可选的设置项默认值
- 可选的定时器或缓存引用

示例：

```js
window.uiReady = false;
window.uiApp = {};
window.__currentIndex = 0;
window.__panelOpen = false;
```

### 2. 全局控制对象

推荐统一挂到 `window.uiApp`：

```js
window.uiApp = {
    open: function(){},
    close: function(){},
    render: function(){},
    reset: function(){},
    ensureReady: function(){}
};
```

### 3. 页面定位或布局同步

界面嵌在原网页中，初始化时应优先处理页面定位，避免遮挡顶部栏和底部栏。界面层级通常控制在 `100` 左右，避免压过过多原页面元素，也避免被原页面普通内容盖住。

推荐使用下面这段定位代码：

```js
var uiRoot = document.querySelector('.ui-interface');
var bottomBar = document.querySelector('.chat-bottom');
var topBar = document.querySelector('.topTabbar');

if (uiRoot && bottomBar && topBar) {
    var bottomHeight = bottomBar.offsetHeight;
    var visibleHeight = window.innerHeight - topBar.offsetHeight - bottomHeight;

    uiRoot.style.bottom = bottomHeight + 'px';
    uiRoot.style.height = visibleHeight + 'px';
    uiRoot.style.zIndex = 100;
}
```

### 4. 初始化完成标记

初始化逻辑末尾必须设置：

```js
window.uiReady = true;
```

### 5. 启动代码触发节点用完后移除

初始化完成后应移除初始化 img 节点：

```js
this.remove();
```

---

## 回复代码应包含的内容

### 1. Stage 1：固定引用段（Self Capture）

回复代码开头先固定 `self = this`。

```js
var self = this;
```

### 2. Stage 2：初始化依赖协商段（Initialization Dependency Gate，可选）

仅当后续逻辑依赖初始化能力时才等待。

```js
function waitReady(next) {
    if (!window.uiReady || !window.uiApp) {
        setTimeout(function() {
            waitReady(next);
        }, 50);
        return;
    }
    next();
}
```

### 3. Stage 3：当前回复自处理段（Reply-Scoped Process，可选）

每个回复实例可先处理自身所属的回复容器，不依赖“最新实例”判定。

```js
function runScoped() {
    var box = self ? self.closest('.content.left') : null;
    if (!box) return;
    // 处理当前回复同级中间态
}
```

### 4. Stage 4：最新回复仲裁段（Latest-Reply Arbitration，可选）

只有在需要“最新实例处理”时才执行本段。  
当前回复容器不是最新回复（`.content.left` 倒数第二个）则立即自删退出。

```js
function isLatestReplyBox() {
    var box = self ? self.closest('.content.left') : null;
    var replies = document.querySelectorAll('.content.left');
    var latestReply = replies[replies.length - 2];
    return !!(box && latestReply && box === latestReply);
}
```

### 5. Stage 5：最新回复处理段（Latest-Only Main Stage，可选）

仅在 Stage 4 判定通过后执行，用于全局单例视图更新。

```js
function runLatestOnly() {
    // 全局单例视图更新
}
```

### 6. Stage 6：结束自删段（Final Self Cleanup）

执行完当前脚本涉及的所有逻辑后，直接删除自身。

```js
function removeSelf() {
    if (self && self.parentNode) self.parentNode.removeChild(self);
}
```

### 7. 组合方式（按需取舍）

- 只做“每条回复各自处理”：使用 Stage 1 + Stage 3 + Stage 6
- 需要“最新回复处理”：使用 Stage 1 +（可选 Stage 2）+（可选 Stage 3）+ Stage 4 + Stage 5 + Stage 6

统一模板：

```js
var self = this;

function removeSelf() {
    if (self && self.parentNode) self.parentNode.removeChild(self);
}

function runScoped() {
    var box = self ? self.closest('.content.left') : null;
    if (!box) return;
    // 处理当前回复同级中间态
}

function isLatestReplyBox() {
    var box = self ? self.closest('.content.left') : null;
    var replies = document.querySelectorAll('.content.left');
    var latestReply = replies[replies.length - 2];
    return !!(box && latestReply && box === latestReply);
}

function runLatestOnly() {
    // 全局单例视图更新
}

function main() {
    runScoped();
    if (isLatestReplyBox()) {
        runLatestOnly();
    }
    removeSelf();
}

function waitReady(next) {
    var maxTries = 120;
    var tries = 0;
    (function checkReady() {
        if (!window.uiReady || !window.uiApp) {
            tries = tries + 1;
            if (tries >= maxTries) {
                removeSelf();
                return;
            }
            setTimeout(checkReady, 50);
            return;
        }
        next();
    })();
}

// 入口二选一：依赖初始化就用 waitReady(main)；不依赖就直接 main()
waitReady(main);
// main();
```

### 8. 新生成回复的执行理解

新生成回复的回复 img 会在以下条件满足后才触发：

1. 该条回复已经完成生成
2. 平台已经完成该条回复的中间态正则替换
3. 回复 img 开始加载并触发回复代码

因此，新生成回复一旦触发，通常已经是当前最新回复，并且同级中间态应已可读取。

---

## 中间态要求

agent 在设计回复投放方案时，应优先引入中间态。

标准链路：

1. 原始 AI 文本
2. 正则替换成结构化节点
3. 回复代码读取这些节点
4. 转成标准数据
5. 投放到界面

推荐中间态形式：

- 隐藏 `div`
- `data-*` 属性
- 子节点文本
- 多个同级节点

agent 应避免直接在大段原始文本中完成复杂界面渲染。

中间态的职责是“把原始文本变成结构化输入”，不是直接承担整套交互逻辑。

---

## 中间态正则列表要求

中间态正则列表必须独立维护。

该文件中只保留两类内容：

- 正则式
- 替换内容

不要在中间态正则列表中混入：

- 初始化逻辑
- 回复逻辑
- 大段运行说明
- 与页面定位无关的控制代码

目标是让中间态列表只负责把原始回复转换成结构化节点。

---

## 界面和样式要求

### 1. 界面以可嵌入为前提

输出应是能嵌入平台现有页面的 HTML 片段，不要生成整页 HTML 文档结构。

不要包含：

- `<html>`
- `<head>`
- `<body>`

### 2. 样式内聚

样式应集中写在 CSS 文件中，由界面结构通过类名引用。

### 3. 响应式和共存

界面应默认考虑不同屏幕尺寸，并与平台原有顶部栏、底部栏、消息区域共存。

### 4. 可读性优先

颜色、层级、字号和间距应优先保证可读性，不要为了装饰牺牲信息识别。

---

## 最重要的执行原则

1. 必须拆成独立文件维护：界面、CSS、初始化、回复代码、正则列表
2. 初始化代码和回复代码必须分开维护
3. 运行触发使用多个 img：一个初始化 img，多个回复 img
4. 界面先放好，数据后投放
5. 启动代码只做一次性初始化
6. 回复代码按六步执行链运行（按需省略可选步骤）
7. 回复代码先保存 `self`
8. 初始化等待采用“依赖驱动”，不是无条件等待
9. 最新仲裁基于 `.content.left` 顺序，不基于图片顺序或 loader 下标
10. 优先抓同级元素，不优先全局搜索
11. 初始化 img 用完删除，回复代码执行结束后直接删除回复 img
12. 正则列表只做“正则式 + 替换”
13. 解析和展示分开，不要边解析边乱改整个页面
14. 只使用 ES5 和纯 DOM API
15. 不使用 `innerHTML`、`cssText`、箭头函数、`let`、`const`
