# FCE Adventure 课程总体规划

## 目标学习者
- 年龄：8-9 岁（三年级），已通过 PET (B1)
- 目标：12-18 个月内达到 FCE (B2) 水平
- 每日学习时间：25-30 分钟（周末含写作约 45 分钟）

## 设计理念
- **B2 语言骨架 + 童趣外衣**：所有 FCE 考点用奇幻/冒险/科普场景包装
- **双层架构**：Quest（知识模块，讲解新概念）+ Daily Practice（每日练习，量大面广）
- **渐进式内容投放**：按月批量添加，每批覆盖 2 个月的内容
- **固定编号系统**：无数据库，用稳定 ID 追踪进度（localStorage）

---

## 一、编号体系（ID Convention）

所有内容使用固定编号，格式如下：

### Quest 编号
```
Q{nn}          例：Q01, Q02 ... Q12
```

### 每日练习编号
```
D{nnn}         例：D001, D002 ... D450
```
每日练习按自然日递增，D001 是学习第 1 天，D450 是第 15 个月最后一天。

### 阅读材料编号
```
R{nnn}         例：R001, R002 ... R200
```
按难度递增排列。每篇阅读对应一个固定编号，不随 Daily 重新编排。

### 词汇编号
```
V{nnnn}        例：V0001, V0002 ... V2500
```
2500 个核心词汇，按主题分组，每个词条有唯一编号。

### 语法题编号
```
G{nnnn}        例：G0001, G0002 ... G2000
```

### Use of English 题编号
```
U{nnnn}        例：U0001, U0002 ... U2000
```

### 听力材料编号
```
L{nnn}         例：L001, L002 ... L900
```
每天 2-3 段，15 个月。按 FCE Part 类型混合编排。

#### FCE 听力四种题型

| type 值 | FCE Part | 形式 | 音频时长 | 题目 |
|---------|----------|------|---------|------|
| `short-extract` | Part 1 | 短对话/独白 | ~30s | 1 道三选一 |
| `sentence-completion` | Part 2 | 长独白（演讲/导览） | ~2-3min | 5-10 个句子填空 |
| `multiple-matching` | Part 3 | 5 人各说 30s | ~3min | 5 道匹配（从 8 选项选） |
| `long-conversation` | Part 4 | 长对话/访谈 | ~3-4min | 5-7 道选择题 |

#### 按月引入节奏
- 1-2月：Part 1（短对话）+ Part 2（句子填空）
- 3-4月：+ Part 3（多人匹配）
- 5月起：+ Part 4（长对话），四种混合
- 10-15月：全部四种，接近真实考试比例

#### Part 2 句子填空 Schema
```yaml
  - id: L121
    type: sentence-completion
    title: 'Tour of the Penguin House'
    titleZh: '企鹅馆导览'
    scene: 'You will hear a zoo guide talking about the penguin house.'
    sceneZh: '你将听到一位动物园导游介绍企鹅馆。'
    difficulty: 1
    audioFile: 'L121.mp3'
    script:
      - speaker: guide
        voice: nova
        text: '...(长独白，10-15 句)...'
    sentences:       # 听的同时填空
      - id: L121-S1
        text: 'The penguins are fed _____ times a day.'
        answer: 'three'
      - id: L121-S2
        text: 'The coldest part of the enclosure is kept at _____ degrees.'
        answer: 'minus five'
```

### 写作任务编号
```
W{nnn}         例：W001, W002 ... W060
```

### 编号与文件的对应关系
```
english/fce/
├── PLAN.md                          # 本文件
├── quests/                          # Quest 知识模块
│   ├── Q01-magic-words.yaml
│   ├── Q02-time-traveler.yaml
│   └── ...
├── readings/                        # 阅读材料库（按批次组织）
│   ├── batch01-R001-R030.yaml       # 第 1 批：R001-R030
│   ├── batch02-R031-R060.yaml       # 第 2 批：R031-R060
│   └── ...
├── vocab/                           # 词汇库（按主题组织）
│   ├── topic-01-animals-nature.yaml       # V0001-V0120
│   ├── topic-02-adventure-fantasy.yaml    # V0121-V0240
│   └── ...
├── grammar/                         # 语法题库（按语法点组织）
│   ├── tenses.yaml                  # G0001-G0300
│   ├── conditionals.yaml            # G0301-G0500
│   └── ...
├── use-of-english/                  # UoE 题库（按题型组织）
│   ├── cloze.yaml                   # U0001-U0500（完形填空）
│   ├── word-formation.yaml          # U0501-U1000（构词法）
│   ├── key-word-transformation.yaml # U1001-U1500（句型转换）
│   └── collocations.yaml            # U1501-U2000（搭配选择）
├── writing/                         # 写作任务库
│   ├── stories.yaml                 # W001-W020
│   ├── reviews.yaml                 # W021-W040
│   └── essays.yaml                  # W041-W060
└── daily/                           # 每日练习编排
    ├── month-01.yaml                # D001-D030
    ├── month-02.yaml                # D031-D060
    └── ...
```

---

## 二、Quest 知识模块（12 个，每个 1-2 周）

### 时间线总览

| 月份 | Quest | 主题 | FCE 考点 |
|------|-------|------|----------|
| 1 | Q01 Magic Word Lab | 魔法变形课 | 构词法（UoE Part 3）|
| 2 | Q02 Time Traveler | 时间旅行者 | 高级时态体系 |
| 3 | Q03 Detective Club | 侦探俱乐部 | 阅读推断（Reading Part 5-7）|
| 4 | Q04 Dragon Academy | 驯龙学院 | 句型转换（UoE Part 4）|
| 5 | Q05 Story Forge | 故事锻造坊 | 叙事写作（Writing Part 2 - Story）|
| 6 | Q06 Nature Explorer | 自然探索家 | 科普阅读（Reading Part 6）|
| 7 | Q07 Idiom Jungle | 成语丛林 | 短语动词与搭配（UoE Part 1-2）|
| 8 | Q08 World Builder | 世界构建师 | 从句与复杂句 |
| 9 | Q09 Review Master | 书评大师 | 评论写作（Writing Part 2 - Review）|
| 10 | Q10 Debate Arena | 辩论竞技场 | 议论文（Writing Part 1 - Essay）|
| 11 | Q11 Code Breaker | 密码破译者 | UoE 综合训练 |
| 12-15 | Q12 Final Quest | 终极冒险 | 全真模拟 + 薄弱环节强化 |

### 各 Quest 详细内容

#### Q01 Magic Word Lab 魔法变形课（月份 1）
- **FCE 对标**：Use of English Part 3 (Word Formation)
- **主题包装**：霍格沃兹式魔法学院，词缀 = 咒语
- **知识点**：
  - 前缀系列：un-, in-/im-/il-/ir-, dis-, mis-, over-, under-, re-, pre-
  - 后缀系列：-tion/-sion, -ment, -ness, -ful, -less, -able/-ible, -ous, -ive, -ly, -ise/-ize
  - 词性转换规律：noun ↔ verb ↔ adjective ↔ adverb
- **阅读素材**：Harry Potter 精选片段（咒语词源解析）
- **配套练习**：V0001-V0120 词汇 + G0001-G0050 语法 + U0501-U0550 构词题

#### Q02 Time Traveler 时间旅行者（月份 2）
- **FCE 对标**：语法基础（贯穿所有 Part）
- **主题包装**：穿越不同时空，每个时态 = 一个时代
- **知识点**：
  - 12 种基本时态的对比与选择
  - 过去完成时 vs 过去简单时（叙事中的"回溯"）
  - 将来完成时（"到那时候为止"）
  - 条件句 Type 0-3 + 混合条件句
  - I wish / If only + 过去时/过去完成时
- **阅读素材**：Percy Jackson 片段（希腊神话的时间叙事）
- **可视化**：时间线 SVG（各时态在时间轴上的位置关系）
- **配套练习**：G0051-G0200 语法

#### Q03 Detective Club 侦探俱乐部（月份 3）
- **FCE 对标**：Reading Part 5 (Multiple Choice), Part 6 (Gapped Text), Part 7 (Multiple Matching)
- **主题包装**：福尔摩斯式推理破案
- **知识点**：
  - 主旨推断 vs 细节定位
  - 作者态度/目的判断
  - 段落逻辑衔接（指代词、连接词追踪）
  - 同义替换识别（题目与原文的 paraphrase）
- **阅读素材**：改编自 Enola Holmes / Sherlock Holmes for Young Readers
- **情态动词推测**：must have / might have / can't have（推理语言）
- **配套练习**：R001-R030 阅读 + G0201-G0300 语法

#### Q04 Dragon Academy 驯龙学院（月份 4）
- **FCE 对标**：Use of English Part 4 (Key Word Transformation)
- **主题包装**：奇幻学院，用不同方式表达同一意思 = 变形术
- **知识点**：
  - 主动 ↔ 被动转换
  - 直接引语 ↔ 间接引语
  - so...that / such...that / too...to / enough...to
  - 比较级句型（as...as, not as...as, less...than）
  - 因果/让步连接词替换（because → due to, although → despite）
  - 强调句（It was... that...）
- **配套练习**：U1001-U1100 句型转换题

#### Q05 Story Forge 故事锻造坊（月份 5）
- **FCE 对标**：Writing Part 2 - Story
- **主题包装**：成为故事创作者
- **知识点**：
  - 故事结构：Hook → Rising Action → Climax → Resolution
  - 描写技巧：五感描写、比喻/拟人
  - 对话标点与格式
  - 时态一致性（叙事用过去时）
  - B2 级叙事连接词：Meanwhile, Eventually, All of a sudden, To her surprise
- **写作脚手架**：故事地图 → 关键句填空 → 段落扩写 → 完整故事
- **配套练习**：W001-W010 写作任务

#### Q06 Nature Explorer 自然探索家（月份 6）
- **FCE 对标**：Reading Part 6 (Gapped Text)
- **主题包装**：科普探险
- **知识点**：
  - 段落衔接信号词（However, Furthermore, As a result, In contrast）
  - 指代关系追踪（this discovery, such behavior, the former/latter）
  - 信息流逻辑（总分、时间、因果、对比）
- **话题**：章鱼的智慧、蜜蜂的语言、恐龙灭绝、太空探索、深海生物
- **素材来源**：改编自 National Geographic Kids, TED-Ed
- **配套练习**：R031-R060 阅读

#### Q07 Idiom Jungle 成语丛林（月份 7）
- **FCE 对标**：Use of English Part 1 (Multiple-choice Cloze), Part 2 (Open Cloze)
- **主题包装**：丛林探险，每个路口选对搭配才能通关
- **知识点**：
  - 高频短语动词 60 个（take, get, give, put, look, come, go, turn, bring, set）
  - 固定搭配 80 个（make/do, take/have, verb + preposition）
  - 介词搭配（depend on, consist of, result in/from）
  - 连接词/副词完形（although, despite, whereas, nevertheless）
- **配套练习**：U0001-U0250 完形 + V0121-V0360 词汇

#### Q08 World Builder 世界构建师（月份 8）
- **FCE 对标**：语法进阶（贯穿 Reading & Writing）
- **主题包装**：用复杂句构建虚拟世界
- **知识点**：
  - 定语从句（who/which/that/where/whose，限定 vs 非限定）
  - 状语从句（时间/原因/条件/让步/目的/结果）
  - 名词性从句（what 引导 / that 引导）
  - 分词短语（-ing/-ed 作定语和状语）
  - 句子合并练习：两个短句 → 一个复合长句
- **配套练习**：G0301-G0500 语法

#### Q09 Review Master 书评大师（月份 9）
- **FCE 对标**：Writing Part 2 - Review
- **主题包装**：为喜欢的书/电影/游戏写专业评论
- **知识点**：
  - Review 结构：Introduction → Summary → Opinion → Recommendation
  - 评价语言：I would highly recommend... / The plot was rather predictable... / What struck me most was...
  - 描述与评价的平衡
  - 目标读者意识（写给谁看？）
- **话题**：Harry Potter、Percy Jackson、Frozen、Minecraft 等孩子熟悉的内容
- **配套练习**：W011-W025 写作任务

#### Q10 Debate Arena 辩论竞技场（月份 10）
- **FCE 对标**：Writing Part 1 - Essay
- **主题包装**：辩论赛，学习正反论证
- **知识点**：
  - 议论文结构：Thesis → Argument 1 → Argument 2 → Counter-argument → Conclusion
  - 观点表达升级：I think → It could be argued that / There is no doubt that / While some may claim...
  - 正反论证连接词：On the one hand... On the other hand... / However / Nevertheless / In spite of this
  - 举例与让步：For instance / Admittedly / Although this may be true
- **话题（童趣化）**：
  - 学校应该养班级宠物吗？
  - 纸质书 vs 电子书
  - 电子游戏的利弊
  - 校服应该取消吗？
  - 每个孩子都应该学编程吗？
- **配套练习**：W026-W040 写作任务

#### Q11 Code Breaker 密码破译者（月份 11）
- **FCE 对标**：Use of English Part 1-4 综合
- **主题包装**：破译密码任务，综合运用所有技能
- **知识点**：
  - 混合题型训练：完形 + 构词 + 句型转换交替
  - 限时训练（模拟考试节奏）
  - 错题归类与薄弱点分析
- **配套练习**：全题库混合出题

#### Q12 Final Quest 终极冒险（月份 12-15）
- **FCE 对标**：全真模拟
- **内容**：
  - 4 套完整模拟卷（Reading + Use of English），话题全部童趣化改编
  - 每月 1 套，练习模式（不计时）+ 考试模式（计时 75 分钟）
  - 详细分项得分 + 指向对应 Quest 的复习建议
- **配套**：大量历史题目混合复习

---

## 三、每日练习编排（Daily Practice）

### 每日练习结构

每天一套练习（D001-D450），固定结构：

```yaml
# 示例：D015
id: D015
day: 15
month: 1
quest: Q01          # 当前所在 Quest
sections:
  - type: reading
    ref: R008        # 引用阅读材料 R008
  - type: vocab
    refs: [V0036, V0037, V0038, V0039, V0040]    # 5 个新词
    review: [V0001, V0012, V0023, V0005, V0018]   # 5 个复习词（间隔重复）
  - type: grammar
    refs: [G0031, G0032, G0033, G0034, G0035]     # 5 道语法题
  - type: use_of_english
    refs: [U0508, U0509, U0510, U0511, U0512]     # 5 道 UoE 题
  - type: writing     # 仅周末（每 7 天一次）
    ref: W003
```

### 月度内容分配与复习比例

| 月份 | Quest | 新内容占比 | 复习内容占比 | 阅读范围 | 词汇范围 |
|------|-------|-----------|-------------|---------|---------|
| 1 | Q01 | 100% | 0% | R001-R015 | V0001-V0150 |
| 2 | Q02 | 90% | 10% Q01 | R016-R030 | V0151-V0300 |
| 3 | Q03 | 80% | 20% Q01-02 | R031-R050 | V0301-V0450 |
| 4 | Q04 | 70% | 30% Q01-03 | R051-R070 | V0451-V0600 |
| 5 | Q05 | 65% | 35% Q01-04 | R071-R085 | V0601-V0750 |
| 6 | Q06 | 60% | 40% Q01-05 | R086-R100 | V0751-V0900 |
| 7 | Q07 | 55% | 45% Q01-06 | R101-R115 | V0901-V1100 |
| 8 | Q08 | 50% | 50% Q01-07 | R116-R130 | V1101-V1300 |
| 9 | Q09 | 45% | 55% Q01-08 | R131-R145 | V1301-V1500 |
| 10 | Q10 | 40% | 60% Q01-09 | R146-R160 | V1501-V1700 |
| 11 | Q11 | 35% | 65% 全部 | R161-R175 | V1701-V1900 |
| 12 | Q12 | 30% | 70% 全部 | R176-R185 | V1901-V2100 |
| 13 | Q12 | 25% | 75% 全部 | R186-R192 | V2101-V2300 |
| 14 | Q12 | 20% | 80% 全部 | R193-R197 | V2301-V2450 |
| 15 | Q12 | 15% | 85% 全部 | R198-R200 | V2451-V2500 |

### 间隔重复算法（简化版，适用于静态站点）

词汇复习不使用动态算法，而是在编排 Daily 时预设复习序列：
- 新词学习后第 1、3、7、14、30 天各复习一次
- 每日 5 个复习词从历史词汇中按此间隔选取
- 具体选词在 `month-XX.yaml` 编排时固定写死

---

## 四、内容批次投放计划

每次添加一批内容覆盖约 2 个月，共 8 批：

| 批次 | 投放时间 | 覆盖月份 | 内容范围 | 预计工作量 |
|------|---------|---------|---------|-----------|
| **Batch 1** | 开发启动 | 月 1-2 | Q01-Q02 + D001-D060 + R001-R030 + V0001-V0300 | MVP，最重要 |
| **Batch 2** | +2 月 | 月 3-4 | Q03-Q04 + D061-D120 + R031-R070 + V0301-V0600 |  |
| **Batch 3** | +4 月 | 月 5-6 | Q05-Q06 + D121-D180 + R071-R100 + V0601-V0900 |  |
| **Batch 4** | +6 月 | 月 7-8 | Q07-Q08 + D181-D240 + R101-R130 + V0901-V1300 |  |
| **Batch 5** | +8 月 | 月 9-10 | Q09-Q10 + D241-D300 + R131-R160 + V1301-V1700 |  |
| **Batch 6** | +10 月 | 月 11-12 | Q11-Q12(pt1) + D301-D360 + R161-R185 + V1701-V2100 |  |
| **Batch 7** | +12 月 | 月 13-14 | Q12(pt2) + D361-D420 + R186-R197 + V2101-V2450 |  |
| **Batch 8** | +14 月 | 月 15 | Q12(pt3) + D421-D450 + R198-R200 + V2451-V2500 |  |

### Batch 1 详细清单（MVP）

**Quest 文件**：
- `quests/Q01-magic-words.yaml` — 构词法知识讲解
- `quests/Q02-time-traveler.yaml` — 时态体系讲解

**阅读材料**（30 篇）：
- `readings/batch01-R001-R030.yaml`
- R001-R010：Level 1（200 词，简单句为主，奇幻/动物主题）
- R011-R020：Level 1.5（250 词，引入复合句，冒险/科普主题）
- R021-R030：Level 2（300 词，从句增多，侦探/自然主题）
- 每篇附 4 道理解题（1 主旨 + 2 细节 + 1 推断）

**词汇**（300 词）：
- `vocab/topic-01-animals-nature.yaml` — V0001-V0120
- `vocab/topic-02-adventure-fantasy.yaml` — V0121-V0240
- `vocab/topic-03-feelings-personality.yaml` — V0241-V0300
- 每个词条含：word, phonetic, partOfSpeech, definition, definitionZh, exampleSentence, wordFamily（变形）

**语法题**（200 道）：
- `grammar/tenses.yaml` — G0001-G0200
- 覆盖 12 种时态 + 条件句

**UoE 题**（100 道）：
- `use-of-english/word-formation.yaml` — U0501-U0600（构词法，对应 Q01）

**写作任务**（8 个）：
- `writing/stories.yaml` — W001-W008
- 前 4 个有详细脚手架，后 4 个逐步减少辅助

**每日编排**（60 天）：
- `daily/month-01.yaml` — D001-D030
- `daily/month-02.yaml` — D031-D060

---

## 五、YAML Schema 设计

### 阅读材料 Schema

```yaml
readings:
  - id: R001
    title: "The Clever Octopus"
    titleZh: "聪明的章鱼"
    level: 1                        # 1-5 难度递增
    wordCount: 210
    topic: animals                  # animals | adventure | science | detective | fantasy | nature
    tags: [Q01, month-1]           # 关联的 Quest 和月份
    passage: |
      Deep beneath the waves of the Pacific Ocean, an octopus named Otto
      lived in a small cave between two rocks. Otto was no ordinary octopus...
    passageZh: |
      在太平洋深处的海浪之下，一只名叫奥托的章鱼住在两块岩石之间的小洞穴里...
    vocabHighlights:               # 本文重点词汇（链接到词汇库）
      - word: beneath
        ref: V0045
      - word: ordinary
        ref: V0023
    questions:
      - id: R001-Q1
        type: main-idea            # main-idea | detail | inference | vocabulary
        question: "What is the passage mainly about?"
        questionZh: "这篇文章主要讲了什么？"
        options:
          - A: "How octopuses find food"
          - B: "A particularly smart octopus"
          - C: "Life in the Pacific Ocean"
          - D: "Why octopuses live in caves"
        answer: B
        explanation: "The passage focuses on Otto and his unusual intelligence..."
        explanationZh: "文章重点讲述了奥托和他不寻常的智慧..."
      - id: R001-Q2
        type: detail
        ...
```

### 词汇 Schema

```yaml
vocab:
  - id: V0001
    word: extraordinary
    phonetic: /ɪkˈstrɔːrdɪneri/
    partOfSpeech: adjective
    definition: "Very unusual or remarkable"
    definitionZh: "非凡的，特别的"
    exampleSentence: "The dragon had an extraordinary ability to breathe ice instead of fire."
    exampleSentenceZh: "这条龙有一种非凡的能力——它能喷冰而不是喷火。"
    wordFamily:                    # 构词变形（Q01 核心内容）
      - form: extraordinarily
        partOfSpeech: adverb
      - form: ordinary
        partOfSpeech: adjective
        note: "base form (without prefix extra-)"
    collocations:                  # 固定搭配
      - "extraordinary ability"
      - "something extraordinary"
    synonyms: [remarkable, exceptional, incredible]
    antonyms: [ordinary, common, typical]
    level: 1                       # 在课程中的出现阶段
    firstAppear: D003              # 首次在哪天学习
    reviewSchedule: [D004, D006, D010, D017, D033]  # 复习日
```

### 语法/UoE 题 Schema

```yaml
questions:
  - id: G0001
    type: fill-blank               # fill-blank | multiple-choice | transformation | error-correction
    tags: [past-perfect, Q02, difficulty-1]
    context: fantasy               # 场景标签
    question: "By the time the wizard arrived, the dragon _____ (already / escape)."
    questionZh: "当巫师到达时，龙已经 _____ 了。"
    answer: "had already escaped"
    explanation: "We use the past perfect (had + past participle) for an action completed before another past action."
    explanationZh: "我们用过去完成时（had + 过去分词）来表示在另一个过去动作之前已经完成的动作。"
    grammarPoint: "Past Perfect"
    relatedQuest: Q02
    difficulty: 1                  # 1-3

  - id: U1001
    type: transformation           # FCE Use of English Part 4
    tags: [so-that, Q04, difficulty-2]
    context: fantasy
    original: "The dragon was too tired to fly anymore."
    originalZh: "龙太累了，再也飞不动了。"
    keyword: THAT
    template: "The dragon was _____ not fly anymore."
    answer: "so tired that it could"
    explanation: "too + adj + to → so + adj + that + clause (negative meaning preserved)"
    explanationZh: "too...to 转换为 so...that 结构，保持否定含义"
    grammarPoint: "so...that / too...to transformation"
    relatedQuest: Q04
    difficulty: 2
```

### 写作任务 Schema

```yaml
tasks:
  - id: W001
    type: story                    # story | review | essay | article
    title: "The Door in the Tree"
    titleZh: "树上的门"
    prompt: "Your story must begin with: 'I never expected to find a door in the old oak tree.'"
    promptZh: "你的故事必须以这句话开头：'我从没想过会在那棵老橡树上发现一扇门。'"
    targetWords: 140-190           # FCE 标准字数
    difficulty: 1
    relatedQuest: Q05
    scaffold:                      # 写作脚手架（初期提供，后期减少）
      storyMap:
        opening: "Describe where you are and how you found the door."
        development: "What happens when you open it? What do you see?"
        climax: "What problem or surprise do you encounter?"
        resolution: "How does the adventure end?"
      mustUseWords:                # 必须用到的 B2 词汇/短语
        - "Eventually"
        - "To my surprise"
        - "extraordinary"
      mustUseStructure:            # 必须用到的语法结构
        - "at least one relative clause (who/which/where)"
        - "at least one past perfect sentence"
    selfCheckList:                 # 自评清单
      - "Did I use at least 3 descriptive adjectives?"
      - "Did I include dialogue?"
      - "Did I use paragraphs to organize my story?"
      - "Did I check my verb tenses are consistent?"
    modelAnswer: |                 # 范文（Collapsible 展开）
      I never expected to find a door in the old oak tree...
    modelAnswerZh: |
      我从没想过会在那棵老橡树上发现一扇门...
```

### 每日编排 Schema

```yaml
# daily/month-01.yaml
month: 1
quest: Q01
days:
  - id: D001
    date_offset: 1                 # 学习第 1 天
    reading: R001
    newVocab: [V0001, V0002, V0003, V0004, V0005]
    reviewVocab: []                # 第一天无复习
    grammar: [G0001, G0002, G0003, G0004, G0005]
    useOfEnglish: [U0501, U0502, U0503, U0504, U0505]
    writing: null                  # 非写作日

  - id: D002
    date_offset: 2
    reading: R001                  # 同一篇可出现两天（第二天做更深入的题）
    newVocab: [V0006, V0007, V0008, V0009, V0010]
    reviewVocab: [V0001, V0003]    # 复习前天的
    grammar: [G0006, G0007, G0008, G0009, G0010]
    useOfEnglish: [U0506, U0507, U0508, U0509, U0510]
    writing: null

  - id: D007
    date_offset: 7
    reading: R004
    newVocab: [V0031, V0032, V0033, V0034, V0035]
    reviewVocab: [V0001, V0006, V0011, V0016, V0021]  # 第 1 天的词到复习日了
    grammar: [G0031, G0032, G0033, G0034, G0035]
    useOfEnglish: [U0531, U0532, U0533, U0534, U0535]
    writing: W001                  # 第一个周末，第一个写作任务
```

---

## 六、前端进度追踪（localStorage）

无数据库，用 localStorage 记录学习进度：

```typescript
interface FCEProgress {
  // 当前进度
  currentDay: number;              // 当前学习到第几天（D001 = 1）
  currentQuest: string;            // 当前 Quest（Q01）
  startDate: string;               // 学习开始日期

  // 每日完成记录
  dailyCompleted: {
    [dayId: string]: {             // "D001", "D002"...
      completedAt: string;         // ISO 日期
      scores: {
        reading: number;           // 0-100
        vocab: number;
        grammar: number;
        useOfEnglish: number;
      };
    };
  };

  // 词汇掌握度
  vocabMastery: {
    [vocabId: string]: {           // "V0001"...
      correctCount: number;        // 累计答对次数
      totalCount: number;          // 累计出现次数
      lastSeen: string;            // 上次出现日期
      mastered: boolean;           // correctCount >= 4 视为掌握
    };
  };

  // 写作记录（标记是否完成，分数自评）
  writingCompleted: {
    [taskId: string]: {
      completedAt: string;
      selfScore: number;           // 1-5 自评分
    };
  };
}
```

---

## 七、开发里程碑

### Milestone 1：架构搭建（1-2 周）
- [ ] 扩展 curriculum.yaml 注册 English/FCE
- [ ] 设计英语课程页面路由（复用 lesson/[...slug] 或新建 fce/[...slug]）
- [ ] 实现 DailyPractice 组件（每日练习的入口和流程）
- [ ] 实现 ReadingPassage 组件（长文阅读 + 词汇高亮）
- [ ] 实现 VocabCard 组件（词汇卡片 + 发音）
- [ ] 实现 localStorage 进度追踪

### Milestone 2：Batch 1 内容（2-4 周）
- [ ] 编写 Q01-magic-words.yaml
- [ ] 编写 Q02-time-traveler.yaml
- [ ] 编写 R001-R030 阅读材料（30 篇）
- [ ] 编写 V0001-V0300 词汇（300 词）
- [ ] 编写 G0001-G0200 语法题（200 道）
- [ ] 编写 U0501-U0600 构词题（100 道）
- [ ] 编写 W001-W008 写作任务（8 个）
- [ ] 编排 D001-D060 每日练习（60 天）

### Milestone 3：写作模块（1-2 周）
- [ ] 实现 WritingTask 组件（写作任务 + 脚手架 + 自评）
- [ ] 实现 StoryMap 可视化组件

### Milestone 4-8：后续批次内容
- 每 2 个月投放一批，按 Batch 2-8 的内容清单执行

---

## 八、关键约定

1. **编号一旦分配永不改变**：R001 永远是 R001，即使后来发现需要调整顺序，也通过 daily 编排来控制出现顺序，不改 ID
2. **向后兼容**：新批次只添加内容，不修改已发布内容的 ID 和结构
3. **双语**：所有面向学生的文本必须提供中英双语（question/questionZh, explanation/explanationZh）
4. **每篇阅读独立**：阅读材料之间无依赖关系，可独立阅读
5. **写作任务分级**：W001-W020 提供完整脚手架，W021-W040 提供部分脚手架，W041-W060 仅给 prompt
