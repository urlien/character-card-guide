# （已更新正则教学）基于AI制作状态栏美化的教程（小白向）
创建: 2025-08-16T18:25:15.827000+00:00
消息: 120条
标签ID: 1409036961943130253, 1382024542016507975
---

**洛清归**: 本教程仅面向完全不会代码，又想要用AI制作状态栏美化的作者。欢迎各位大佬莅临指导！
第二版：https://discord.com/channels/1205870897769095229/1406343067266584718/1411988131883913247
📎 [AI.docx](https://cdn.discordapp.com/attachments/1406343067266584718/1406343067505786903/AI.docx?ex=6a3cc9cb&is=6a3b784b&hm=2b112329cf202b237a83d3e2ceb80ae0a760bfc70f57154cdff6818bad670f32&)

**洛清归**: 若有相关问题，可私聊本人，或在本帖下方留言

**洛清归**: @user 请求经验灌注😋

**灰毛总监**: 哇，2.38mb

**羊驼**: <:emoji_140:1379454014852436038>

**洛清归**: 自检后发现文档中有多处错别字，先凑合着看吧，等第二版再修改<:emoji_144:1379454084750245939>

**羊驼**: 你们都是用什么打开的
📎 [IMG_3961.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406372473011961968/IMG_3961.png?ex=6a3ce52e&is=6a3b93ae&hm=d831893eaa9ab4a0c834cbff2514d33a9e1ccc828cb4db59c8e53b575d7a1b21&)

**羊驼**: <:1000168510:1298906820638674984>

**小魅**: 好棒好棒，写的很详细，这就狠狠灌入<:emoji_140:1379454014852436038>

**MEE6**: 

**洛清归**: office

**黑洞猫**: 这个正则能把文本中所有 <任意标签名> 格式标签都被替换为 <div class="任意标签名">，不过我限制这个“任意标签名”必须由英文大小写或者数字组成，且字符最多为两个，而且<p>不会被替换
📎 [ea42c73ff449a74c.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406527670136868905/ea42c73ff449a74c.png?ex=6a3cccf8&is=6a3b7b78&hm=c8333ab33f253b6cab1f7206afc858ec4db56a4aee24b0eb96f1c1c258c65b57&)

**黑洞猫**: 使用这个的话设定里就不用写<div class="ab">那么多字符，写个<ab>就行了

**洛清归**: 关于正则的内容我还没完全熟悉，准备等我做完第一张正则卡再补充对应内容

**ain**: 用正则就直接美化了，标签替换这个无所谓了吧。

**黑洞猫**: 不一样，这是节省你在一万五千字设定里的字符

**ain**: 设定里也不用放代码，而且魅魔这个正则没法做到链式，我设定里放的也是前后闭合的正则表达式搜索的内容

**黑洞猫**: ?

**黑洞猫**: 你设定里不写这些吗？
📎 [5d7487030d22a732.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406533652174733412/5d7487030d22a732.png?ex=6a3cd28a&is=6a3b810a&hm=47376b8a4acf2a43f4eb5f5a39a122d049ea7b017d61d248e472594b4bad43bb&)

**黑洞猫**: 而且都被简化成标签了确实也不算代码

**ain**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406534261061976074/image.png?ex=6a3cd31b&is=6a3b819b&hm=caf7460cd2f36047fc954bda39cf0031f56016ae1c73d81f78b4f411040cb067&)

**黑洞猫**: 我懂了，你的意思是不是直接使用内联样式，不使用CSS类？

**黑洞猫**: 这样多麻烦啊

**黑洞猫**: 我直接一个css替换完事
📎 [8eb4f9edeb158108.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406534543887831191/8eb4f9edeb158108.png?ex=6a3cd35f&is=6a3b81df&hm=1488d612a7f4251cdf902d1822d71ac5776f1b2a076d8afea8fad3a5ada10b2b&)

**ain**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406535057480351834/image.png?ex=6a3cd3d9&is=6a3b8259&hm=bfe132b845be963e8bd25b51021894177ffff2cdb6218be5389635d21bfc16c7&)

**ain**: 表达式逐个搜索标签然后替换为对应的标签位置上不是这样吗。

**黑洞猫**: 不错，将整体的状态栏进行替换的方法也很好

**ain**: 你上面这个是怎么替换，你是把css放在第一句吗

**ain**: 然后下面就是html吗

**黑洞猫**: 是，基于传统美化思路的替换

**黑洞猫**: 现在我也在尝试整体替换

**ain**: 明白了

**黑洞猫**: 我昨天发现正则可以做到叠盒子，以及正则的发动时点顺序问题

**ain**: 一个套一个吗

**黑洞猫**: 是的

**ain**: 魅魔这个我前天试的时候没法做到链式

**黑洞猫**: 替换一次之后再次进行替换

**ain**: 就是前一个正则留下下一个正则的表达式没法进行继续替换

**ain**: 也可能是我代码使用的有问题

**ain**: 我一开始是想连式起来做一个第一句话就两个单词的美化的

**ain**: 你说的那个套盒子怎么实现的

**ain**: 是表达式的内容都放在第一句话里，还是说直接放在替换之后的

**ain**: 通过一个触发词然后连续触发其他的正则

**黑洞猫**: 我怎么感觉我们说的不是一个东西，再次进行正则替换不需要代码吧

**黑洞猫**: 我测试的时候，可以替换一次之后可以对替换出来的内容再次进行替换啊，只不过需要对正则的排序进行一些规划

**ain**: 同一个触发词吗

**黑洞猫**: 不是

**ain**: 多个正则达成一个状态栏

**ain**: 这样吗

**ain**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406539755243704391/image.png?ex=6a3cd839&is=6a3b86b9&hm=4742b52bade9d51b1b3a4560bb50991ed8900ba273cefffd27d42487ab1e1838&)

**黑洞猫**: 我把我的测试内容告诉你吧，我也只进行了简单的测试：文本1555被正则1替换为1666，之后1666又被正则2替换为1777。我们都知道必须正则1先发动正则2再发动才能达到我们需要的1777，经过测试，正则2排序必须在正则1下方才能实现最终结果是1777。得出结论，上方的正则拥有更高的优先级。

**ain**: 我前面说的链式就是这个

**黑洞猫**: 而且很搞人心态的是，第一次保存之后，最新的正则会在最下方，也就是发动时点是最后。
但是当你进去什么都不改，第二次保存之后，刚刚写最新的正则会回到它应该在最上方的位置，获得最高的时点优先级。

**黑洞猫**: 那你失败在哪一步?

**ain**: 我正则2就失败了

**ain**: 顺序确实会乱

**黑洞猫**: 看看是不是排序问题

**ain**: 1替换之后，2就不变了

**黑洞猫**: 只有再次保存之后排序才会正常

**ain**: 我再试试

**ain**: 我一开始都是按照顺序来的

**ain**: 你的顺序是正序还是倒序

**黑洞猫**: 都是默认顺序啊，哪还有正序倒序

**ain**: 上面是1

**黑洞猫**: 就是这个原因导致排序混乱，我也没法解决

**ain**: 有时候不是会倒过来吗

**黑洞猫**: 
📎 [e9578e247ef6dee2.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406541949380329492/e9578e247ef6dee2.png?ex=6a3cda45&is=6a3b88c5&hm=30ce28adac55bfd2699487fd41df6ff0f742ec4386b3ba4a1f782b5a741f239e&)

**ain**: 我试试

**黑洞猫**: 估计是设置正则里“添加”那个代码有问题

**黑洞猫**: 最新的应该排在最上方才是正确的，不知道为什么要多次保存角色卡才能回到正确排序

**ain**: 确实可以，昨天怎么搞得失败了

**ain**: 我设置了三部从af到df替换掉了

**ain**: 我试试更复杂一点的

**ain**: 我知道之前为什么替换不成功了\[info\]这个是我原本的表达式，只要去掉斜杠就能正常替换了，应该是魅魔前端自动把斜杠带上了

**ain**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406547925357690901/image.png?ex=6a3cdfd5&is=6a3b8e55&hm=b2d20179f1fcdbae0d336ad67311e214b6fb13945a936a7ff913b8e0a44c1c29&)

**黑洞猫**: 魅魔全责<:emoji_148:1382329938404839586>

**ain**: 但是第二步又卡住了。

**ain**: 麻了

**ain**: 支持但是但是中间肯定插入什么东西了

**ain**: 你再研究研究吧，简单的确实可以链式，稍微带点捕获组或通配符就失败

**ain**: 这么一看也不是魅魔加的斜杠就是不支持

**黑洞猫**: 我只能说如果用得到会去研究的

**黑洞猫**: 最开始研究这个的目的就是状态栏进一步的精简字符

**ain**: 我问ai他是这样说的
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406555270435438684/image.png?ex=6a3ce6ad&is=6a3b952d&hm=81d2e451ab663322edcf8d4140ac9a9153daca67c8a69047c8e9d3f3427fd9af&)

**ain**: 
📎 [image.png](https://cdn.discordapp.com/attachments/1406343067266584718/1406555513243832381/image.png?ex=6a3ce6e6&is=6a3b9566&hm=76f67a977768a2f9ff4f5d4dfae4298b4b9da4f72e4d19f5e4acf605b6c8af08&)

**诈尸的维C丶柠檬茶**: 猫佬是研究出套娃正则了吗

**ain**: 可以用简单的套

**ain**: 已经在套了

**黑洞猫**: 确实只能简单的套

**黑洞猫**: 文本那种

**Ciel**: 看完长脑子了 但是只长一点 <:emoji_144:1379454084750245939>

**洛清归**: 
📎 [AI.docx](https://cdn.discordapp.com/attachments/1406343067266584718/1411988131405631550/AI.docx?ex=6a3ce3eb&is=6a3b926b&hm=3bf8626611b68841fb95bb0ca6fab0a4aca0151f6f1294f623fe018689f44a44&)

**洛清归**: （已更新正则教学）基于AI制作状态栏美化的教程（小白向）

**洛清归**: @user 这次更新还能灌注经验吗😋

**小魅**: 我可以私下挤出一些xp给你，嘿嘿

**MEE6**: 

**洛清归**: 爱你<:emoji_140:1379454014852436038>

**方源**: <:emoji_140:1383463567541665874>

**ain**: 现在第一句话可以用捕获式了

**醉梦**: 
📎 [Screenshot_20250913_162524_com.huawei.browser.jpg](https://cdn.discordapp.com/attachments/1406343067266584718/1416411917249024120/Screenshot_20250913_162524_com.huawei.browser.jpg?ex=6a3c8124&is=6a3b2fa4&hm=69cfbef152d6e65bad2435dc9de4e1bf192f68174a1352d4ca1a5dcfa25202c8&)

**醉梦**: 谁知道中间这种点一下。内容就会到聊天框里。然后可以多次堆叠的代码是什么？

**醉梦**: 我弄了半天都没搞明白。

**大爱仙尊**: 好奇怪，为啥我玩洛佬的那张约p卡Claude可能会掉正则，Gemini挺好用的，但是玩屿佬那张没钱修啥仙反倒是Gemini会掉正则，Claude其稳无比。🤨

**ain**: claude格式遵守不行

**洛清归**: 运气问题和规则不同吧

**醉梦**: 昵称：冰与火之歌
（5万字正则，西方魔幻模拟器。/气运之争设定。）作为一个降临者，你该如何在这个大陆书创造属于你的传说。
ID: 182659
https://www.meimoai8.com/#/pages/chat/chat?roleId=182659&inviteCode=j1t5Vy

**醉梦**: 尽力了。

**醉梦**: 两天两夜的成果。

**醉梦**: 你知道我一个人在那么一大堆准则代码中苦苦挣扎，有多么痛苦吗？

**醉梦**: 我一个一个代码的去试效果。

**醉梦**: 感谢大佬的无私奉献。

**黑洞猫**: 终于更新了？还是又需要用什么里技能

**ain**: /XX/这样就行了，应该就是修复了

**病娇专业户**: 那个美化的代码怎么使用

**病娇专业户**: 【复制开始】
1768414000000
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onerror="if(!document.getElementById('teapot-page-only-1768414000000')){event.stopPropagation();var s=document.createElement('style');s.id='teapot-page-only-1768414000000';s.innerHTML='.chat-container, .chat-page, .page-chat {background: linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 50%, #FFB6C1 100%) !important; } .chat-container .chat-body .item .content.left, .chat-container .chat-body .item .content.right, .chat-page .chat-body .item .content.left, .chat-page .chat-body .item .content.right {background: linear-gradient(135deg, #E6D5E8 0%, #D9C5E1 50%, #CDB5DA 100%) !important; border: none !important; box-shadow: 0 3px 8px rgba(205,181,218,0.3) !important; border-radius: 14px !important; padding: 12px 16px !important; width: auto !important; min-height: 40px !important; color: #4A90E2 !important; } .chat-container .chat-body .item .content.left p, .chat-container .chat-body .item .content.right p, .chat-page .chat-body .item .content.left p, .chat-page .chat-body .item .content.right p {color: #4A90E2 !important; } .chat-container .uni-textarea, .chat
不如说这个

**有点毒**: 不兑，怎么又一个deleted user

**有点毒**: <:1000168510:1298906820638674984>

**有点毒**: 邪恶dc

**洛清归**: 活了

**有点毒**: 羡慕<:emoji_243:1435094660505796729>

