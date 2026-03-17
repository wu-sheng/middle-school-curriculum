# CLAUDE.md - 项目约定 / Project Conventions

## 项目概述 / Overview
Xinbloom（欣欣绽放的学习花园）是一个面向初中生（女孩）的双语自学平台网站，基于 Node.js + Next.js 构建。
Xinbloom is a bilingual self-study platform for middle school students (girls), built with Node.js + Next.js.

## 技术栈 / Tech Stack
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS（女孩友好的粉紫色调主题）
- **数学公式渲染**: KaTeX（轻量、快速，支持分数、次方、开方、几何符号等）
- **内容格式**: YAML（课程结构和学习内容均使用 YAML 格式存储）
- **语言**: TypeScript
- **国际化**: 自研 React Context，支持中/英切换

## 双语策略 / Bilingual Strategy
- 网站支持中文/英文实时切换，通过顶部或侧边栏的语言切换按钮
- 所有面向学生的文本（菜单、标题、题目、解析、答案、提示语）均需提供中英双语
- YAML 中双语字段命名约定：中文用原字段名，英文加 `En` 后缀
  - 例如：`title` / `titleEn`，`question` / `questionEn`，`answer` / `answerEn`
  - 列表字段：`objectives` / `objectivesEn`，`steps` / `stepsEn`
- 组件通过 `useLang()` hook 获取当前语言，按语言选择对应字段渲染
- UI 固定文案（按钮、提示语等）通过 `uiText[lang]` 对象统一管理

## 数学术语高亮 / Math Keyword Highlighting
- 在文本中，关键数学专有名词使用 `<<术语/Term>>` 标记
- 渲染时自动高亮显示（紫色加粗 + 底部虚线），hover 可看到双语对照
- 示例：`<<有理数/rational number>>` → 中文模式显示"有理数"高亮，英文模式显示"rational number"高亮
- 常见需标注的术语包括：有理数、正数、负数、整数、分数、数轴、原点、相反数、绝对值、正方向、单位长度 等
- 此标记可与 KaTeX `$...$` 共存，渲染顺序：先处理 `<<...>>`，再处理 `$...$`

## 数学公式规范 / Math Formula Conventions
- 使用 KaTeX 渲染所有数学公式，确保公式显示与书本一致
- 分数使用 `\frac{a}{b}` 而非纯文本 `a/b`
- 次方使用 `x^{2}` 确保指数在右上角
- 开方使用 `\sqrt{x}` 或 `\sqrt[n]{x}`
- 绝对值使用 `|x|` 或 `\left|x\right|`
- 几何符号使用对应 LaTeX 命令：`\angle`, `\triangle`, `\parallel`, `\perp` 等
- 行内公式用 `$...$` 包裹，独立公式用 `$$...$$` 包裹
- 在 YAML 内容中，数学公式同样使用 `$...$` 和 `$$...$$` 标记

## 内容结构约定 / Content Structure
- 课程层级：学科 > 年级 > 学期 > 章节 > 知识点
- 每个章节的学习内容存放在对应目录下的 YAML 文件中
- 菜单结构由 `curriculum.yaml` 定义
- 每个知识点的 YAML 结构应包含（均需中英双语）：
  - `title` / `titleEn`: 标题
  - `objectives` / `objectivesEn`: 学习目标
  - `prerequisites`: 前置知识（从小学衔接）
  - `concepts`: 概念定义与讲解
  - `realLife`: 生活实例
  - `examples`: 题型精讲（每种类型一题）
  - `exercises`: 练习题（30分钟内完成）
  - `summary` / `summaryEn`: 学后总结
- 题目 / 解析 / 答案字段均需 `xxxEn` 对应英文版本

## 交互设计约定 / Interactive Design
- 练习题答案默认隐藏，点击展开
- 填空题、判断题、选择题支持自动判卷
- 题型精讲中的解题步骤可逐步展开
- 数轴等图形使用 SVG 动态绘制
- 响应式设计，适配手机和平板

## 设计风格 / Design Style
- 品牌名：Xinbloom
- 主色调：粉色 (#EC4899) + 紫色 (#8B5CF6) 渐变
- 吉祥物：🐨考拉、🦙羊驼、🐼熊猫
- 圆角卡片式布局
- 友好温暖的字体和间距

## Claude 配置约定 / Claude Settings Conventions
- 本地允许的命令（allowed commands）应放在 `.claude/settings.local.json` 中，而非 `.claude/settings.json`
- `.claude/settings.json` 用于团队共享配置，不应包含本地特定的路径或命令
- Local allowed commands must go in `.claude/settings.local.json`, NOT `.claude/settings.json`
- `.claude/settings.json` is for shared team config and must not contain machine-specific paths or commands

## 新章节开发流程 / Adding New Chapters
1. 在对应目录下创建 YAML 文件
2. 按照上述 YAML 结构填写内容，**所有面向学生的文本必须提供中英双语**
3. 在 `curriculum.yaml` 中注册新章节
4. 内容从小学知识衔接，结合日常生活
5. 确保所有数学公式使用 KaTeX 语法
6. 关键数学术语使用 `<<中文/English>>` 标记
7. 题型精讲每种类型一题，练习题控制在30分钟内
8. 练习题附带完整答案和讲解（中英双语）
