# 正则iframe可用
创建: 2026-01-07T04:46:22.334000+00:00
消息: 18条
标签ID: 1382024637290119238, 1385602521929879663
---

**飞电⚡**: 用js创建iframe元素比较好。直接创建的话只能在没有聊天过的第一句话中正常显示，不能放到ai回复的内容里，而且页面刷新后第一句话里的也会没有。可以自己发一条消息试一下
📎 [Screenshot_20260107_134046.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458334925177622677/Screenshot_20260107_134046.jpg?ex=6a3cbfbc&is=6a3b6e3c&hm=e50988e2d4d009547fb47862a88dd6b5b82c39ac8abbaf24be5e9073d983f691&)
📎 [Screenshot_20260107_134040.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458334925517488330/Screenshot_20260107_134040.jpg?ex=6a3cbfbc&is=6a3b6e3c&hm=096639423f2d4be7896ece4c05d595e33041fefd4960d2de0b8376496f3cb754&)
📎 [Screenshot_20260107_134130.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458334926012420308/Screenshot_20260107_134130.jpg?ex=6a3cbfbc&is=6a3b6e3c&hm=c2ec74cbe024005e58fb58bde316d35b5aabcb2e738ccfac24d8b401a06d0270&)

**飞电⚡**: ```
<div class="IFEkkk"><img src="" onerror="IFE=document.createElement('iframe');IFE.setAttribute('srcdoc','<!DOCTYPE html><html><head><style>body{margin:0;background:#111;color:#0f0;font-family:monospace;padding:10px;}</style></head><body><div id=\'app\'></div><script>var raw=\' $1 \';var d={};raw.split(\';\').forEach(function(p){var k=p.split(\'=\');if(k.length==2)d[k[0]]=k[1];});document.getElementById(\'app\').innerHTML=\'<h2>游戏面板</h2><p>HP: \'+d.hp+\'</p><p>MP: \'+d.mp+\'</p><button onclick=\\\'alert(JSON.stringify(d))\\\' >查看数据</button>\';</script></body></html>');IFE.setAttribute('style','width:100%;height:200px;border:none;border-radius:8px;');this.closest('.IFEkkk').append(IFE);
"></div>
```

这样能正常显示
📎 [Screenshot_20260107_135007.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458337131587174656/Screenshot_20260107_135007.jpg?ex=6a3cc1ca&is=6a3b704a&hm=57a1ffeebc76ae5956f9b62838aff32fa9ed49fc3d0b3fdace7065aba5e9a38b&)

**Nix**: 哟西 我就是大半夜床上躺着失眠突然想起来的 没细测 你这个办法太棒了
魅魔岛正则运行原理是服务端会在打开roleId时通过接口regex/list下发所有的regex以及替换的content 剩下的内容由浏览器前端渲染(起码看iframe这意思 我是这么认为) 所以刷新后不能构建iframe可能是regex并未缓存而是async下发 没来得及替换导致的(我想回复用不了可能也是类似的原因 或许可以尝试加一个sleep验证下?)

**飞电⚡**: 我只会一点前端内容，不懂具体的这些😭😭😭不过应该不是正则替换导致的，在消息或者第一句话内直接添加iframe元素也是同样的有问题的效果，其中还可以在编辑消息页面看到已经加载完成的iframe元素（编辑页面看到的文本是没有被正则替换的原始文本），但退出编辑页面回到聊天界面却看不到iframe
📎 [Screenshot_20260107_170525.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458388893370945640/Screenshot_20260107_170525.jpg?ex=6a3cf1ff&is=6a3ba07f&hm=2c362e2adb0a24a79584340e54efcca49d64c5cb02582c57ddf300bbed749a87&)
📎 [Screenshot_20260107_170530.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458388893748695093/Screenshot_20260107_170530.jpg?ex=6a3cf1ff&is=6a3ba07f&hm=50d0412accd89ec3f519fa88a22c725297eb84e1759d39e1ab52fcb7da1aed6e&)

**飞电⚡**: 用这样的测试方法，添加到第一句话，打开新的没有聊天过的对话可以触发onload。但如果打开已经有聊天的对话则是onload和onerror都不触发。我想不到可能是什么导致的，用js创建的方法是我偶然发现的
📎 [IMG_20260107_171931.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458390794389164174/IMG_20260107_171931.jpg?ex=6a3cf3c4&is=6a3ba244&hm=fa35ab4c5b6f050ad9cb2c5a4739a3f02e0d80d6855c3e7dc0730e3637e7c250&)
📎 [Screenshot_20260107_171807.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458390794720378953/Screenshot_20260107_171807.jpg?ex=6a3cf3c5&is=6a3ba245&hm=5c432c5cff8591db0ad901bfe29fcf96604ffbb7faaec25e83a0a511ed5b81d9&)

**蓝月幽灵**: 太高级了，根本看不懂，什么效果弹窗数值还是自动计算

**Nix**: 你那个是转义太多了吧？我看了一下触发没问题的
<div class="IFEkkk"><img src="" onerror="IFE=document.createElement('iframe');IFE.srcdoc='<!DOCTYPE html><html><body style=margin:0;background:#111;text-align:center;padding:20px><button onclick=this.nextElementSibling.style.display=`block`;this.remove() style=padding:10px;cursor:pointer>点击查看图片</button><img src=https://static.catai.wiki/loading.webp style=display:none;max-width:100%></body></html>';IFE.style='width:100%;height:300px;border:none';this.closest('.IFEkkk').append(IFE);"></div>
这个是创建了一个按钮 点击加载远程资源
📎 [image.png](https://cdn.discordapp.com/attachments/1458320839106629745/1458408137437483071/image.png?ex=6a3c5b2b&is=6a3b09ab&hm=f0bf1395072f16a0dae54acc6bb4cd2b1254b7f4e4619b83ffbb290befaf4ab5&)

**飞电⚡**: 啊😯😯我说的是如果不用js添加而是直接添加iframe会有的问题

**Nix**: 嗯 不过这个其实都是细节问题 只不过引起渲染的方式不一样 总之都是ok的 直接IFE.srcdoc=赋值会更好 别太多转义字符 容易错乱

**Nix**: 反正iframe肯定绝对是可用的

**飞电⚡**: 对的对的，能用是肯定的

**林羽群星（日暮宗-拉多拉群星）**: 大佬牛逼

**飞电⚡**: 我不太熟练，写的比较臃肿了😵😵

**Nix**: 我写出游戏了已经
📎 [image.png](https://cdn.discordapp.com/attachments/1458320839106629745/1458441772890853522/image.png?ex=6a3c7a7f&is=6a3b28ff&hm=f2b5191856657575047646af77baa4da5ecd68bd6f2d44b83f5d7d9acbb8e99b&)
📎 [image.png](https://cdn.discordapp.com/attachments/1458320839106629745/1458441773780041840/image.png?ex=6a3c7a7f&is=6a3b28ff&hm=7dc90eb3fce29340f73882a022b11a3524df9e4ea2000955cd7205e83981594a&)

**飞电⚡**: 这么快😯

**Nix**: 你可以试试看
📎 [game.yaml](https://cdn.discordapp.com/attachments/1458320839106629745/1458445438033330280/game.yaml?ex=6a3c7de9&is=6a3b2c69&hm=69052d979636092f4cf617f24c1f573e5ee2f02e6a04f740b3a0007145d904cd&)

**飞电⚡**: 厉害😯😯就是这妙蛙种子疯狂缠绕我，半天没行动
📎 [Screenshot_20260107_214103.jpg](https://cdn.discordapp.com/attachments/1458320839106629745/1458456181818396925/Screenshot_20260107_214103.jpg?ex=6a3c87ea&is=6a3b366a&hm=500ff725e1c7be35da467474413c5b4cf983b4f3fdeee7e0674740a934f0794c&)

**Nix**: 你现在可以试一下<div class="IFEkkk"><img src="" onerror="fetch('https://raw.githubusercontent.com/Nixdorfer/mmd-iframe-template/refs/heads/main/Pokemon-Template/index.html').then(r=>r.text()).then(h=>{IFE=document.createElement('iframe');IFE.srcdoc=h;IFE.style='width:100%;height:500px;border:none';this.closest('.IFEkkk').append(IFE)})"></div>
这样调用远程代码

