# Tony's超级无敌实用的侧边栏按钮模块
创建: 2025-08-30T00:31:09.832000+00:00
消息: 64条
---

**tony（超级长的名字看一下学者组有多闪）**: 大家好，这里是Tony！

**今天带来一个非常实用的功能侧边栏按钮。**

用我侧边栏小按钮的帅哥美女记得给我打广告😋开场白鸣谢一下tony哒

可以根据你的需要，放入不同功能的按钮
以我的**赛博朋克模拟器v3.3版本**为例：

可以内置音乐播放器、音乐播放器暂停键、作者自定义的防神化防绝望按钮、总结按钮、字数限制以及状态栏按钮、还有各种适合这张角色卡的游玩指令。

通通可以放在侧边栏上！

仅需要将代码放进第一句话（正则无脑替换也可以）即可生效，并且右上角刷新后永不消失！

以下为例图👇
📎 [Screenshot_20250830-082826.png](https://cdn.discordapp.com/attachments/1411146191290503179/1411146191982297148/Screenshot_20250830-082826.png?ex=6a3c76cd&is=6a3b254d&hm=0e4af0071da0db7f0407ee65227da702a0f85d9fd0f72c894ce1a1b949f6d7e0&)
📎 [Screenshot_20250830-082833.png](https://cdn.discordapp.com/attachments/1411146191290503179/1411146192527691826/Screenshot_20250830-082833.png?ex=6a3c76ce&is=6a3b254e&hm=a14d13fc42e74682d6fd58697e604e04bc38d547a69d5a6bf42a6a040cea127d&)

**tony（超级长的名字看一下学者组有多闪）**: 它会在你网页的右侧，创建一排整整齐齐、样式统一的悬浮按钮。每个按钮上都写着它的功能，比如“防神化按钮”、“总结模板”、“字数限制”等等。
当你点击其中任何一个按钮时，它就会把你预先设置好的一段文字，自动填到页面的输入框里。
总结：这套代码就是给你网页加一排“懒人按钮”，点一下，自动帮你打字。
第二部分：代码大拆解（纯净版）
老规矩，咱们还是分三步走：骨架(HTML)、化妆(CSS) 和 灵魂(JavaScript)。
1. 骨架 🦴 (HTML代码)
这是网页的结构。你看，比之前干净多了吧！
<div class="anniu-container">
    <button class="anniu" style="top: 60px;" data-t="这是按钮1要粘贴的文字。" onclick="...">按钮一</button>
    <button class="anniu" style="top: 120px;" data-t="这是按钮2要粘贴的文字。" onclick="...">按钮二</button>
    <button class="anniu" style="top: 180px;" data-t="这是按钮3要粘贴的文字。" onclick="...">按钮三</button>
    </div>

详细解释：
 * <div class="anniu-container">...</div>：一个容器，用来装我们所有的按钮。
 * <button class="anniu" ...>：这就是我们的主角——按钮。
   * class="anniu"：给所有这类按钮起了个统一的外号，叫 anniu。这样化妆师(CSS)就能一下给所有按钮化上同款妆容。
   * style="top: 60px;"：这个是新知识点！ 它直接告诉这个按钮：“你就待在离页面顶部60像素的地方”。每个按钮的这个值都不一样，所以它们才能整齐地排成一列。
   * data-t="..."：每个按钮身上都藏着一张“小纸条”，这张纸条上写着它被点击时需要粘贴的文字。
   * onclick="..."：按钮的“行动指令”，规定了“当被点击时，要干什么事”。
2. 化妆 💄 (CSS代码)
CSS负责让我们的按钮变漂亮。因为所有按钮都叫 anniu，所以化妆就变得非常简单。
<style>
    /* 给所有叫“anniu”的按钮化妆 */
    .anniu {
        position: fixed;     /* 让按钮“飘”在页面上 */
        right: 0;            /* 贴在页面最右边 */
        z-index: 1000;       /* 保证它在最顶层 */
        background: #4682B4; /* 背景颜色是钢蓝色 */
        color: white;        /* 文字是白色 */
        border: none;        /* 没有边框 */
        border-radius: 5px;  /* 边角弄得圆滑一点 */
        padding: 5px 5px;  /* 让按钮胖一点，文字不会挤在一起，但是又要考虑回复气泡的位置，最好不要遮住太多 */
        cursor: pointer;     /* 鼠标放上去，变指针 */
        transition: 0.3s;    /* 添加一个0.3秒的过渡动画，让变化更柔和 */
    }

    /* 当鼠标“悬停”在按钮上时，变个样子 */
    .anniu:hover {
        background: #1E90FF; /* 背景颜色变得更亮 */
        transform: translateX(-5px); /* 按钮向左移动5像素，有种“弹出来”的感觉 */
    }
</style>

这段代码就是给所有 anniu 按钮设定了一套统一的“工服”。anniu:hover 则规定了当鼠标移上去时，所有员工（按钮）都要“立正”，稍微往左挪一点并换件亮色衣服，给用户一个清晰的反馈。

**tony（超级长的名字看一下学者组有多闪）**: ---

**有了这些css代码，你就可以放一个按钮在侧边了**

**tony（超级长的名字看一下学者组有多闪）**: 比如：

**tony（超级长的名字看一下学者组有多闪）**: 3. 灵魂 🧠 (JavaScript代码)
这部分现在极其简单，因为每个按钮的“行动指令”都是完全一样的，直接写在 onclick 属性里。
onclick="
    // 1. 在整个页面里找到那个<textarea>输入框
    var input_box = document.querySelector('textarea');

    // 2. 把我自己（就是被点击的这个按钮）身上“data-t”小纸条里的内容...
    //    ...塞进输入框里。 this.dataset.t 里的'this'就代表按钮自己。
    input_box.value = this.dataset.t;

    // 3. 假装是人手动输入了一下，好让某些网页能立刻识别到内容变化
    input_box.dispatchEvent(new Event('input'));
"

详细解释：
每个按钮被点击时，都会在心里默念这三句话：
 * “找到那个大输入框！”
 * “把我兜里的小纸条（data-t）上的字，抄到输入框里！”
 * “告诉浏览器，我写完啦！”
第三部分：手把手教你写（极简版）
把下面的所有代码，完整地复制粘贴到你的第一句话
<style>
    .anniu {
        position: fixed;
        right: 0;
        z-index: 1000;
        background: #4682B4;
        color: white;
        border: none;
        border-radius: 5px 0 0 5px;
        padding: 5px 5px;
        cursor: pointer;
        transition: 0.3s;
        font-family: sans-serif;
        font-weight: bold;
    }

    .anniu:hover {
        background: #1E90FF;
        transform: translateX(-2px);
    }
</style>

<div class="anniu-container">

    <button
        class="anniu"
        style="top: 60px;"
        data-t="一大坨防神化指令巴拉巴拉巴拉"
        onclick="event.stopPropagation();(a=document.querySelector('textarea')).value+=this.dataset.t;a.dispatchEvent(new Event('input'))">防
神
化
小
钮</button>

    <button
        class="anniu"
        style="top: 240px;"
        data-t="另外一大坨总结模板八嘎八嘎八嘎嘎嘎嘎"
        onclick="event.stopPropagation();(a=document.querySelector('textarea')).value+=this.dataset.t;a.dispatchEvent(new Event('input'))">总
结
模
板
小
按
钮</button>

    <button
        class="anniu"
        style="top: 420px;"
        data-t="你写些啥就写啥齁哦哦哦哦哦哦哦哦哦哦哦"
        onclick="event.stopPropagation();(a=document.querySelector('textarea')).value+=this.dataset.t;a.dispatchEvent(new Event('input'))">按
了
长
卿
就
会
叫
的
按
钮</button>

</div>

**tony（超级长的名字看一下学者组有多闪）**: 然后将css代码和按钮代码放在一起，直接复制进第一句话放着就可以啦！（记住一定是第一句话，正则无脑替换也行，完全不占字数！！）

**tony（超级长的名字看一下学者组有多闪）**: 你一定很奇怪我为什么总结小按钮要这样子写：
总
结
小
按
钮

**tony（超级长的名字看一下学者组有多闪）**: 因为有些手机机型不适配或是其他原因，垂直代码可能会失效，所以使用了最为简单粗暴的手动挡，直接手动换行！

**tony（超级长的名字看一下学者组有多闪）**: 最后在这里鸣谢帮助我完成侧边栏模块的 @user  和 @user  @user 和 @user ！！

**屿**: 太好了是无敌的侧边栏，我们有救了

**tony（超级长的名字看一下学者组有多闪）**: 是我敬爱的屿老师呀！<:07:1298281204260278383>

**tony（超级长的名字看一下学者组有多闪）**: Tony's超级无敌实用的侧边栏按钮模块

**ain**: <:07:1298281204260278383>

**羊驼**: <:emoji_140:1379454014852436038>

**tony（超级长的名字看一下学者组有多闪）**: @user 请求经验打击！

**tony（超级长的名字看一下学者组有多闪）**: 我也想要炫酷的蓝色名片！

**tony（超级长的名字看一下学者组有多闪）**: 等晚点有空再更新音乐按钮！

**清**: <:emoji_150:1391774976864161793>

**curevirus**: 感谢分享，特地从Q过来，给作者赞一个∠( ᐛ 」∠)_

**tony（超级长的名字看一下学者组有多闪）**: 阿里嘎多写武侠的大哥哥<:07:1298281204260278383>

**tony（超级长的名字看一下学者组有多闪）**: 快把我夹带的私货长卿叫截图去给长卿看

**xi**: 天呐

**雾隐鸟（woyouzui）。**: 啊啊，TONY大人♡。

**李**: 啊啊，TONY大人♥

**黑洞猫**: <:07:1298281204260278383>

**沉时**: 哇<:07:1298281204260278383>

**Ciel**: <:emoji_140:1379454014852436038> 又跟大佬学到新知识了

**大爱仙尊**: <:1000168510:1298906820638674984>

**大爱仙尊**: <:07:1298281204260278383>

**小魅**: 好棒好棒，奖励大电量

**MEE6**: 

**tony（超级长的名字看一下学者组有多闪）**: 感谢小魅灌注我<:emoji_140:1379454014852436038>

**方源**: 可以，实用的<:emoji_140:1383463567541665874>

**晨轩(究极无敌抽象蛇皮怪版)**: 牛的，牛的。

**阴岗(萌妹)**: <:07:1298281204260278383> 实用性无敌

**KasuganoSora**: 太贴心了 完全不懂代码的看着旁边的中文翻译也能大概明白什么意思 现在我去修改下自己的角色 争取卡了一星期的这次能审核过

**D. Anser**: <:emoji_250:1413071261688659999>

**tony（超级长的名字看一下学者组有多闪）**: 记得给我打广告😋 在开场白鸣谢一下tony<:emoji_140:1379454014852436038>

**目曰目**: 提个建议，可以改成百分比单位，不要使用固定像素值，然后动态变更按钮和字体的大小，按钮过多的话有可能会溢出，我就遇到了某些卡在我的小屏幕上溢出了<:1000168518:1298906830864519231>

**目曰目**: @user

**tony（超级长的名字看一下学者组有多闪）**: 百分比很容易穿模，比溢出更糟糕（，如果你有好的解决办法可以直接发在这下面😋 主要是我懒（

**目曰目**: 懂了，我也懒，所以我也仅仅是提个建议。但这是个可实现的方案，静候大佬实现<:emoji_148:1382329938404839586>

**tony（超级长的名字看一下学者组有多闪）**: <:emoji_148:1382329938404839586>

**tony（超级长的名字看一下学者组有多闪）**: 不能勤快一点吗！

**tony（超级长的名字看一下学者组有多闪）**: <:20:1298294514124984323>

**sjzhhh**: 好用，感谢大佬，真是太感谢了

**初寒**: tony，我敬爱你呀！

**Kiko**: 大佬，按钮是怎么弄的？不是侧边按钮，是那种嵌进文本的按钮

**D. Anser**: @user

**D. Anser**: 有小登叫你呢

**D. Anser**: 出来

**D. Anser**: <:emoji_142:1379854822315921438>

**tony（超级长的名字看一下学者组有多闪）**: 藏经阁里找黑洞猫老师的教学哦

**黑洞猫**: 【点击选项文字即贴代码】https://ycn2470i1rh0.feishu.cn/wiki/EMkvwFW16ip8xyken3Zc3vOvn3b?from=from_copylink

**tony（超级长的名字看一下学者组有多闪）**: 佬猫我敬爱你口牙！

**醉梦**: 大佬能不能开源一下你的那个赛博朋克？

**醉梦**: 
📎 [20250826_224225.png](https://cdn.discordapp.com/attachments/1411146191290503179/1417438670008356884/20250826_224225.png?ex=6a3cf1a1&is=6a3ba021&hm=04651bb4173ed703f2c30150afe94dcf595f9acca58cbb09e67cb445928d02db&)

**醉梦**: 就像这一张。

**醉梦**: 我想学习一下其中的技术。

**大爱仙尊**: 大佬们，有没有点击隐藏的代码下方状态栏的代码

**OnlyIfYouLoveMe**: 这种换行好像放功能栏里就没用了，变回打横的了，不是打竖的了
📎 [0553787F-0666-4027-BDCB-C6222CDC4BB2.png](https://cdn.discordapp.com/attachments/1411146191290503179/1453311697686368366/0553787F-0666-4027-BDCB-C6222CDC4BB2.png?ex=6a3cee7d&is=6a3b9cfd&hm=252d4fecf21d3cb014e650f7c586d505dc562367c5be5bc6a10562b5ed29a33c&)

**🎸**: 用<br>换行

**OnlyIfYouLoveMe**: 确实只能这样了

**蓝月幽灵**: 感谢大佬，写的太清楚了

