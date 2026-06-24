# 关于如何将MP4文件转为WEBP文件
创建: 2025-09-24T17:27:11.047000+00:00
消息: 2条
---

**洛桜吹雪🍂**: 优势：统一后缀，方便管理，占用内存远远小于gif，随界面刷新不会出现加载失败问题
具体做法：
1.https://ffmpeg.org/download.html#build-windows 往下翻下载对应系统的exe整合包
2.下载完成后点开bin文件夹，复制文件地址（例如：E:\ffmpeg-2025-09-04-git-2611874a50-essentials_build\ffmpeg-2025-09-04-git-2611874a50-essentials_build\bin）
3.win+r，输入sysdm.cpl打开系统属性
高级-环境变量-path双击打开-新建
将复制好的地址放进去，确定
4.将要转格式的mp4文件放在一个文件夹中，在文件夹地址直接输入cmd打开控制台，使用以下代码：
for %a in ("*.mp4") do ffmpeg -i "%a" -vcodec libwebp -loop 0 -an -vsync 0 -vf "fps=30,scale=720:-1 :force_original_aspect_ratio=decrease" -q:v 70 "%~na.webp"
5.完成。fps帧率，scale像素，-q:v质量参数均可根据压缩需要调节
📎 [image.png](https://cdn.discordapp.com/attachments/1420461577798422658/1420461578599268523/image.png?ex=6a3cbc2f&is=6a3b6aaf&hm=de86efa84c0bb0c692ccd88677591c5f135a2c4f508c49c44fa24369c7ad2d98&)
📎 [image.png](https://cdn.discordapp.com/attachments/1420461577798422658/1420461579312431245/image.png?ex=6a3cbc2f&is=6a3b6aaf&hm=4373b51c7b4d533dc91b75dd11a83db745c311587526121fe354d632a66cbaf0&)

**洛桜吹雪🍂**: 附一个教程视频【MP4视频转webp动画教程】 https://www.bilibili.com/video/BV17MBKYjE88/?share_source=copy_web&vd_source=fc6a786a4fbcb576b6522bd4eb12785b

