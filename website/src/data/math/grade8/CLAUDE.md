# Grade 8 Math — 八年级数学

对应教材：人教版（北京）八年级上下册
目标学生：小学 3 年级下，已完成七年级数学，英语 PET 水平
自学材料，由简入深，不面向竞赛或中考。

---

## 章节目录

### 上册（semester1，第 1–6 章 + AMC 8 扩展）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 1 | `triangles.yaml` | 三角形 | ✅ 6 个 SVG |
| 2 | `congruent-triangles.yaml` | 全等三角形 | ✅ 6 个 SVG |
| 3 | `line-symmetry.yaml` | 轴对称 | ✅ 7 个 SVG |
| 4 | `polynomial-multiplication.yaml` | 整式乘法 | — |
| 5 | `factorization.yaml` | 因式分解 | — |
| 6 | `algebraic-fractions.yaml` | 分式 | — |
| 🏆7 | `amc8-triangle-area.yaml` | AMC 8：三角形面积与海伦公式 | — |
| 🏆8 | `amc8-advanced-geometry.yaml` | AMC 8：几何进阶 | — |
| 🏆9 | `amc8-logic-strategy.yaml` | AMC 8：逻辑与策略 | — |

### 下册（semester2，第 7–10 章 + AMC 8 扩展）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 7 | `pythagorean-theorem.yaml` | 勾股定理 | ✅ 6 个 SVG |
| 8 | `quadrilaterals.yaml` | 四边形 | ❌ 待注册 SVG |
| 9 | `linear-functions.yaml` | 一次函数 | ❌ 待注册 SVG |
| 10 | `data-analysis.yaml` | 数据分析 | — |
| 🏆11 | `amc8-probability-intro.yaml` | AMC 8：概率入门 | — |

---

## AMC 8 扩展章节说明

八年级共 4 个 AMC 8 扩展章节，题目来源于 AoPS Wiki 抓取的 **2016–2024 年 AMC 8 真题**：

| 章节 | 题目数 | 覆盖的 AMC 8 差异 |
|------|--------|------------------|
| 三角形面积与海伦公式 | 21 | 海伦公式、坐标面积、鞋带公式、四边形分解（人教版未覆盖海伦公式） |
| 几何进阶 | 21 | 复合图形面积、坐标几何技巧、几何变换、圆与扇形面积 |
| 逻辑与策略 | 21 | 抽屉原理、奇偶分析、不变量、逆推排除（人教版未覆盖） |
| 概率入门 | 21 | 基础概率、计数求概率、独立事件、条件概率（人教版九年级才教，提前至八下） |

**重要**：所有标注 `source: "AMC 8 YYYY #N"` 的题目必须是真题，不得自行编写后虚假标注来源。

---

## 内容质量状态

### 已深度优化（含生活类比、动手探索、逐步推导）

- `triangles.yaml`：
  - `triangle-sides`：吸管实验 + 走路绕道类比 + 三步法 + 推论证明
  - `triangle-classification`：整理玩具类比 + 组合分类表
  - `triangle-special-lines`：雨滴/平衡点/内切圆类比 + 动手实验建议
  - `exterior-angle-theorem`：逐步推导，非直接给结论
- `congruent-triangles.yaml`：
  - `congruent-figures`：饼干切模类比 + 对应顺序详解 + 正反例

### 待改进（生成时内容较基础，适合后续深化）

- `line-symmetry.yaml`：内容结构完整，但各概念可增加「折纸/镜子」类比
- `polynomial-multiplication.yaml`、`factorization.yaml`、`algebraic-fractions.yaml`：代数章节，可增加「面积模型」图示辅助理解
- `quadrilaterals.yaml`：急需 SVG 图示（平行四边形、矩形、菱形、正方形、梯形各自配图）
- `linear-functions.yaml`：急需坐标系 SVG 图示（函数图象、斜率、截距可视化）
- `data-analysis.yaml`：可增加统计图示例（直方图、扇形图）

---

## 图示注册状态（GeometryDiagrams.tsx）

已注册的 concept id（grade8 部分）：
```
triangle-sides, triangle-classification, triangle-special-lines,
exterior-angle-theorem, polygon-angle-sum, triangle-stability,
congruent-figures, properties-of-congruent-triangles,
congruence-sss-sas, congruence-asa-aas, congruence-hl, auxiliary-lines,
pythagorean-theorem-discovery, pythagorean-theorem-statement,
pythagorean-applications, converse-theorem, pythagorean-triples,
special-right-triangles,
line-symmetric-figure, two-figures-symmetric, perpendicular-bisector,
angle-bisector-property, isosceles-triangle-properties,
isosceles-triangle-criterion, equilateral-triangle
```

待注册（quadrilaterals.yaml 的 hasVisualization 概念）：
```
parallelogram-properties, parallelogram-criteria, rectangle, rhombus,
square, trapezoid, midsegment-theorem
```

待注册（linear-functions.yaml 的 hasVisualization 概念）：
```
linear-function-definition, slope-intercept, graph-translation,
direct-proportion-function, function-applications
```
（以上 id 名称为推测，请以各文件内实际 id 字段为准）

---

## YAML 编写注意事项

- 含 LaTeX 反斜杠 → 用**单引号**或**块标量 `|`**
- `objectivesEn` 列表项含 `: ` → 必须单引号包裹
- 中文引号 `"..."` → 改用 YAML 单引号
- 单引号字符串内出现英文撇号（如 `Boyle's`）→ 改用 YAML 双引号
- 每次修改后验证：`node -e "yaml.load(fs.readFileSync('xxx.yaml','utf8'))"`
- 修改后运行 `npx next build` 确认所有页面无误（当前 108 页）

---

## 已知问题与解决记录

| 问题 | 文件 | 解决方案 |
|------|------|---------|
| `objectivesEn` 解析为 mapping 对象导致 `a.replace is not a function` | 多个文件 | 用自动化脚本批量加单引号（已修复） |
| `line-symmetry.yaml` 单引号字符串内含 `$A'` 的撇号截断 | line-symmetry.yaml | 改为块标量 `|` |
| `curriculum.yaml` 第 153 行缩进错误 | curriculum.yaml | 从 22 空格改为 14 空格（已修复） |
