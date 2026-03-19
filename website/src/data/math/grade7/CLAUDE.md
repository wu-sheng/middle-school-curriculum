# Grade 7 Math — 七年级数学

对应教材：人教版（北京）七年级上下册
目标学生：小学 3 年级下，已完成小学数学，英语 PET 水平
自学材料，由简入深，不面向竞赛或中考。

---

## 章节目录

### 上册（semester1，第 1–6 章）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 1 | `rational-numbers.yaml` | 有理数 | ✅ 有数轴 SVG（NumberLine 组件） |
| 2 | `operations-rational-numbers.yaml` | 有理数的运算 | — |
| 3 | `algebraic-expressions.yaml` | 代数式 | — |
| 4 | `polynomials.yaml` | 整式的加减 | — |
| 5 | `linear-equations.yaml` | 一元一次方程 | — |
| 6 | `geometric-figures.yaml` | 几何图形初步 | ✅ 已有 SVG（ThreeViews, LineTypes, SegmentMidpoint, AngleDiagram, AngleBisector, ComplementarySupplementary） |

### 下册（semester2，第 7–12 章）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 7 | `intersecting-parallel-lines.yaml` | 相交线与平行线 | ✅ 已有 SVG（VerticalAdjacentAngles, PerpendicularLines, TransversalAngles, ParallelCriteria, ParallelProperties, PropositionDiagram） |
| 8 | `real-numbers.yaml` | 实数 | — |
| 9 | `coordinate-system.yaml` | 平面直角坐标系 | ✅ 已有 SVG（CartesianSystem, OrderedPairDiagram, CoordinateTranslation） |
| 10 | `systems-of-equations.yaml` | 二元一次方程组 | — |
| 11 | `inequalities.yaml` | 不等式与不等式组 | — |
| 12 | `data-collection.yaml` | 数据的收集、整理与描述 | — |

---

## 内容质量状态

- **已深度优化**：geometric-figures、intersecting-parallel-lines、coordinate-system（含完整 SVG 图示）
- **待改进**：rational-numbers、real-numbers、inequalities 的内容深度——可参照 grade8/triangles.yaml 改进风格，增加「动手探索」开头 + 生活类比
- **数轴相关章节**：使用 `NumberLine` SVG 组件（独立于 `GeometryDiagrams.tsx`）

---

## YAML 编写注意事项

- 含 LaTeX 反斜杠的字符串必须用**单引号**或**块标量 `|`**包裹（双引号会转义 `\t` `\f` 等）
- `objectivesEn` 列表项中若含 `: `（冒号+空格），必须用单引号包裹，否则 YAML 解析为 mapping
- 验证命令：`node -e "const yaml=require('js-yaml'),fs=require('fs');yaml.load(fs.readFileSync('xxx.yaml','utf8'))"`
- 中文引号 `"..."` 不能放在 YAML 双引号字符串内，改用单引号

---

## 组件对照

- `hasVisualization: true` → 在 `GeometryDiagrams.tsx` 的 `diagramMap` 中注册对应 concept id
- 数轴用 `NumberLine` 组件，不走 `GeometryDiagrams`
- 概念内容长文本用 `MathBlock`（内部会按 `\n\n` 分段为 `<p>`，改善文字选取体验）
