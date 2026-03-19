# Grade 9 Math — 九年级数学

对应教材：人教版（北京）九年级上下册
目标学生：小学 3 年级下，已完成八年级数学，英语 PET 水平
自学材料，由简入深，不面向竞赛或中考。

---

## 章节目录

### 上册（semester1，第 1–5 章）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 1 | `square-root-expressions.yaml` | 二次根式 | — |
| 2 | `quadratic-equations.yaml` | 一元二次方程 | — |
| 3 | `quadratic-functions.yaml` | 二次函数 | ❌ 3 个概念有 hasVisualization:true，diagramMap 尚未注册 |
| 4 | `rotation.yaml` | 旋转 | ❌ 5 个概念有 hasVisualization:true，diagramMap 尚未注册 |
| 5 | `inverse-proportion-functions.yaml` | 反比例函数 | ❌ 4 个概念有 hasVisualization:true，diagramMap 尚未注册 |

### 下册（semester2，第 6–9 章）

| 章 | 文件 | 标题 | SVG 图示状态 |
|----|------|------|-------------|
| 6 | `similar-figures.yaml` | 相似图形 | ❌ 6 个概念有 hasVisualization:true，diagramMap 尚未注册 |
| 7 | `trigonometric-functions.yaml` | 锐角三角函数 | ❌ 4 个概念有 hasVisualization:true，diagramMap 尚未注册 |
| 8 | `circles.yaml` | 圆 | ❌ 8 个概念有 hasVisualization:true，diagramMap 尚未注册 |
| 9 | `probability.yaml` | 概率 | — |

---

## 内容质量状态

### 已深度优化（含生活类比、动手探索）

- `quadratic-functions.yaml`：
  - `basic-parabola`：篮球抛物线类比 + 描点发现对称性 + 胖瘦宽窄对比表
- `trigonometric-functions.yaml`：
  - `trig-definition`：绳子拉到楼顶的引入问题 + 对边/邻边随角而变的警示 + SOH-CAH-TOA 中英对照

### 待改进（生成时内容较基础）

- `square-root-expressions.yaml`：二次根式化简规则可增加「开方 → 面积」几何类比
- `quadratic-equations.yaml`：求根公式推导过程可更分步，配方法需要动画式逐步说明
- `rotation.yaml`：严重缺图——旋转变换必须配图，所有 5 个概念急需 SVG
- `similar-figures.yaml`：相似比、AA/SAS/SSS 判定需配对比图示
- `trigonometric-functions.yaml`：直角三角形 + 标注三边名称的 SVG 是最关键的缺图
- `circles.yaml`：圆心角、弦、切线、割线等需要大量 SVG，8 个概念全部缺图
- `inverse-proportion-functions.yaml`：双曲线图象（第一/第三象限）SVG 缺失

---

## 图示注册状态（GeometryDiagrams.tsx）

grade9 目前**没有**任何 concept id 注册在 `diagramMap` 中。

优先级排序（建议依次补充）：
1. **trigonometric-functions**：直角三角形 + 三边标注（对边/邻边/斜边），特殊角值图
2. **rotation**：旋转变换示意图（原图 → 旋转后的图，旋转中心标注）
3. **circles**：圆的基本元素图（圆心、半径、直径、弦、弧、切线）
4. **quadratic-functions**：抛物线图象（y=x², y=ax², 顶点式平移对比）
5. **inverse-proportion-functions**：双曲线图象（第一/三象限，k>0 vs k<0）
6. **similar-figures**：相似三角形对比图（大小比例可视化）

---

## YAML 编写注意事项

- 含 LaTeX 反斜杠 → 用**单引号**或**块标量 `|`**
- `objectivesEn` 列表项含 `: ` → 必须单引号包裹
- 含英文撇号（如 `Boyle's`）→ 改用 YAML 双引号
- `rotation.yaml` 历史问题：`notesEn` 字段曾因 `: ` 导致解析为 mapping，已用 `—` 替换冒号修复
- 验证：`node -e "yaml.load(fs.readFileSync('xxx.yaml','utf8'))"`

---

## 已知问题与解决记录

| 问题 | 文件 | 解决方案 |
|------|------|---------|
| `objectivesEn` 列表项含 `: ` 解析为 mapping 对象 | 多个文件 | 批量脚本加单引号（已修复） |
| `notesEn: Common mistake: ...` 被解析为 mapping | rotation.yaml | 将 `:` 改为 `—` 并加单引号（已修复） |
| `Boyle's Law` 撇号在单引号字符串内截断 | inverse-proportion-functions.yaml | 改用双引号（已修复） |
