# Scripts

## generate-tts.py — TTS 音频生成工具

为 FCE 英语课程生成听力音频和词汇发音，使用 OpenAI TTS API。

### 前置要求

| 依赖 | 用途 |
|------|------|
| Python 3.10+ | 运行脚本 |
| [ffmpeg](https://ffmpeg.org/) | 拼接多段音频（macOS: `brew install ffmpeg`） |
| OpenAI API Key | 调用 TTS 接口（[申请地址](https://platform.openai.com/api-keys)） |

### 安装

```bash
# 创建虚拟环境（避免污染系统 Python）
python3 -m venv /tmp/tts-venv
/tmp/tts-venv/bin/pip install openai pyyaml "httpx[socks]"
```

> 如果不使用代理，可以省略 `"httpx[socks]"`。

### 环境变量

设置 OpenAI API Key（二选一）：

```bash
export OPENAI_API_KEY=sk-xxx
# 或
export OEPNAI_VOICE_GEN=sk-xxx
```

### 使用方式

#### 生成听力音频

读取 `website/src/data/english/fce/listening/*.yaml` 中的脚本，为每段听力生成多角色对话 MP3 文件。

```bash
# 生成全部听力（已存在的自动跳过）
/tmp/tts-venv/bin/python3 scripts/generate-tts.py listening

# 只生成指定 ID
/tmp/tts-venv/bin/python3 scripts/generate-tts.py listening L001 L002 L003

# 强制重新生成（覆盖已有文件）
/tmp/tts-venv/bin/python3 scripts/generate-tts.py listening --force
```

输出目录：`website/public/audio/english/fce/listening/`

#### 生成词汇发音

读取 `website/src/data/english/fce/vocab/*.yaml` 中的词汇，为每个单词生成发音 MP3。

```bash
# 生成全部词汇发音
/tmp/tts-venv/bin/python3 scripts/generate-tts.py vocab

# 只生成指定 ID
/tmp/tts-venv/bin/python3 scripts/generate-tts.py vocab V0001 V0002
```

输出目录：`website/public/audio/english/fce/vocab/`

### 音频规格

#### 听力音频

- **模型**：OpenAI `tts-1`
- **格式**：MP3
- **声音分配**：
  | voice | 角色 | 说明 |
  |-------|------|------|
  | `shimmer` | 女孩/女学生 | 清亮女声 |
  | `echo` | 男孩/男学生 | 年轻男声 |
  | `nova` | 女性成人（老师/播报员） | 温暖女声 |
  | `onyx` | 男性成人（教练/播报员） | 低沉男声 |
  | `fable` | 导游/旁白/独白叙述者 | 英式叙述风格，用于 Part 2 独白 |
- **音频结构**：1 秒静音（开头）→ 各角色台词（0.5 秒间隔）→ 结束

#### 词汇发音

- **模型**：OpenAI `tts-1`
- **声音**：统一使用 `nova`
- **内容**：单个单词

### 费用参考

OpenAI TTS API 按字符计费：`tts-1` 约 $15/1M 字符。

| 内容 | 字符数 | 费用 |
|------|--------|------|
| Batch 1 听力（135 段） | ~33,000 | ~$0.50 |
| Batch 1 词汇（300 词） | ~3,000 | ~$0.05 |
| **合计** | ~36,000 | **~$0.55** |

### 工作流：添加新批次后生成音频

1. 添加新的 YAML 内容（例如 Batch 2 的 listening 和 vocab 文件）
2. 运行生成脚本：
   ```bash
   /tmp/tts-venv/bin/python3 scripts/generate-tts.py listening
   /tmp/tts-venv/bin/python3 scripts/generate-tts.py vocab
   ```
   脚本会自动跳过已有的文件，只生成新增内容。
3. 提交并推送音频文件：
   ```bash
   git add website/public/audio/
   git commit -m "Add Batch 2 TTS audio"
   git push
   ```
4. GitHub Pages 部署后即可播放。

### 文件结构

```
website/public/audio/english/fce/
├── listening/
│   ├── L001.mp3    # Part 1 短对话
│   ├── L002.mp3
│   ├── ...
│   ├── L120.mp3
│   ├── L121.mp3    # Part 2 句子填空（长独白）
│   └── L135.mp3
└── vocab/
    ├── V0001.mp3
    ├── V0002.mp3
    ├── ...
    └── V0300.mp3
```

### 故障排查

| 问题 | 解决方案 |
|------|---------|
| `Error: Set OPENAI_API_KEY` | 设置环境变量 `export OPENAI_API_KEY=sk-xxx` |
| `socksio` / proxy 错误 | 安装代理支持：`pip install "httpx[socks]"` |
| `pydub` 错误 | 本脚本不使用 pydub，使用 ffmpeg 拼接 |
| `ffmpeg not found` | macOS: `brew install ffmpeg` |
| 部分文件生成失败 | 重新运行脚本，已成功的会跳过，只重试失败的 |
| GitHub Pages 音频不播放 | 检查 `NEXT_PUBLIC_BASE_PATH` 是否正确设置 |
