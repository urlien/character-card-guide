# 链接网络的方法

## 工具清单

| 工具 | 用途 | 安装方式 |
|------|------|----------|
| `web_fetch` | 抓取网页文本内容 | 内置工具 |
| `agent-browser` | 浏览器自动化（登录、点击、截图） | `npx agent-browser` |
| `MiMo Vision API` | 图片/视频/音频识图分析 | Python API |
| `ffmpeg` | 视频抽帧、音频提取 | `winget install Gyan.FFmpeg` |
| `Whisper` | 语音转文字 | `pip install openai-whisper` |
| `yt-dlp` | 视频下载 | `pip install yt-dlp` |

## web_fetch — 网页抓取

最基础的网络访问工具，抓取网页文本内容。

```
支持：HTML页面（去标签提取文本）、JSON、纯文本、Markdown
限制：需要JavaScript的页面可能抓不到完整内容
```

**适用场景**：查 wiki、读文档、抓 API 数据

## agent-browser — 浏览器自动化

完整的浏览器操作工具，支持登录、点击、填表、截图等。

```bash
# 基础操作
npx agent-browser open <url>          # 打开网页
npx agent-browser snapshot -i         # 获取页面元素
npx agent-browser click @e1           # 点击元素
npx agent-browser fill @e1 "text"     # 填写表单
npx agent-browser screenshot img.png  # 截图

# 登录态复用
npx agent-browser --auto-connect open <url>  # 连接已登录的Chrome
npx agent-browser --profile Default open <url>  # 使用Chrome配置文件
npx agent-browser state save auth.json  # 保存登录状态
npx agent-browser state load auth.json  # 加载登录状态
```

**适用场景**：需要登录的网站、表单操作、截图分析

## MiMo Vision API — 图片/视频识图

通过小米 MiMo 多模态模型分析图片、视频、音频。

```python
# 图片分析
python mimo_api.py image <图片路径> "描述这张图片" --max-tokens 65536

# 视频分析
python mimo_api.py video <视频路径> "描述视频内容" --fps 1

# 音频转录
python mimo_api.py audio <音频路径> "转录音频内容"
```

**适用场景**：立绘分析、视频内容理解、音频转录

## ffmpeg — 多媒体处理

```bash
# 视频抽帧（每5秒截一帧）
ffmpeg -i video.mp4 -vf "fps=1/5" -q:v 2 frame_%04d.jpg

# 提取音频
ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 16000 audio.wav

# 截取指定时间点
ffmpeg -i video.mp4 -ss 00:00:10 -vframes 1 frame.jpg
```

## Whisper — 语音转文字

```python
import whisper
model = whisper.load_model('base')
result = model.transcribe('audio.wav', language='zh')
print(result['text'])
```
