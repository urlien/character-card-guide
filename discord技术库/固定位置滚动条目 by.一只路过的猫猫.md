# 固定位置滚动条目 by.一只路过的猫猫
创建: 2025-08-29T02:00:22.649000+00:00
消息: 2条
标签ID: 1409036961943130253, 1382024637290119238, 1382024542016507975
---

**一只路过的猫猫**: 大家好呀！今天又是我猫猫喔~ 关于直播卡，大家已经玩过不少了吧，但是据我所知，直播卡缺少的不是技术而是想法，而有想法的作者没有技术，不会做弹幕，这怎么办呢？这可不好！所以我向大家分享一份关于固定位置滚动条目的教学~

那么如之前一般，话不多说，我先把代码贴上来！

<style>
.d{position:fixed;top:100px;left:0;width:100vw;height:120px;background:rgba(0,0,0,0.7);border:2px solid #666;overflow:hidden;margin:20px 0}
.b{position:absolute;white-space:nowrap;color:#fff;font-size:18px;text-shadow:1px 1px 2px #000;animation:move 12s linear infinite}
@keyframes move{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
</style>
<div class="d">
<div class="b" style="top:20px">道路千万条，安全第一条，行车不规范，亲人泪两行</div> 
</div>

那么如上所示，d是文字框，b是文字的内容，别的不过多解释，总之是利用了一个循环小动画完成的这种东西。

你可以在d中自行调整框的位置与高度，已经做了飞行速度的随机，最后记得自行设置颜色，并且在使用的时候随机出现，也就是style="top20px" 也就是距框最上面的距离喔

它可以用于：弹幕、滚动条带，或者任何可以滚动的字符或者图片。

**羊驼**: <:emoji_140:1379454014852436038>

