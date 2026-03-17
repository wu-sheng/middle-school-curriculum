# CLAUDE.md - 项目约定 / Project Conventions

## 项目概述 / Overview
Xinbloom（欣欣绽放的学习花园）是一个面向初中生（女孩）的双语自学平台网站，基于 Node.js + Next.js 构建。
Xinbloom is a bilingual self-study platform for middle school students (girls), built with Node.js + Next.js.

## 技术栈 / Tech Stack
- **框架**: Next.js 16 (App Router), 静态导出 (`output: "export"`)
- **样式**: Tailwind CSS（柔和粉紫色调主题，非高饱和度）
- **数学公式渲染**: KaTeX（轻量、快速，支持分数、次方、开方、几何符号等）
- **内容格式**: YAML（课程结构和学习内容均使用 YAML 格式存储）
- **语言**: TypeScript
- **国际化**: 自研 React Context，支持中/英/双语三模式切换（默认双语模式）
- **部署**: GitHub Pages via GitHub Actions

## 三语模式 / Three Language Modes
- **双语（both）**：默认模式，中文在上、英文在下堆叠显示
- **中文（zh）**：纯中文显示
- **英文（en）**：纯英文显示
- 侧边栏使用分段控件（非循环按钮）切换语言
- `BiMathText` 组件负责在 "both" 模式下正确传递 `langOverride` 给 `MathText`
- 关键词高亮 `<<中文/English>>` 在双语模式下：中文行显示中文关键词，英文行显示英文关键词

## 双语字段约定 / Bilingual Field Convention
- YAML 中双语字段命名约定：中文用原字段名，英文加 `En` 后缀
  - 例如：`title` / `titleEn`，`question` / `questionEn`，`answer` / `answerEn`
  - 列表字段：`objectives` / `objectivesEn`，`steps` / `stepsEn`
- 组件通过 `useLang()` hook 获取当前语言
- UI 固定文案通过 `getUi(lang)` 获取
- 使用 `ContentBlock`（单字段）和 `ContentList`（数组字段）确保双语模式正确渲染

## 数学术语高亮 / Math Keyword Highlighting
- 在文本中，关键数学专有名词使用 `<<术语/Term>>` 标记
- 渲染时自动高亮显示（紫色加粗 + 底部虚线），hover 可看到双语对照
- 示例：`<<有理数/rational number>>` → 中文模式显示"有理数"高亮，英文模式显示"rational number"高亮
- 此标记可与 KaTeX `$...$` 共存，渲染顺序：先处理 `<<...>>`，再处理 `$...$`

## 数学公式规范 / Math Formula Conventions（重要）
- 使用 KaTeX 渲染所有数学公式，确保公式显示与课本一致
- **指数、次数、角标**：所有方程和系数中的上标、下标必须使用 KaTeX 角标写法
  - 次方使用 `x^{2}` 确保指数在右上角
  - 下标使用 `a_{n}` 确保下标在右下角
  - 系数和次数标注使用 `\underbrace{...}_{\text{...}}` 和 `\overbrace{...}^{\text{...}}`
  - 绝对禁止用纯文本写"2次"、"x2"等，必须用 `$x^2$`
- **分数**：使用 `\frac{a}{b}` 而非纯文本 `a/b`
- **根号**：使用 `\sqrt{x}` 或 `\sqrt[n]{x}`，根号线段必须完整覆盖被开方数
- **绝对值**：使用 `|x|` 或 `\left|x\right|`
- **几何符号**：使用对应 LaTeX 命令：`\angle`, `\triangle`, `\parallel`, `\perp`, `\overline{AB}`, `\overrightarrow{OA}` 等
- **行内公式**用 `$...$` 包裹，**独立公式**用 `$$...$$` 包裹
- **温度符号**：不要在 KaTeX 中使用 Unicode `℃`，渲染器会自动将 `℃` 替换为 `{}^{\circ}\text{C}`

## YAML 编写注意事项 / YAML Authoring Rules（重要）
- **LaTeX 反斜杠**：含 `\frac`、`\times`、`\div`、`\overline`、`\angle` 等 LaTeX 命令的字符串：
  - 若使用 YAML 双引号 `"..."` 包裹，反斜杠会被解释为转义（`\t`→制表符、`\f`→换页符），**必须双写** `\\frac`
  - 推荐方案：改用**单引号** `'...'` 包裹，或使用 YAML 块标量 `|`，这两种方式反斜杠原样保留
- **中文引号**：含中文引号 `"..."` 的字符串不能用 YAML 双引号包裹（会提前截断），必须用单引号 `'...'`
- 每次生成或修改 YAML 后，必须运行 `node -e "yaml.load(...)"` 验证解析无误

## 几何图形配图规范 / Geometry Diagram Requirements（重要）
- **所有几何相关的概念、例题、练习题都必须配图**
- 使用 SVG React 组件绘制（参考 `GeometryDiagrams.tsx` 和 `NumberLine.tsx`）
- 在 YAML 中通过 `hasVisualization: true` 标记需要配图的概念
- 在 `GeometryDiagrams.tsx` 的 `diagramMap` 中注册 concept ID 对应的 SVG 组件
- LessonView 中通过 `hasGeometryDiagram(concept.id)` 自动渲染
- 已实现的图示类型：
  - 直线/射线/线段对比图
  - 线段中点示意图
  - 角的概念图（顶点、射线、弧）
  - 角平分线示意图
  - 余角与补角对比图
  - 三视图（圆柱）
- 配色约定：紫色 `#8B5CF6` 为主线条，粉色 `#EC4899` 为标注点，灰色 `#6B7280` 为文字

## 章末提升题规范 / Challenge Section Guidelines
- 标签名为"章末提升"（英文 "Challenge"），**不要**称为"中考强化"或"中考模拟"
- 难度定位：高于课内练习的章末拓展题，帮助巩固和综合运用
- 不要声称"改编自中考真题"，除非确实按照北京中考命题口径和难度编写
- 每章 5 题，题型混合（选择、填空、解答）
- YAML 中 `examPrep.intro` 使用中性描述，不提"中考"

## 内容结构约定 / Content Structure
- 课程层级：学科 > 年级 > 学期 > 章节 > 知识点
- 每个章节的学习内容存放在 `website/src/data/math/grade7/` 下的 YAML 文件中
- 菜单结构由 `curriculum.yaml` 定义
- 每个知识点的 YAML 结构应包含（均需中英双语）：
  - `title` / `titleEn`: 标题
  - `objectives` / `objectivesEn`: 学习目标
  - `prerequisites`: 前置知识（从小学衔接）
  - `concepts`: 概念定义与讲解（几何概念必须含 `hasVisualization: true`）
  - `realLife`: 生活实例
  - `examples`: 题型精讲（每种类型一题）
  - `exercises`: 练习题（30分钟内完成）
  - `examPrep`: 章末提升题（5题）
  - `summary` / `summaryEn`: 学后总结
- "综合与实践"活动（如进位制探究、运动会场地设计）需在 YAML 中作为独立模块落地

## 交互设计约定 / Interactive Design
- 练习题和章末提升题使用统一的 `QuizSection` 组件
- 单题翻页模式，带题号导航器和自动判分
- 填空题、判断题、选择题支持自动判分
- Open 题显示 ✎ 标记，判分后自动展开答案供自评
- 题型精讲中的解题步骤使用 `Collapsible` 可逐步展开
- 数轴使用 `NumberLine` SVG 组件，几何图使用 `GeometryDiagram` SVG 组件

## 设计风格 / Design Style
- 品牌名：Xinbloom，Logo：🌸
- 主色调：柔和粉色 + 紫色渐变（pink-300/purple-300，非高饱和度）
- 背景色：`#fefbfd`（接近白色的极浅粉）
- 吉祥物：🐨考拉、🦙羊驼、🐼熊猫（用于内容区域装饰）
- 圆角卡片式布局，字体 16px，行高 1.7
- Tailwind 动态类名必须使用完整字符串（不能拼接 `bg-${var}`），通过 theme 对象传递

## 组件架构 / Component Architecture
- `LessonView.tsx`：主课程渲染组件，含 LearnTab、ExamplesTab、QuizSection
- `QuizSection`：统一的练习/提升题组件，通过 `QuizTheme` 对象控制配色
- `ContentBlock` / `ContentList`：双语内容渲染辅助组件
- `BiMathText`：双语模式下堆叠 zh/en 的 MathText 封装
- `MathText` / `MathBlock`：支持 `langOverride` 参数控制关键词语言
- `BiText` / `BiBlock` / `BiLabel`：通用双语文本组件
- `GeometryDiagrams.tsx`：几何 SVG 图示组件集合
- `NumberLine.tsx`：数轴 SVG 组件
- `Sidebar.tsx`：侧边栏导航 + 分段式语言切换

## Claude 配置约定 / Claude Settings Conventions
- 本地允许的命令应放在 `.claude/settings.local.json` 中，而非 `.claude/settings.json`
- `.claude/settings.json` 用于团队共享配置，不应包含本地特定的路径或命令

## 新章节开发流程 / Adding New Chapters
1. 在对应目录下创建 YAML 文件
2. 按照上述 YAML 结构填写内容，**所有面向学生的文本必须提供中英双语**
3. 在 `curriculum.yaml` 中注册新章节（设 `hasContent: true`）
4. 内容从小学知识衔接，结合日常生活
5. 确保所有数学公式使用 KaTeX 语法，**指数次数必须用角标**
6. 关键数学术语使用 `<<中文/English>>` 标记
7. 几何相关内容**必须配 SVG 图示**，在 `GeometryDiagrams.tsx` 中注册
8. 题型精讲每种类型一题，练习题控制在 30 分钟内
9. 章末提升 5 题，不称"中考模拟"
10. 练习题附带完整答案和讲解（中英双语）
11. 运行 YAML 验证 + `npx next build` 确认无误后提交
12. LaTeX 反斜杠注意 YAML 引号规则（优先用单引号或块标量）
