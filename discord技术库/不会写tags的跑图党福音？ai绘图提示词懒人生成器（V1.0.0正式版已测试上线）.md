# 不会写tags的跑图党福音？ai绘图提示词懒人生成器（V1.0.0正式版已测试上线）
创建: 2026-01-17T13:59:55.796000+00:00
消息: 25条
标签ID: 1382024569845710940, 1409036961943130253, 1382024637290119238, 1382024542016507975
---

**尹清禾**: ：“AI提示词生成器” 👉 https://www.lingguang.com/share/FLASH_APP-6a188358-c48f-4d8d-b61c-d914ba22418322
本生成器使用灵光构建

另外，使用对话式ai跑图时，可以考虑把参考图和提示词一起发送，避免ooc

版本再次更新，现在是0.0.9beta最终测试版，完全修改了提示词的生成方式，符合Gemini版本
1.0.0正式版更新，优化整体使用体验，优化历史记录，增加ai对话时的保存功能，增加一键清空创作下一条的功能。
再次优化了历史记录功能，现在退出之后也能查看之前的历史记录了，版本更新好像也不会掉了。
优化双端交互体验，现在使用电脑端也可以上传图片了。
简化流程，彻底测试，目前已经可以正常使用。UI界面和跑提示词示例在下面。


许多功能还需要完善和更新，期待大家的使用反馈……
本身是给不会跑图的长卿仙子写的东西，顺便就发出来啦……
不过，虽然我给了它我自己写的提示词示例，但是它会不会按我的写法写，暂时我还不知道……
另外，在生成提示词之后，内置了修改功能和ai对话功能，可以通过拷打ai修改提示词哦
📎 [Screenshot_2026-01-17-21-57-34-108_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462084025601622117/Screenshot_2026-01-17-21-57-34-108_com.antgroup.leopard.android.jpg?ex=6a3c8b9b&is=6a3b3a1b&hm=0c6650de1639020ff69a2134ecf76c5e68fc0944c193adae7348a5e9aa2912c6&)
📎 [Screenshot_2026-01-17-21-57-40-749_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462084026402869391/Screenshot_2026-01-17-21-57-40-749_com.antgroup.leopard.android.jpg?ex=6a3c8b9c&is=6a3b3a1c&hm=80ef82f9b4dc0003e12898cdbb2eb08ca72ec6f244781f1d69875a6b72b7374c&)
📎 [Screenshot_2026-01-17-21-57-43-810_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462084027128348765/Screenshot_2026-01-17-21-57-43-810_com.antgroup.leopard.android.jpg?ex=6a3c8b9c&is=6a3b3a1c&hm=d49813780bc5eae38ec33eb77f152c6804e5bf5ba822f8a3f4ca8282d19742da&)

**尹清禾**: 本质上是为了造福大家，但是现在测试的人少，不知道实际效果以及有没有bug……

**尹清禾**: 反正大家要跑图可以试试，有bug就反馈<:emoji_140:1379454014852436038> 
我随时修<:emoji_140:1379454014852436038>

**尹清禾**: 已经过测试，即将进行更新，使他更适合我的跑图提示词——Gemini风格。

**尹清禾**: 对了，以下是Gemini当初对我写提示词的教学，想学的自己看看：
核心逻辑：Prompt 的五层金字塔结构
无论是否有负面提示词框，我的书写顺序永远遵循**“从画风定调 -> 到主体刻画 -> 再到环境渲染”**的逻辑。AI渲染图片是分层的，Prompt也必须分层。
1. 第一层：画风与质量（起手式）
作用：决定画面的“底色”和“渲染引擎”。
位置：最开头。
逻辑：必须用高权重锁定风格，否则画面会乱。
常用词：(fantasy illustration:1.3), (digital painting:1.2), painterly style, masterpiece, best quality, 8k
2. 第二层：角色主体（核心）
作用：确定画的是谁，长什么样。
位置：紧接画风之后。
逻辑：先定人数（1girl/1boy），再定名字/身份，再定身材脸型。
常用词：1girl, solo, (Name:1.2), celestial maiden, (perfect body:1.2), beautiful face
3. 第三层：神态与动作（动态）
作用：赋予角色灵魂。
位置：主体描述之后，服装之前。
逻辑：**表情（Expression）**决定情绪，**姿势（Pose）**决定构图，**视线（Gaze）**决定交互感。
常用词：(cold expression:1.2), looking back, dynamic pose, holding sword
4. 第四层：服饰与道具（细节）
作用：丰富视觉元素。
位置：动作之后。
逻辑：从大到小（长袍 -> 袖子 -> 首饰 -> 武器）。
常用词：(green hanfu:1.3), wide sleeves, glowing jewelry, weapon name
5. 第五层：环境与光影（氛围）
作用：决定画面的空间感和高级感。
位置：最后。
逻辑：背景描述 + 光效词（这是点睛之笔）。
常用词：background of night sky, moonlight, cinematic lighting, tyndall effect
一、 针对“拥有独立负面提示词框”的编辑逻辑
这是最标准的SD（Stable Diffusion）写法。
正向提示词（Positive Prompt）：
逻辑： 按上述五层金字塔顺序排列，词汇之间用英文逗号 , 分隔。
权重： 核心特征加括号 (word:1.2) ~ (word:1.4)。通用修饰词不加权重。
负面提示词（Negative Prompt）：
逻辑： 分为三类屏蔽。
画质屏蔽：low quality, blurry, pixelated, watermark
人体屏蔽：bad anatomy, bad hands, missing fingers, extra limbs, ugly face
内容屏蔽：modern clothing (防穿越), crowd (防路人), smile (防表情崩坏)
二、 针对“使用通用分隔符”的编辑逻辑
这是针对Midjourney或单输入框SD的写法。
书写逻辑：
[正向提示词模块] + [ --no 分隔符] + [负面词模块]
关键点：
拼接：将正向词写完后，不换行，直接加空格，然后接 --no。
简化：--no 后面的词不需要加括号权重（大部分软件不支持负面词带权重，或者 --no 本身就是绝对屏蔽）。
语法：--no 后面通常用逗号分隔，或者空格分隔（视具体模型而定，逗号最通用）。

**周雅（被老婆调教.周浩）**: 感谢 帮大忙了<:07:1298281204260278383>

**尹清禾**: 感谢捧场（），现在再次更新了历史记录功能的内容……

**羊驼**: <:emoji_250:1450114800481865830>

**尹清禾**: 最新版ui和示例
📎 [Screenshot_2026-01-18-09-11-00-730_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254165634842847/Screenshot_2026-01-18-09-11-00-730_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=eaa59b5a17c98df13327c27e74ca80725e44e6fa70a74a79cb01e822c28122ea&)
📎 [Screenshot_2026-01-18-09-11-07-498_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254165970391050/Screenshot_2026-01-18-09-11-07-498_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=5c7eb8dc1483619c98b91bcdae603551a8ed905f0808f0d85c4139230a491035&)
📎 [Screenshot_2026-01-18-09-11-10-425_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254166297804995/Screenshot_2026-01-18-09-11-10-425_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=386743a66743c5e995ef292674614190e7b30e68f043b3c097efa020b63b44a6&)
📎 [Screenshot_2026-01-18-09-11-13-846_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254166624698391/Screenshot_2026-01-18-09-11-13-846_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=fc9bb9460efafc768e79dca4ad46b007a57bb645d039a460a221b6c6651ba962&)
📎 [Screenshot_2026-01-18-09-11-29-928_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254167060910232/Screenshot_2026-01-18-09-11-29-928_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=9e1b959712a2d427a750e85f5e16d343a3de7b0f4d532482861f1bdceae3766a&)
📎 [Screenshot_2026-01-18-09-11-32-798_com.antgroup.leopard.android.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1462254167505764442/Screenshot_2026-01-18-09-11-32-798_com.antgroup.leopard.android.jpg?ex=6a3c8150&is=6a3b2fd0&hm=a376cacc84310094301491ec4eec5f058752f29ce1edd1e8c1db89fae74297fe&)

**尹清禾**: 不会写tags的跑图党福音？ai绘图提示词懒人生成器（V1.0.0正式版已测试上线）

**尹清禾**: 插眼，我觉得这张工具卡会被埋到吃灰

**超然小水母（水母宗主。大周荣誉国祖)**: <:emoji_243:1427157652978274334>

**黑洞猫**: 感觉可能会很有用

**黑洞猫**: 收藏了

**黑洞猫**: <:__wink:1462814548783403052>

**羊驼**: <:emoji_139:1379455053080825866>

**蜂蜜炒蛋**: 电脑上说没有这个功能
📎 [image.png](https://cdn.discordapp.com/attachments/1462084025119150244/1462973034720657573/image.png?ex=6a3c7bd0&is=6a3b2a50&hm=79f52968ede1dd82be3c2cbb3c1d8a9fdc3f66abbf41ceb91bac0f8acb77ec80&)

**蜂蜜炒蛋**: <:1000168531:1298906724979310634>

**蜂蜜炒蛋**: 是我要所有的输入都给他填上吗

**尹清禾**: 不

**尹清禾**: 可能要你登录

**鱼**: 
📎 [Screenshot_20260326_142914.jpg](https://cdn.discordapp.com/attachments/1462084025119150244/1486613316477521930/Screenshot_20260326_142914.jpg?ex=6a3ccb0a&is=6a3b798a&hm=554d794abeaaad420540ff3ef8915e4d4ea23b9054dc0a3a35be01fd0bbcd85c&)

**鱼**: 这咋办😭

**尹清禾**: 啊？

**尹清禾**: 不过我这个很久都没更新了，有个人用了我的这个做了个新的也在藏经阁里，你去看一下

