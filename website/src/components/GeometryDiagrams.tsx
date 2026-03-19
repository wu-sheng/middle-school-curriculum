"use client";

const purple = "#8B5CF6";
const pink = "#EC4899";
const gray = "#6B7280";
const amber = "#F59E0B";
const lightGray = "#D1D5DB";

function Wrapper({ children, width = 500, height = 200 }: { children: React.ReactNode; width?: number; height?: number }) {
  return (
    <div className="flex justify-center my-4 overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full">
        {children}
      </svg>
    </div>
  );
}

function Label({ x, y, text, color = gray, size = 13, anchor = "middle" }: {
  x: number; y: number; text: string; color?: string; size?: number; anchor?: "middle" | "start" | "end";
}) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} fontFamily="serif">{text}</text>;
}

function Dot({ x, y, color = pink, r = 4 }: { x: number; y: number; color?: string; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={color} />;
}

/** Diagram: straight line, ray, line segment comparison */
function LineTypes() {
  const y1 = 40, y2 = 90, y3 = 140;
  const labelX = 480;
  return (
    <Wrapper width={500} height={180}>
      {/* Straight line - extends both ways with arrows */}
      <line x1={30} y1={y1} x2={370} y2={y1} stroke={purple} strokeWidth={2} />
      <polygon points={`25,${y1} 35,${y1 - 5} 35,${y1 + 5}`} fill={purple} />
      <polygon points={`375,${y1} 365,${y1 - 5} 365,${y1 + 5}`} fill={purple} />
      <Dot x={150} y={y1} />
      <Dot x={260} y={y1} />
      <Label x={150} y={y1 - 12} text="A" color={pink} />
      <Label x={260} y={y1 - 12} text="B" color={pink} />
      <Label x={labelX} y={y1 + 5} text="直线 AB" color={gray} size={12} anchor="end" />

      {/* Ray - one endpoint, one arrow */}
      <Dot x={80} y={y2} r={5} />
      <line x1={80} y1={y2} x2={370} y2={y2} stroke={purple} strokeWidth={2} />
      <polygon points={`375,${y2} 365,${y2 - 5} 365,${y2 + 5}`} fill={purple} />
      <Label x={80} y={y2 - 12} text="O" color={pink} />
      <Label x={240} y={y2 - 12} text="A" color={gray} />
      <Dot x={240} y={y2} color={gray} r={3} />
      <Label x={labelX} y={y2 + 5} text="射线 OA" color={gray} size={12} anchor="end" />

      {/* Line segment - two endpoints */}
      <Dot x={100} y={y3} r={5} />
      <Dot x={310} y={y3} r={5} />
      <line x1={100} y1={y3} x2={310} y2={y3} stroke={purple} strokeWidth={2} />
      <Label x={100} y={y3 - 12} text="A" color={pink} />
      <Label x={310} y={y3 - 12} text="B" color={pink} />
      <Label x={labelX} y={y3 + 5} text="线段 AB" color={gray} size={12} anchor="end" />
    </Wrapper>
  );
}

/** Diagram: midpoint of a segment */
function SegmentMidpoint() {
  const y = 60;
  return (
    <Wrapper width={440} height={110}>
      <line x1={60} y1={y} x2={380} y2={y} stroke={purple} strokeWidth={2} />
      <Dot x={60} y={y} r={5} />
      <Dot x={380} y={y} r={5} />
      <Dot x={220} y={y} r={5} color="#F59E0B" />
      <Label x={60} y={y - 14} text="A" color={pink} />
      <Label x={380} y={y - 14} text="B" color={pink} />
      <Label x={220} y={y - 14} text="C" color="#F59E0B" />
      {/* AC = CB marks */}
      <line x1={100} y1={y + 20} x2={180} y2={y + 20} stroke={gray} strokeWidth={1} />
      <Label x={140} y={y + 36} text="AC" color={gray} size={11} />
      <line x1={260} y1={y + 20} x2={340} y2={y + 20} stroke={gray} strokeWidth={1} />
      <Label x={300} y={y + 36} text="CB" color={gray} size={11} />
      <Label x={220} y={y + 50} text="AC = CB = ½AB" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: angle with vertex and two rays */
function AngleDiagram() {
  const cx = 100, cy = 130;
  return (
    <Wrapper width={360} height={180}>
      {/* Ray OA - horizontal */}
      <line x1={cx} y1={cy} x2={320} y2={cy} stroke={purple} strokeWidth={2} />
      <polygon points={`325,${cy} 315,${cy - 5} 315,${cy + 5}`} fill={purple} />
      {/* Ray OB - angled up */}
      <line x1={cx} y1={cy} x2={290} y2={30} stroke={purple} strokeWidth={2} />
      <polygon points="293,25 282,30 288,40" fill={purple} />
      {/* Arc for angle */}
      <path d={`M ${cx + 50},${cy} A 50 50 0 0 0 ${cx + 40},${cy - 30}`} fill="none" stroke={pink} strokeWidth={1.5} />
      {/* Labels */}
      <Dot x={cx} y={cy} r={5} />
      <Label x={cx - 10} y={cy + 18} text="O" color={pink} />
      <Label x={325} y={cy + 18} text="A" color={purple} />
      <Label x={298} y={25} text="B" color={purple} />
      <Label x={cx + 60} y={cy - 10} text="∠AOB" color={pink} size={14} anchor="start" />
    </Wrapper>
  );
}

/** Diagram: complementary and supplementary angles */
function ComplementarySupplementary() {
  return (
    <Wrapper width={520} height={180}>
      {/* Complementary: two angles summing to 90° */}
      <g>
        <Label x={120} y={16} text="互余 (90°)" color={purple} size={13} />
        {/* Right angle */}
        <line x1={40} y1={150} x2={200} y2={150} stroke={purple} strokeWidth={2} />
        <line x1={40} y1={150} x2={40} y2={30} stroke={purple} strokeWidth={2} />
        {/* Dividing ray */}
        <line x1={40} y1={150} x2={180} y2={50} stroke={pink} strokeWidth={1.5} strokeDasharray="4,3" />
        {/* Right angle square */}
        <polyline points="55,150 55,135 40,135" fill="none" stroke={gray} strokeWidth={1} />
        {/* Labels */}
        <Label x={80} y={130} text="α" color={pink} size={15} />
        <Label x={55} y={95} text="β" color="#F59E0B" size={15} />
        <Label x={120} y={170} text="α + β = 90°" color={gray} size={12} />
      </g>

      {/* Supplementary: two angles summing to 180° */}
      <g>
        <Label x={390} y={16} text="互补 (180°)" color={purple} size={13} />
        {/* Straight angle */}
        <line x1={280} y1={110} x2={500} y2={110} stroke={purple} strokeWidth={2} />
        {/* Upper ray */}
        <line x1={390} y1={110} x2={340} y2={30} stroke={purple} strokeWidth={2} />
        {/* Labels */}
        <Dot x={390} y={110} r={4} />
        <Label x={355} y={100} text="α" color={pink} size={15} />
        <Label x={430} y={100} text="β" color="#F59E0B" size={15} />
        <Label x={390} y={145} text="α + β = 180°" color={gray} size={12} />
        {/* Small arcs */}
        <path d="M 375,110 A 15 15 0 0 0 382,97" fill="none" stroke={pink} strokeWidth={1.5} />
        <path d="M 405,110 A 15 15 0 0 1 398,97" fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      </g>
    </Wrapper>
  );
}

/** Diagram: angle bisector */
function AngleBisector() {
  const cx = 80, cy = 140;
  return (
    <Wrapper width={380} height={180}>
      {/* Ray OA */}
      <line x1={cx} y1={cy} x2={340} y2={cy} stroke={purple} strokeWidth={2} />
      <polygon points={`345,${cy} 335,${cy - 5} 335,${cy + 5}`} fill={purple} />
      {/* Ray OB */}
      <line x1={cx} y1={cy} x2={310} y2={20} stroke={purple} strokeWidth={2} />
      <polygon points="313,15 302,20 308,30" fill={purple} />
      {/* Bisector OC (dashed) */}
      <line x1={cx} y1={cy} x2={340} y2={60} stroke={pink} strokeWidth={1.5} strokeDasharray="5,4" />
      {/* Equal angle marks */}
      <path d={`M ${cx + 40},${cy} A 40 40 0 0 0 ${cx + 38},${cy - 14}`} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={`M ${cx + 45},${cy} A 45 45 0 0 0 ${cx + 43},${cy - 16}`} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={`M ${cx + 30},${cy - 8} A 30 30 0 0 0 ${cx + 24},${cy - 20}`} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={`M ${cx + 35},${cy - 9} A 35 35 0 0 0 ${cx + 28},${cy - 23}`} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      {/* Labels */}
      <Dot x={cx} y={cy} r={5} />
      <Label x={cx - 12} y={cy + 16} text="O" color={pink} />
      <Label x={345} y={cy + 16} text="A" color={purple} />
      <Label x={315} y={15} text="B" color={purple} />
      <Label x={345} y={55} text="C" color={pink} />
      <Label x={200} y={170} text="∠BOC = ∠COA = ½∠BOA" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: three views of a cylinder */
function ThreeViews() {
  const cx = 80, topY = 50, botY = 150, rx = 40, ry = 14;
  return (
    <Wrapper width={620} height={210}>
      {/* 3D Cylinder */}
      <g>
        {/* Side surface */}
        <line x1={cx - rx} y1={topY} x2={cx - rx} y2={botY} stroke={purple} strokeWidth={2} />
        <line x1={cx + rx} y1={topY} x2={cx + rx} y2={botY} stroke={purple} strokeWidth={2} />
        {/* Bottom ellipse */}
        <ellipse cx={cx} cy={botY} rx={rx} ry={ry} fill="none" stroke={purple} strokeWidth={2} />
        {/* Top ellipse - back half dashed */}
        <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="none" stroke={purple} strokeWidth={2} strokeDasharray="none" />
        <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="none" stroke={purple} strokeWidth={1.2} strokeDasharray="4,3"
          clipPath="url(#topBack)" />
        <defs>
          <clipPath id="topBack">
            <rect x={cx - rx - 2} y={topY} width={2 * rx + 4} height={ry + 2} />
          </clipPath>
        </defs>
        {/* Dashed center axis */}
        <line x1={cx} y1={topY - ry - 5} x2={cx} y2={botY + ry + 5} stroke={gray} strokeWidth={1} strokeDasharray="3,3" />
        <Label x={cx} y={195} text="圆柱体" color={purple} size={12} />
      </g>

      {/* Arrow from 3D to views */}
      <line x1={135} y1={100} x2={160} y2={100} stroke={lightGray} strokeWidth={1.5} />
      <polygon points="163,100 155,96 155,104" fill={lightGray} />

      {/* Front view: rectangle */}
      <g>
        <rect x={180} y={45} width={80} height={110} fill="none" stroke={purple} strokeWidth={2} rx={2} />
        <Label x={220} y={175} text="正视图" color={gray} size={12} />
        <Label x={220} y={190} text="(长方形)" color={lightGray} size={10} />
      </g>
      {/* Side view: rectangle */}
      <g>
        <rect x={300} y={45} width={80} height={110} fill="none" stroke={purple} strokeWidth={2} rx={2} />
        <Label x={340} y={175} text="侧视图" color={gray} size={12} />
        <Label x={340} y={190} text="(长方形)" color={lightGray} size={10} />
      </g>
      {/* Top view: circle */}
      <g>
        <circle cx={490} cy={100} r={50} fill="none" stroke={purple} strokeWidth={2} />
        <Dot x={490} y={100} r={2} color={gray} />
        <Label x={490} y={175} text="俯视图" color={gray} size={12} />
        <Label x={490} y={190} text="(圆)" color={lightGray} size={10} />
      </g>
      {/* Title */}
      <Label x={310} y={20} text="圆柱的三视图" color={purple} size={14} />
    </Wrapper>
  );
}

/** Diagram: Cartesian coordinate system with quadrants and example points */
function CartesianSystem() {
  // Origin at (200, 200), scale: 40px per unit, range: -4 to 4
  const ox = 200, oy = 200, s = 40;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;

  const gridLines: React.ReactNode[] = [];
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    // vertical grid line
    gridLines.push(
      <line key={`gv${i}`} x1={toX(i)} y1={toY(-4)} x2={toX(i)} y2={toY(4)} stroke={lightGray} strokeWidth={0.5} strokeDasharray="3,3" />
    );
    // horizontal grid line
    gridLines.push(
      <line key={`gh${i}`} x1={toX(-4)} y1={toY(i)} x2={toX(4)} y2={toY(i)} stroke={lightGray} strokeWidth={0.5} strokeDasharray="3,3" />
    );
  }

  // Tick marks and numbers
  const ticks: React.ReactNode[] = [];
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    ticks.push(
      <line key={`tx${i}`} x1={toX(i)} y1={oy - 3} x2={toX(i)} y2={oy + 3} stroke={purple} strokeWidth={1} />
    );
    ticks.push(
      <Label key={`lx${i}`} x={toX(i)} y={oy + 16} text={`${i}`} color={gray} size={10} />
    );
    ticks.push(
      <line key={`ty${i}`} x1={ox - 3} y1={toY(i)} x2={ox + 3} y2={toY(i)} stroke={purple} strokeWidth={1} />
    );
    ticks.push(
      <Label key={`ly${i}`} x={ox - 14} y={toY(i) + 4} text={`${i}`} color={gray} size={10} />
    );
  }

  const points: { label: string; coords: string; x: number; y: number; color: string }[] = [
    { label: "A", coords: "(3,2)", x: 3, y: 2, color: pink },
    { label: "B", coords: "(-2,3)", x: -2, y: 3, color: pink },
    { label: "C", coords: "(-3,-1)", x: -3, y: -1, color: amber },
    { label: "D", coords: "(2,-2)", x: 2, y: -2, color: amber },
  ];

  return (
    <Wrapper width={420} height={420}>
      {/* Grid lines */}
      {gridLines}
      {/* X-axis */}
      <line x1={toX(-4.5)} y1={oy} x2={toX(4.5)} y2={oy} stroke={purple} strokeWidth={2} />
      <polygon points={`${toX(4.5) + 5},${oy} ${toX(4.5) - 3},${oy - 4} ${toX(4.5) - 3},${oy + 4}`} fill={purple} />
      <Label x={toX(4.5) + 5} y={oy + 16} text="x" color={purple} size={14} />
      {/* Y-axis */}
      <line x1={ox} y1={toY(-4.5)} x2={ox} y2={toY(4.5)} stroke={purple} strokeWidth={2} />
      <polygon points={`${ox},${toY(4.5) - 5} ${ox - 4},${toY(4.5) + 3} ${ox + 4},${toY(4.5) + 3}`} fill={purple} />
      <Label x={ox + 14} y={toY(4.5)} text="y" color={purple} size={14} />
      {/* Origin label */}
      <Label x={ox - 14} y={oy + 16} text="O" color={purple} size={13} />
      {/* Tick marks and numbers */}
      {ticks}
      {/* Quadrant labels */}
      <Label x={toX(2)} y={toY(3.3)} text="第一象限 I" color={gray} size={12} />
      <Label x={toX(-2)} y={toY(3.3)} text="第二象限 II" color={gray} size={12} />
      <Label x={toX(-2)} y={toY(-3.3)} text="第三象限 III" color={gray} size={12} />
      <Label x={toX(2)} y={toY(-3.3)} text="第四象限 IV" color={gray} size={12} />
      {/* Example points */}
      {points.map((p) => (
        <g key={p.label}>
          <Dot x={toX(p.x)} y={toY(p.y)} color={p.color} r={4} />
          <Label x={toX(p.x) + 8} y={toY(p.y) - 8} text={`${p.label}${p.coords}`} color={p.color} size={11} anchor="start" />
        </g>
      ))}
    </Wrapper>
  );
}

/** Diagram: ordered pair shown on a seating grid */
function OrderedPairDiagram() {
  const left = 60, top = 40, cellW = 50, cellH = 40;
  const cols = 5, rows = 4;
  const highlightCol = 3, highlightRow = 2; // 1-indexed

  const gridElements: React.ReactNode[] = [];
  // Draw grid cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = left + c * cellW;
      const y = top + r * cellH;
      const isHighlight = c + 1 === highlightCol && rows - r === highlightRow;
      gridElements.push(
        <rect key={`cell${r}-${c}`} x={x} y={y} width={cellW} height={cellH}
          fill={isHighlight ? "#EDE9FE" : "none"} stroke={lightGray} strokeWidth={1} />
      );
      if (isHighlight) {
        gridElements.push(
          <Dot key="hlDot" x={x + cellW / 2} y={y + cellH / 2} color={pink} r={6} />
        );
      }
    }
  }

  return (
    <Wrapper width={420} height={260}>
      {/* Title */}
      <Label x={210} y={24} text="座位表（列, 排）" color={purple} size={14} />
      {gridElements}
      {/* Column labels at bottom */}
      {Array.from({ length: cols }, (_, c) => (
        <Label key={`cl${c}`} x={left + c * cellW + cellW / 2} y={top + rows * cellH + 18} text={`第${c + 1}列`} color={gray} size={10} />
      ))}
      {/* Row labels at left - row 1 at bottom */}
      {Array.from({ length: rows }, (_, r) => (
        <Label key={`rl${r}`} x={left - 8} y={top + r * cellH + cellH / 2 + 4} text={`第${rows - r}排`} color={gray} size={10} anchor="end" />
      ))}
      {/* Highlight label */}
      <Label x={left + (highlightCol - 1) * cellW + cellW / 2} y={top + (rows - highlightRow) * cellH - 8} text="有序数对 (3, 2)" color={pink} size={13} />
      {/* Annotation arrow pointing to the highlighted cell */}
      <line x1={left + (highlightCol - 1) * cellW + cellW / 2} y1={top + (rows - highlightRow) * cellH - 2}
        x2={left + (highlightCol - 1) * cellW + cellW / 2} y2={top + (rows - highlightRow) * cellH + 6}
        stroke={pink} strokeWidth={1.5} />
      <polygon points={`${left + (highlightCol - 1) * cellW + cellW / 2},${top + (rows - highlightRow) * cellH + 10} ${left + (highlightCol - 1) * cellW + cellW / 2 - 3},${top + (rows - highlightRow) * cellH + 5} ${left + (highlightCol - 1) * cellW + cellW / 2 + 3},${top + (rows - highlightRow) * cellH + 5}`} fill={pink} />
      {/* Explanation */}
      <Label x={210} y={top + rows * cellH + 42} text="第3列第2排 → (3, 2)    注意：(3,2) ≠ (2,3)" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: coordinate translation of triangle ABC to A'B'C' */
function CoordinateTranslation() {
  // Origin at (180, 220), scale 30px per unit
  const ox = 180, oy = 220, s = 30;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;

  // Original triangle vertices
  const A = { x: 1, y: 1 }, B = { x: 4, y: 1 }, C = { x: 2, y: 4 };
  // Translation: right 4, up 2
  const dx = 4, dy = 2;
  const Ap = { x: A.x + dx, y: A.y + dy };
  const Bp = { x: B.x + dx, y: B.y + dy };
  const Cp = { x: C.x + dx, y: C.y + dy };

  // Grid lines (light)
  const gridLines: React.ReactNode[] = [];
  for (let i = -2; i <= 10; i++) {
    gridLines.push(
      <line key={`gv${i}`} x1={toX(i)} y1={toY(-2)} x2={toX(i)} y2={toY(8)} stroke={lightGray} strokeWidth={0.5} strokeDasharray="3,3" />
    );
  }
  for (let i = -2; i <= 8; i++) {
    gridLines.push(
      <line key={`gh${i}`} x1={toX(-2)} y1={toY(i)} x2={toX(10)} y2={toY(i)} stroke={lightGray} strokeWidth={0.5} strokeDasharray="3,3" />
    );
  }

  // Tick marks
  const ticks: React.ReactNode[] = [];
  for (let i = -1; i <= 9; i++) {
    if (i === 0) continue;
    ticks.push(<line key={`tx${i}`} x1={toX(i)} y1={oy - 2} x2={toX(i)} y2={oy + 2} stroke={purple} strokeWidth={0.8} />);
    if (i % 2 === 0) ticks.push(<Label key={`lx${i}`} x={toX(i)} y={oy + 14} text={`${i}`} color={gray} size={9} />);
  }
  for (let i = -1; i <= 7; i++) {
    if (i === 0) continue;
    ticks.push(<line key={`ty${i}`} x1={ox - 2} y1={toY(i)} x2={ox + 2} y2={toY(i)} stroke={purple} strokeWidth={0.8} />);
    if (i % 2 === 0) ticks.push(<Label key={`ly${i}`} x={ox - 12} y={toY(i) + 4} text={`${i}`} color={gray} size={9} />);
  }

  const trianglePath = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) =>
    `M ${toX(p1.x)},${toY(p1.y)} L ${toX(p2.x)},${toY(p2.y)} L ${toX(p3.x)},${toY(p3.y)} Z`;

  return (
    <Wrapper width={520} height={340}>
      {gridLines}
      {/* X-axis */}
      <line x1={toX(-2)} y1={oy} x2={toX(10)} y2={oy} stroke={purple} strokeWidth={1.5} />
      <polygon points={`${toX(10) + 5},${oy} ${toX(10) - 3},${oy - 3} ${toX(10) - 3},${oy + 3}`} fill={purple} />
      <Label x={toX(10) + 5} y={oy + 14} text="x" color={purple} size={12} />
      {/* Y-axis */}
      <line x1={ox} y1={toY(-2)} x2={ox} y2={toY(8)} stroke={purple} strokeWidth={1.5} />
      <polygon points={`${ox},${toY(8) - 5} ${ox - 3},${toY(8) + 3} ${ox + 3},${toY(8) + 3}`} fill={purple} />
      <Label x={ox + 12} y={toY(8)} text="y" color={purple} size={12} />
      <Label x={ox - 12} y={oy + 14} text="O" color={purple} size={11} />
      {ticks}
      {/* Original triangle ABC */}
      <path d={trianglePath(A, B, C)} fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={2} />
      <Dot x={toX(A.x)} y={toY(A.y)} color={purple} r={3} />
      <Dot x={toX(B.x)} y={toY(B.y)} color={purple} r={3} />
      <Dot x={toX(C.x)} y={toY(C.y)} color={purple} r={3} />
      <Label x={toX(A.x) - 8} y={toY(A.y) + 14} text={`A(${A.x},${A.y})`} color={purple} size={10} anchor="end" />
      <Label x={toX(B.x) + 4} y={toY(B.y) + 14} text={`B(${B.x},${B.y})`} color={purple} size={10} anchor="start" />
      <Label x={toX(C.x) - 4} y={toY(C.y) - 6} text={`C(${C.x},${C.y})`} color={purple} size={10} anchor="end" />
      {/* Translated triangle A'B'C' */}
      <path d={trianglePath(Ap, Bp, Cp)} fill="rgba(236,72,153,0.1)" stroke={pink} strokeWidth={2} />
      <Dot x={toX(Ap.x)} y={toY(Ap.y)} color={pink} r={3} />
      <Dot x={toX(Bp.x)} y={toY(Bp.y)} color={pink} r={3} />
      <Dot x={toX(Cp.x)} y={toY(Cp.y)} color={pink} r={3} />
      <Label x={toX(Ap.x) - 4} y={toY(Ap.y) + 14} text={`A'(${Ap.x},${Ap.y})`} color={pink} size={10} anchor="end" />
      <Label x={toX(Bp.x) + 4} y={toY(Bp.y) + 14} text={`B'(${Bp.x},${Bp.y})`} color={pink} size={10} anchor="start" />
      <Label x={toX(Cp.x) + 4} y={toY(Cp.y) - 6} text={`C'(${Cp.x},${Cp.y})`} color={pink} size={10} anchor="start" />
      {/* Dashed translation arrows */}
      {[[A, Ap], [B, Bp], [C, Cp]].map(([from, to], i) => (
        <g key={`arrow${i}`}>
          <line x1={toX(from.x)} y1={toY(from.y)} x2={toX(to.x)} y2={toY(to.y)}
            stroke={amber} strokeWidth={1.2} strokeDasharray="5,3" />
          <polygon points={`${toX(to.x)},${toY(to.y)} ${toX(to.x) - 5},${toY(to.y) + 3} ${toX(to.x) - 3},${toY(to.y) - 5}`} fill={amber} />
        </g>
      ))}
      {/* Translation label */}
      <Label x={350} y={20} text={`平移：右${dx}，上${dy}`} color={amber} size={12} />
      <Label x={350} y={36} text={`(x,y)→(x+${dx}, y+${dy})`} color={gray} size={11} />
    </Wrapper>
  );
}

// ── Chapter 7: 相交线与平行线 ──

/** Diagram: vertical angles and adjacent supplementary angles */
function VerticalAdjacentAngles() {
  const cx = 250, cy = 100;
  const r = 30; // arc radius
  // Line a: horizontal
  // Line b: tilted ~55° from horizontal
  const ang = 55 * Math.PI / 180;
  const len = 130;
  // Line a endpoints
  const ax1 = cx - len, ay1 = cy, ax2 = cx + len, ay2 = cy;
  // Line b endpoints (going from lower-left to upper-right)
  const bx1 = cx - len * Math.cos(ang), by1 = cy + len * Math.sin(ang);
  const bx2 = cx + len * Math.cos(ang), by2 = cy - len * Math.sin(ang);
  // Arc points at radius r from center for each of the 4 rays
  // Ray directions (angle from positive x-axis, y-down): right=0°, upper-right=-55°, left=180°, lower-left=125°
  const p = (a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const right = p(0);
  const upRight = p(-ang);
  const left = p(Math.PI);
  const downLeft = p(Math.PI - ang);
  // ∠1: between upper-right ray and right ray (above horizontal, right side) — acute angle
  // ∠2: between right ray and lower-left direction of line b (below horizontal, right side) — obtuse angle
  // ∠3: between lower-left ray and left ray (below horizontal, left side) — acute, vertical to ∠1
  // ∠4: between left ray and upper-right direction of line b (above horizontal, left side) — obtuse, vertical to ∠2
  return (
    <Wrapper width={500} height={230}>
      {/* Line a: horizontal */}
      <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke={purple} strokeWidth={2} />
      {/* Line b: tilted */}
      <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={4} />
      {/* ∠1 arc: from upper-right ray to right ray (small angle, clockwise) */}
      <path d={`M ${upRight.x},${upRight.y} A ${r} ${r} 0 0 1 ${right.x},${right.y}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={cx + 34} y={cy - 20} text="∠1" color={pink} size={13} />
      {/* ∠2 arc: from right ray to down-left ray (large angle going clockwise below) */}
      <path d={`M ${right.x},${right.y} A ${r} ${r} 0 0 1 ${downLeft.x},${downLeft.y}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={cx + 10} y={cy + 36} text="∠2" color={amber} size={13} />
      {/* ∠3 arc: from down-left ray to left ray (small angle, clockwise) — vertical to ∠1 */}
      <path d={`M ${downLeft.x},${downLeft.y} A ${r} ${r} 0 0 1 ${left.x},${left.y}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={cx - 38} y={cy + 22} text="∠3" color={pink} size={13} />
      {/* ∠4 arc: from left ray to upper-right ray (large angle going clockwise above) */}
      <path d={`M ${left.x},${left.y} A ${r} ${r} 0 0 1 ${upRight.x},${upRight.y}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={cx - 16} y={cy - 30} text="∠4" color={amber} size={13} />
      {/* Labels for lines */}
      <Label x={ax2 + 6} y={ay2 - 8} text="a" color={purple} size={13} anchor="start" />
      <Label x={bx2 + 4} y={by2 - 4} text="b" color={purple} size={13} anchor="start" />
      {/* Annotations */}
      <Label x={250} y={200} text="对顶角: ∠1 = ∠3, ∠2 = ∠4" color={purple} size={13} />
      <Label x={250} y={220} text="邻补角: ∠1 + ∠2 = 180°" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: perpendicular lines with shortest distance */
function PerpendicularLines() {
  const baseY = 150, hx = 250;
  return (
    <Wrapper width={500} height={220}>
      {/* Horizontal line l */}
      <line x1={40} y1={baseY} x2={460} y2={baseY} stroke={purple} strokeWidth={2} />
      <Label x={465} y={baseY + 5} text="l" color={purple} size={14} anchor="start" />
      {/* Perpendicular line through H */}
      <line x1={hx} y1={30} x2={hx} y2={baseY} stroke={purple} strokeWidth={2} />
      {/* Right-angle square mark */}
      <polyline points={`${hx + 15},${baseY} ${hx + 15},${baseY - 15} ${hx},${baseY - 15}`} fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Point P above */}
      <Dot x={hx} y={50} r={5} />
      <Label x={hx + 12} y={46} text="P" color={pink} size={14} anchor="start" />
      {/* Foot H */}
      <Dot x={hx} y={baseY} r={5} />
      <Label x={hx + 10} y={baseY + 18} text="H" color={pink} size={14} anchor="start" />
      {/* Oblique line from P to Q for comparison */}
      <line x1={hx} y1={50} x2={370} y2={baseY} stroke={lightGray} strokeWidth={1.5} strokeDasharray="5,4" />
      <Dot x={370} y={baseY} r={3} color={lightGray} />
      <Label x={375} y={baseY + 18} text="Q" color={lightGray} size={13} anchor="start" />
      {/* PH label */}
      <Label x={hx - 14} y={100} text="PH" color={pink} size={12} anchor="end" />
      {/* Annotation */}
      <Label x={250} y={200} text="PH ⊥ l，PH 是点 P 到直线 l 的距离（最短）" color={gray} size={12} />
    </Wrapper>
  );
}

/**
 * Shared base: two parallel lines a, b cut by transversal c.
 * Standard 8-angle numbering (课本标准):
 *   At line a: ∠1 (upper-right), ∠2 (upper-left), ∠3 (lower-left), ∠4 (lower-right)
 *   At line b: ∠5 (upper-right), ∠6 (upper-left), ∠7 (lower-left), ∠8 (lower-right)
 * Returns intersection x-coordinates and renders the base lines.
 */
function TwoLinesTransversal({ children, width = 500, height = 260, showParallel = false }: {
  children: (ix1: number, y1: number, ix2: number, y2: number, arcR: number) => React.ReactNode;
  width?: number; height?: number; showParallel?: boolean;
}) {
  const y1 = 60, y2 = 160;
  const tx1 = 155, ty1 = 10, tx2 = 305, ty2 = 210;
  const slope = (tx2 - tx1) / (ty2 - ty1);
  const ix1 = tx1 + slope * (y1 - ty1);
  const ix2 = tx1 + slope * (y2 - ty1);
  const arcR = 24;
  return (
    <Wrapper width={width} height={height}>
      <line x1={50} y1={y1} x2={430} y2={y1} stroke={purple} strokeWidth={2} />
      <line x1={50} y1={y2} x2={430} y2={y2} stroke={purple} strokeWidth={2} />
      <Label x={435} y={y1 - 8} text="a" color={purple} size={13} anchor="start" />
      <Label x={435} y={y2 - 8} text="b" color={purple} size={13} anchor="start" />
      {showParallel && <>
        <Label x={340} y={y1 - 4} text="▸▸" color={amber} size={10} />
        <Label x={340} y={y2 - 4} text="▸▸" color={amber} size={10} />
      </>}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={purple} strokeWidth={2} />
      <Label x={tx1 - 6} y={ty1 + 4} text="c" color={purple} size={13} anchor="end" />
      <Dot x={ix1} y={y1} r={4} />
      <Dot x={ix2} y={y2} r={4} />
      {children(ix1, y1, ix2, y2, arcR)}
    </Wrapper>
  );
}

/* Arc helpers for the 8 standard angles at an intersection */
function arcUpperRight(ix: number, y: number, r: number) {
  return `M ${ix + r},${y} A ${r} ${r} 0 0 0 ${ix + r * 0.38},${y - r * 0.92}`;
}
function arcUpperLeft(ix: number, y: number, r: number) {
  return `M ${ix - r * 0.38},${y - r * 0.92} A ${r} ${r} 0 0 0 ${ix - r},${y}`;
}
function arcLowerLeft(ix: number, y: number, r: number) {
  return `M ${ix - r},${y} A ${r} ${r} 0 0 0 ${ix - r * 0.38},${y + r * 0.92}`;
}
function arcLowerRight(ix: number, y: number, r: number) {
  return `M ${ix + r * 0.38},${y + r * 0.92} A ${r} ${r} 0 0 0 ${ix + r},${y}`;
}

/** Diagram: angles formed by a transversal cutting two parallel lines — all 8 angles */
function TransversalAngles() {
  return (
    <TwoLinesTransversal width={500} height={260} showParallel>
      {(ix1, y1, ix2, y2, r) => (<>
        {/* Line a: ∠1 upper-right, ∠2 upper-left, ∠3 lower-left, ∠4 lower-right */}
        <path d={arcUpperRight(ix1, y1, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix1 + 30} y={y1 - 10} text="∠1" color={pink} size={11} anchor="start" />
        <path d={arcUpperLeft(ix1, y1, r)} fill="none" stroke={gray} strokeWidth={1} />
        <Label x={ix1 - 30} y={y1 - 10} text="∠2" color={gray} size={10} anchor="end" />
        <path d={arcLowerLeft(ix1, y1, r)} fill="none" stroke={amber} strokeWidth={2} />
        <Label x={ix1 - 30} y={y1 + 24} text="∠3" color={amber} size={11} anchor="end" />
        <path d={arcLowerRight(ix1, y1, r)} fill="none" stroke="#10B981" strokeWidth={2} />
        <Label x={ix1 + 30} y={y1 + 24} text="∠4" color="#10B981" size={11} anchor="start" />
        {/* Line b: ∠5 upper-right, ∠6 upper-left, ∠7 lower-left, ∠8 lower-right */}
        <path d={arcUpperRight(ix2, y2, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix2 + 30} y={y2 - 10} text="∠5" color={pink} size={11} anchor="start" />
        <path d={arcUpperLeft(ix2, y2, r)} fill="none" stroke={gray} strokeWidth={1} />
        <Label x={ix2 - 30} y={y2 - 10} text="∠6" color={gray} size={10} anchor="end" />
        <path d={arcLowerLeft(ix2, y2, r)} fill="none" stroke={gray} strokeWidth={1} />
        <Label x={ix2 - 30} y={y2 + 24} text="∠7" color={gray} size={10} anchor="end" />
        <path d={arcLowerRight(ix2, y2, r)} fill="none" stroke={gray} strokeWidth={1} />
        <Label x={ix2 + 30} y={y2 + 24} text="∠8" color={gray} size={10} anchor="start" />
        {/* Legend */}
        <Label x={250} y={220} text="同位角(F形): ∠1与∠5　内错角(Z形): ∠3与∠5" color={gray} size={11} />
        <Label x={250} y={240} text="同旁内角(U形): ∠4与∠5" color={gray} size={11} />
      </>)}
    </TwoLinesTransversal>
  );
}

/** Diagram: criteria for parallel lines — ∠1=∠5 → a∥b */
function ParallelCriteria() {
  return (
    <TwoLinesTransversal width={500} height={260}>
      {(ix1, y1, ix2, y2, r) => (<>
        {/* ∠1 at line a (upper-right) */}
        <path d={arcUpperRight(ix1, y1, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix1 + 30} y={y1 - 10} text="∠1" color={pink} size={12} anchor="start" />
        {/* ∠3 at line a (lower-left) */}
        <path d={arcLowerLeft(ix1, y1, r)} fill="none" stroke={amber} strokeWidth={2} />
        <Label x={ix1 - 30} y={y1 + 24} text="∠3" color={amber} size={12} anchor="end" />
        {/* ∠5 at line b (upper-right) */}
        <path d={arcUpperRight(ix2, y2, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix2 + 30} y={y2 - 10} text="∠5" color={pink} size={12} anchor="start" />
        {/* Conclusion */}
        <Label x={250} y={215} text="∠1 = ∠5（同位角相等）→ a ∥ b" color={pink} size={12} />
        <Label x={250} y={235} text="∠3 = ∠5（内错角相等）→ a ∥ b" color={amber} size={12} />
        <Label x={250} y={255} text="∠3 + ∠5 = 180°（同旁内角互补）→ a ∥ b" color="#10B981" size={11} />
      </>)}
    </TwoLinesTransversal>
  );
}

/** Diagram: properties of parallel lines — a∥b → angle relationships */
function ParallelProperties() {
  return (
    <TwoLinesTransversal width={520} height={280} showParallel>
      {(ix1, y1, ix2, y2, r) => (<>
        {/* ∠1 at line a (upper-right) — corresponding to ∠5 */}
        <path d={arcUpperRight(ix1, y1, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix1 + 30} y={y1 - 10} text="∠1" color={pink} size={11} anchor="start" />
        {/* ∠3 at line a (lower-left) — alternate interior with ∠5 */}
        <path d={arcLowerLeft(ix1, y1, r)} fill="none" stroke={amber} strokeWidth={2} />
        <Label x={ix1 - 30} y={y1 + 24} text="∠3" color={amber} size={11} anchor="end" />
        {/* ∠4 at line a (lower-right) — co-interior with ∠5 */}
        <path d={arcLowerRight(ix1, y1, r)} fill="none" stroke="#10B981" strokeWidth={2} />
        <Label x={ix1 + 30} y={y1 + 24} text="∠4" color="#10B981" size={11} anchor="start" />
        {/* ∠5 at line b (upper-right) */}
        <path d={arcUpperRight(ix2, y2, r)} fill="none" stroke={pink} strokeWidth={2} />
        <Label x={ix2 + 30} y={y2 - 10} text="∠5" color={pink} size={11} anchor="start" />
        {/* Three properties */}
        <Label x={260} y={215} text="a ∥ b →" color={purple} size={13} />
        <Label x={260} y={235} text="同位角相等: ∠1 = ∠5　内错角相等: ∠3 = ∠5" color={gray} size={11} />
        <Label x={260} y={255} text="同旁内角互补: ∠4 + ∠5 = 180°" color={gray} size={11} />
      </>)}
    </TwoLinesTransversal>
  );
}

/** Diagram: propositions, theorems, and proofs — vertical angles example */
function PropositionDiagram() {
  const cx = 250, cy = 90;
  const len = 90;
  return (
    <Wrapper width={500} height={230}>
      {/* Title: if...then... structure */}
      <rect x={80} y={10} width={340} height={36} rx={6} fill="none" stroke={purple} strokeWidth={1.5} />
      <Label x={250} y={33} text="命题结构: 如果……那么……" color={purple} size={14} />
      {/* Two intersecting lines */}
      <line x1={cx - len} y1={cy - 55} x2={cx + len} y2={cy + 55} stroke={purple} strokeWidth={2} />
      <line x1={cx - len} y1={cy + 55} x2={cx + len} y2={cy - 55} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={4} />
      {/* Mark equal vertical angle pair 1 */}
      <path d={`M ${cx + 20},${cy - 10} A 22 22 0 0 1 ${cx + 10},${cy + 20}`} fill="none" stroke={pink} strokeWidth={2} />
      <path d={`M ${cx - 20},${cy + 10} A 22 22 0 0 1 ${cx - 10},${cy - 20}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={cx + 26} y={cy + 10} text="α" color={pink} size={13} anchor="start" />
      <Label x={cx - 26} y={cy + 4} text="α" color={pink} size={13} anchor="end" />
      {/* Mark equal vertical angle pair 2 */}
      <path d={`M ${cx - 20},${cy - 10} A 22 22 0 0 0 ${cx - 10},${cy + 20}`} fill="none" stroke={amber} strokeWidth={2} />
      <path d={`M ${cx + 20},${cy + 10} A 22 22 0 0 0 ${cx + 10},${cy - 20}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={cx - 26} y={cy - 6} text="β" color={amber} size={13} anchor="end" />
      <Label x={cx + 26} y={cy - 2} text="β" color={amber} size={13} anchor="start" />
      {/* Proposition text */}
      <rect x={60} y={170} width={380} height={44} rx={6} fill="none" stroke={gray} strokeWidth={1} strokeDasharray="4,3" />
      <Label x={250} y={190} text="如果 两条直线相交" color={gray} size={12} />
      <Label x={250} y={208} text="那么 对顶角相等（α = α, β = β）" color={pink} size={12} />
    </Wrapper>
  );
}

/** Triangle inequality: visual proof that a+b > c */
function TriangleSides() {
  // Triangle with sides labeled
  const ax = 60, ay = 160, bx = 380, by = 160, cx = 180, cy = 40;
  // Degenerate "triangle" (flat) for counter-example
  const dx = 60, dy = 230, ex = 380, ey = 230, fx = 440, fy = 230;
  return (
    <Wrapper width={500} height={270}>
      {/* Valid triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} /><Label x={ax - 10} y={ay + 15} text="A" color={pink} />
      <Dot x={bx} y={by} /><Label x={bx + 8} y={by + 15} text="B" color={pink} />
      <Dot x={cx} y={cy} /><Label x={cx} y={cy - 10} text="C" color={pink} />
      {/* Side labels */}
      <Label x={(ax + bx) / 2} y={ay + 16} text="c" color={gray} />
      <Label x={(ax + cx) / 2 - 14} y={(ay + cy) / 2} text="b" color={purple} />
      <Label x={(bx + cx) / 2 + 14} y={(by + cy) / 2} text="a" color={purple} />
      {/* Inequality label */}
      <rect x={170} y={75} width={170} height={26} rx={5} fill="#EDE9FE" />
      <Label x={255} y={93} text="a + b > c  ✓" color={purple} size={13} />
      {/* Degenerate case */}
      <line x1={dx} y1={dy} x2={ex} y2={ey} stroke={gray} strokeWidth={1.5} strokeDasharray="5,3" />
      <line x1={ex} y1={ey} x2={fx} y2={fy} stroke={gray} strokeWidth={1.5} strokeDasharray="5,3" />
      <Dot x={dx} y={dy} color={gray} /><Label x={dx - 8} y={dy + 14} text="A" color={gray} size={11} />
      <Dot x={ex} y={ey} color={gray} /><Label x={ex} y={ey + 14} text="B" color={gray} size={11} />
      <Dot x={fx} y={fy} color={gray} /><Label x={fx + 6} y={fy + 14} text="C" color={gray} size={11} />
      <Label x={220} y={ey + 14} text="三点共线 → 不构成三角形" color={gray} size={11} />
      <Label x={220} y={ey + 28} text="(a + b = c 时退化)" color={gray} size={11} />
    </Wrapper>
  );
}

/** Triangle classification by sides and angles */
function TriangleClassification() {
  return (
    <Wrapper width={500} height={200}>
      {/* Scalene */}
      <polygon points="40,170 130,170 70,60" fill="none" stroke={gray} strokeWidth={2} />
      <Label x={80} y={190} text="不等边" color={gray} size={12} />
      {/* Isosceles */}
      <polygon points="170,170 290,170 230,55" fill="none" stroke={purple} strokeWidth={2} />
      <line x1={177} y1={155} x2={183} y2={158} stroke={purple} strokeWidth={1.5} />
      <line x1={176} y1={148} x2={182} y2={151} stroke={purple} strokeWidth={1.5} />
      <line x1={283} y1={155} x2={277} y2={158} stroke={purple} strokeWidth={1.5} />
      <line x1={284} y1={148} x2={278} y2={151} stroke={purple} strokeWidth={1.5} />
      <Label x={230} y={190} text="等腰" color={purple} size={12} />
      {/* Equilateral */}
      <polygon points="330,170 430,170 380,83" fill="none" stroke={pink} strokeWidth={2} />
      <line x1={337} y1={155} x2={343} y2={158} stroke={pink} strokeWidth={1.5} />
      <line x1={336} y1={148} x2={342} y2={151} stroke={pink} strokeWidth={1.5} />
      <line x1={423} y1={155} x2={417} y2={158} stroke={pink} strokeWidth={1.5} />
      <line x1={424} y1={148} x2={418} y2={151} stroke={pink} strokeWidth={1.5} />
      <line x1={380} y1={86} x2={374} y2={97} stroke={pink} strokeWidth={1.5} />
      <line x1={380} y1={86} x2={386} y2={97} stroke={pink} strokeWidth={1.5} />
      <Label x={380} y={190} text="等边" color={pink} size={12} />
      {/* Legend */}
      <Label x={250} y={20} text="按边分类" color={gray} size={13} />
    </Wrapper>
  );
}

/** Triangle special lines: altitude, median, angle bisector */
function TriangleSpecialLines() {
  const ax = 80, ay = 170, bx = 400, by = 170, cx = 200, cy = 40;
  const mx = (ax + bx) / 2, my = (ay + by) / 2; // midpoint of AB
  // Foot of altitude from C to AB (perpendicular to AB, so x stays, y = ay)
  const hx = cx, hy = ay;
  // Angle bisector from C to AB (approx midpoint of arc)
  const ibx = (ax + bx) / 2 + 20, iby = ay;
  return (
    <Wrapper width={500} height={210}>
      {/* Triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#FAF5FF" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} /><Label x={ax - 12} y={ay + 14} text="A" color={pink} />
      <Dot x={bx} y={by} /><Label x={bx + 8} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} /><Label x={cx} y={cy - 12} text="C" color={pink} />
      {/* Altitude (blue) from C to AB */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#3B82F6" strokeWidth={1.8} strokeDasharray="6,3" />
      <rect x={hx - 8} y={hy - 8} width={8} height={8} fill="none" stroke="#3B82F6" strokeWidth={1.5} />
      <Label x={hx + 12} y={hy - 6} text="高 H" color="#3B82F6" size={11} anchor="start" />
      {/* Median (purple) from C to midpoint of AB */}
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke={purple} strokeWidth={1.8} strokeDasharray="4,2" />
      <Dot x={mx} y={my} color={purple} r={3} />
      <Label x={mx} y={my + 14} text="M(中点)" color={purple} size={10} />
      <Label x={(cx + mx) / 2 + 15} y={(cy + my) / 2} text="中线" color={purple} size={11} anchor="start" />
      {/* Angle bisector (pink) from C */}
      <line x1={cx} y1={cy} x2={ibx} y2={iby} stroke={pink} strokeWidth={1.8} strokeDasharray="3,3" />
      <Label x={ibx + 6} y={iby - 6} text="角平分线" color={pink} size={11} anchor="start" />
    </Wrapper>
  );
}

/** Exterior angle theorem */
function ExteriorAngleTheorem() {
  const ax = 80, ay = 160, bx = 350, by = 160, cx = 200, cy = 50;
  const ex = 450, ey = 160; // extended point beyond B
  return (
    <Wrapper width={500} height={210}>
      {/* Triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#FAF5FF" stroke={purple} strokeWidth={2} />
      {/* Extension of AB beyond B */}
      <line x1={bx} y1={by} x2={ex} y2={ey} stroke={gray} strokeWidth={2} strokeDasharray="6,3" />
      <polygon points={`${ex},${ey} ${ex - 10},${ey - 5} ${ex - 10},${ey + 5}`} fill={gray} />
      {/* Labels */}
      <Dot x={ax} y={ay} /><Label x={ax - 12} y={ay + 14} text="A" color={pink} />
      <Dot x={bx} y={by} /><Label x={bx} y={by + 16} text="B" color={pink} />
      <Dot x={cx} y={cy} /><Label x={cx} y={cy - 12} text="C" color={pink} />
      <Label x={ex + 6} y={ey + 5} text="D" color={gray} anchor="start" />
      {/* Interior angle arcs */}
      <path d={`M ${ax + 28},${ay} A 28 28 0 0 0 ${ax + 18},${ay - 26}`} fill="none" stroke="#3B82F6" strokeWidth={2} />
      <Label x={ax + 38} y={ay - 12} text="∠A" color="#3B82F6" size={12} anchor="start" />
      <path d={`M ${cx - 14},${cy + 28} A 28 28 0 0 0 ${cx + 14},${cy + 28}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={cx + 20} y={cy + 32} text="∠C" color={amber} size={12} anchor="start" />
      {/* Exterior angle arc */}
      <path d={`M ${bx + 30},${by - 10} A 32 32 0 0 0 ${bx + 28},${by - 30}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={bx + 36} y={by - 22} text="∠CBD" color={pink} size={12} anchor="start" />
      {/* Theorem text */}
      <rect x={50} y={178} width={400} height={24} rx={5} fill="#FEF3C7" />
      <Label x={250} y={195} text="∠CBD = ∠A + ∠C  (外角 = 不相邻两内角之和)" color={amber} size={12} />
    </Wrapper>
  );
}

/** Polygon angle sum: triangulation of polygons */
function PolygonAngleSum() {
  // Pentagon divided into triangles from one vertex
  const pts: [number, number][] = [[250, 30], [420, 120], [370, 200], [130, 200], [80, 120]];
  const [v0x, v0y] = pts[0];
  return (
    <Wrapper width={500} height={230}>
      {/* Pentagon */}
      <polygon points={pts.map(p => p.join(",")).join(" ")} fill="#FAF5FF" stroke={purple} strokeWidth={2} />
      {/* Diagonals from vertex 0 */}
      {pts.slice(2, pts.length - 1).map(([px, py], i) => (
        <line key={i} x1={v0x} y1={v0y} x2={px} y2={py} stroke={pink} strokeWidth={1.5} strokeDasharray="5,3" />
      ))}
      {/* Vertex labels */}
      {pts.map(([px, py], i) => {
        const lx = px + (px < 250 ? -16 : px > 250 ? 10 : 0);
        const ly = py + (py < 100 ? -10 : 16);
        return <Label key={i} x={lx} y={ly} text={String.fromCharCode(65 + i)} color={pink} size={13} />;
      })}
      {/* Triangle count annotation */}
      <rect x={145} y={85} width={210} height={42} rx={6} fill="rgba(255,255,255,0.9)" />
      <Label x={250} y={103} text="5边形 = 3个三角形" color={purple} size={13} />
      <Label x={250} y={120} text="内角和 = 3×180° = 540°" color={purple} size={13} />
      {/* Formula */}
      <rect x={100} y={205} width={300} height={22} rx={5} fill="#EDE9FE" />
      <Label x={250} y={221} text="n边形内角和 = (n−2)×180°" color={purple} size={13} />
    </Wrapper>
  );
}

/** Triangle rigidity / stability */
function TriangleStability() {
  return (
    <Wrapper width={500} height={200}>
      {/* Rigid triangle */}
      <polygon points="60,170 200,170 130,60" fill="#F0FDF4" stroke="#16A34A" strokeWidth={2.5} />
      <Label x={130} y={190} text="三角形：刚性" color="#16A34A" size={12} />
      <Label x={130} y={48} text="✓" color="#16A34A" size={18} />
      {/* Deformable quadrilateral */}
      <polygon points="260,170 420,170 440,70 240,70" fill="#FFF7ED" stroke="#EA580C" strokeWidth={2} />
      <Label x={340} y={190} text="四边形：可变形" color="#EA580C" size={12} />
      {/* Deformed quadrilateral (dashed) */}
      <polygon points="260,170 420,170 400,90 280,90" fill="none" stroke="#EA580C" strokeWidth={1.5} strokeDasharray="5,3" />
      <Label x={340} y={56} text="↕ 可变" color="#EA580C" size={12} />
      {/* Arrow showing deformation */}
      <path d="M 380,75 Q 395,80 395,95" fill="none" stroke="#EA580C" strokeWidth={1.5} />
      <polygon points="393,97 399,90 387,91" fill="#EA580C" />
      {/* Brace comparison */}
      <line x1={220} y1={30} x2={220} y2={185} stroke={lightGray} strokeWidth={1} strokeDasharray="3,3" />
      <Label x={250} y={20} text="对比" color={gray} size={11} />
    </Wrapper>
  );
}

// ── Chapter: 全等三角形 (Congruent Triangles) ──

/** Diagram: congruent figures — two triangles with matching marks */
function CongruentFigures() {
  // Left triangle △ABC
  const ax = 50, ay = 160, bx = 180, by = 160, cx = 100, cy = 50;
  // Right triangle △DEF (same shape, shifted right)
  const dx = 290, dy = 160, ex = 420, ey = 160, fx = 340, fy = 50;
  // Tick mark helper: draw one perpendicular tick at midpoint of line
  function tick(x1: number, y1: number, x2: number, y2: number, n: number, color: string, offset = 0) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
    const marks = [];
    for (let i = 0; i < n; i++) {
      const shift = (i - (n - 1) / 2) * 5;
      const sx = (x2 - x1) / len * shift, sy = (y2 - y1) / len * shift;
      marks.push(
        <line key={`t${i}${offset}`} x1={mx + px + sx} y1={my + py + sy} x2={mx - px + sx} y2={my - py + sy}
          stroke={color} strokeWidth={1.8} />
      );
    }
    return marks;
  }
  return (
    <Wrapper width={500} height={200}>
      {/* △ABC */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax - 12} y={ay + 14} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx + 6} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx} y={cy - 10} text="C" color={pink} />
      {/* Tick marks: AB=1 tick, BC=2 ticks, CA=3 ticks */}
      {tick(ax, ay, bx, by, 1, "#3B82F6", 0)}
      {tick(bx, by, cx, cy, 2, "#10B981", 10)}
      {tick(cx, cy, ax, ay, 3, amber, 20)}
      {/* Angle arcs at A, B, C */}
      <path d="M 65,160 A 16 16 0 0 0 57,145" fill="none" stroke="#3B82F6" strokeWidth={1.8} />
      <path d="M 168,160 A 16 16 0 0 1 173,144" fill="none" stroke="#10B981" strokeWidth={1.8} />
      <path d="M 90,62 A 16 16 0 0 1 110,62" fill="none" stroke={amber} strokeWidth={1.8} />

      {/* △DEF */}
      <polygon points={`${dx},${dy} ${ex},${ey} ${fx},${fy}`} fill="rgba(236,72,153,0.08)" stroke={pink} strokeWidth={2} />
      <Dot x={dx} y={dy} color={purple} r={3} /><Label x={dx - 12} y={dy + 14} text="D" color={purple} />
      <Dot x={ex} y={ey} color={purple} r={3} /><Label x={ex + 6} y={ey + 14} text="E" color={purple} />
      <Dot x={fx} y={fy} color={purple} r={3} /><Label x={fx} y={fy - 10} text="F" color={purple} />
      {/* Same tick marks on DEF */}
      {tick(dx, dy, ex, ey, 1, "#3B82F6", 1)}
      {tick(ex, ey, fx, fy, 2, "#10B981", 11)}
      {tick(fx, fy, dx, dy, 3, amber, 21)}
      {/* Angle arcs at D, E, F */}
      <path d="M 305,160 A 16 16 0 0 0 297,145" fill="none" stroke="#3B82F6" strokeWidth={1.8} />
      <path d="M 408,160 A 16 16 0 0 1 413,144" fill="none" stroke="#10B981" strokeWidth={1.8} />
      <path d="M 330,62 A 16 16 0 0 1 350,62" fill="none" stroke={amber} strokeWidth={1.8} />

      {/* Congruence symbol and label */}
      <Label x={230} y={105} text="≅" color={purple} size={22} />
      <Label x={230} y={185} text="△ABC ≅ △DEF（全等形）" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: properties of congruent triangles — matching sides and angles */
function PropertiesOfCongruentTriangles() {
  // Left △ABC
  const ax = 50, ay = 165, bx = 185, by = 165, cx = 105, cy = 50;
  // Right △DEF
  const dx = 295, dy = 165, ex = 430, ey = 165, fx = 350, fy = 50;
  const red = "#EF4444", blue = "#3B82F6", green = "#16A34A";
  function midTick(x1: number, y1: number, x2: number, y2: number, n: number, color: string, id: string) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
    return Array.from({ length: n }, (_, i) => {
      const shift = (i - (n - 1) / 2) * 5;
      const sx = (x2 - x1) / len * shift, sy = (y2 - y1) / len * shift;
      return <line key={`${id}${i}`} x1={mx + px + sx} y1={my + py + sy} x2={mx - px + sx} y2={my - py + sy}
        stroke={color} strokeWidth={1.8} />;
    });
  }
  return (
    <Wrapper width={500} height={200}>
      {/* △ABC */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.06)" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax - 12} y={ay + 14} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx + 6} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx} y={cy - 10} text="C" color={pink} />
      {/* AB=DE red tick, BC=EF blue tick, CA=FD green tick */}
      {midTick(ax, ay, bx, by, 1, red, "ab")}
      {midTick(bx, by, cx, cy, 2, blue, "bc")}
      {midTick(cx, cy, ax, ay, 3, green, "ca")}
      {/* ∠A red arc, ∠B blue arc, ∠C green arc */}
      <path d="M 66,165 A 18 18 0 0 0 58,148" fill="none" stroke={red} strokeWidth={2} />
      <path d="M 172,165 A 18 18 0 0 1 178,148" fill="none" stroke={blue} strokeWidth={2} />
      <path d="M 94,64 A 18 18 0 0 1 117,64" fill="none" stroke={green} strokeWidth={2} />

      {/* △DEF */}
      <polygon points={`${dx},${dy} ${ex},${ey} ${fx},${fy}`} fill="rgba(236,72,153,0.06)" stroke={pink} strokeWidth={2} />
      <Dot x={dx} y={dy} color={purple} r={3} /><Label x={dx - 12} y={dy + 14} text="D" color={purple} />
      <Dot x={ex} y={ey} color={purple} r={3} /><Label x={ex + 6} y={ey + 14} text="E" color={purple} />
      <Dot x={fx} y={fy} color={purple} r={3} /><Label x={fx} y={fy - 10} text="F" color={purple} />
      {midTick(dx, dy, ex, ey, 1, red, "de")}
      {midTick(ex, ey, fx, fy, 2, blue, "ef")}
      {midTick(fx, fy, dx, dy, 3, green, "fd")}
      <path d="M 311,165 A 18 18 0 0 0 303,148" fill="none" stroke={red} strokeWidth={2} />
      <path d="M 417,165 A 18 18 0 0 1 423,148" fill="none" stroke={blue} strokeWidth={2} />
      <path d="M 339,64 A 18 18 0 0 1 362,64" fill="none" stroke={green} strokeWidth={2} />

      <Label x={230} y={100} text="≅" color={purple} size={22} />
      <Label x={230} y={185} text="对应边相等 · 对应角相等" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: SSS and SAS congruence criteria */
function CongruenceSssSas() {
  // Helper: draw a triangle and tick marks on its sides
  function tri(pts: [number, number][], ticks: number[], colors: string[], angleIdx: number, angleColor: string, id: string) {
    const [p0, p1, p2] = pts;
    const sides = [[p0, p1], [p1, p2], [p2, p0]] as [[number, number], [number, number]][];
    const tickMarks: React.ReactNode[] = [];
    sides.forEach(([a, b], si) => {
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const len = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
      const px = -(b[1] - a[1]) / len * 6, py = (b[0] - a[0]) / len * 6;
      for (let k = 0; k < ticks[si]; k++) {
        const shift = (k - (ticks[si] - 1) / 2) * 5;
        const sx = (b[0] - a[0]) / len * shift, sy = (b[1] - a[1]) / len * shift;
        tickMarks.push(<line key={`${id}s${si}k${k}`} x1={mx + px + sx} y1={my + py + sy} x2={mx - px + sx} y2={my - py + sy}
          stroke={colors[si]} strokeWidth={1.8} />);
      }
    });
    // Angle arc at vertex angleIdx
    const vx = pts[angleIdx][0], vy = pts[angleIdx][1];
    const prev = pts[(angleIdx + 2) % 3], next = pts[(angleIdx + 1) % 3];
    const a1x = vx + (prev[0] - vx) / Math.hypot(prev[0] - vx, prev[1] - vy) * 20;
    const a1y = vy + (prev[1] - vy) / Math.hypot(prev[0] - vx, prev[1] - vy) * 20;
    const a2x = vx + (next[0] - vx) / Math.hypot(next[0] - vx, next[1] - vy) * 20;
    const a2y = vy + (next[1] - vy) / Math.hypot(next[0] - vx, next[1] - vy) * 20;
    return (
      <g key={id}>
        <polygon points={pts.map(p => p.join(",")).join(" ")} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
        {tickMarks}
        <path d={`M ${a1x},${a1y} Q ${vx},${vy} ${a2x},${a2y}`} fill="none" stroke={angleColor} strokeWidth={1.8} />
      </g>
    );
  }
  const red = "#EF4444", blue = "#3B82F6", green = "#16A34A";
  // SSS panel — two triangles, left side
  const sssPts1: [number, number][] = [[40, 175], [160, 175], [90, 75]];
  const sssPts2: [number, number][] = [[40, 210], [160, 210], [90, 110]];
  // SAS panel — two triangles, right side
  const sasPts1: [number, number][] = [[290, 175], [410, 175], [330, 75]];
  const sasPts2: [number, number][] = [[290, 210], [410, 210], [330, 110]];
  return (
    <Wrapper width={500} height={230}>
      {/* Divider */}
      <line x1={240} y1={10} x2={240} y2={220} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />
      {/* SSS label */}
      <Label x={120} y={22} text="SSS（边边边）" color={purple} size={13} />
      {tri(sssPts1, [1, 2, 3], [red, blue, green], 0, "transparent", "sss1")}
      {tri(sssPts2, [1, 2, 3], [red, blue, green], 0, "transparent", "sss2")}
      <Label x={120} y={215} text="三边对应相等 → 全等" color={gray} size={11} />
      {/* SAS label */}
      <Label x={360} y={22} text="SAS（边角边）" color={purple} size={13} />
      {tri(sasPts1, [2, 1, 0], [green, blue, red], 0, amber, "sas1")}
      {tri(sasPts2, [2, 1, 0], [green, blue, red], 0, amber, "sas2")}
      <Label x={360} y={215} text="两边及夹角相等 → 全等" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: ASA and AAS congruence criteria */
function CongruenceAsaAas() {
  const red = "#EF4444", blue = "#3B82F6", green = "#16A34A";
  // ASA panel
  const asaPts1: [number, number][] = [[40, 175], [170, 175], [100, 70]];
  const asaPts2: [number, number][] = [[40, 210], [170, 210], [100, 105]];
  // AAS panel
  const aasPts1: [number, number][] = [[290, 175], [420, 175], [350, 70]];
  const aasPts2: [number, number][] = [[290, 210], [420, 210], [350, 105]];

  function sideTickMid(x1: number, y1: number, x2: number, y2: number, n: number, color: string, id: string) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const px = -(y2 - y1) / len * 6, py = (x2 - x1) / len * 6;
    return Array.from({ length: n }, (_, k) => {
      const shift = (k - (n - 1) / 2) * 5;
      const sx = (x2 - x1) / len * shift, sy = (y2 - y1) / len * shift;
      return <line key={`${id}${k}`} x1={mx + px + sx} y1={my + py + sy} x2={mx - px + sx} y2={my - py + sy}
        stroke={color} strokeWidth={1.8} />;
    });
  }
  function angleArc(pts: [number, number][], vi: number, color: string, id: string) {
    const vx = pts[vi][0], vy = pts[vi][1];
    const prev = pts[(vi + 2) % 3], next = pts[(vi + 1) % 3];
    const d1 = Math.hypot(prev[0] - vx, prev[1] - vy), d2 = Math.hypot(next[0] - vx, next[1] - vy);
    const a1x = vx + (prev[0] - vx) / d1 * 18, a1y = vy + (prev[1] - vy) / d1 * 18;
    const a2x = vx + (next[0] - vx) / d2 * 18, a2y = vy + (next[1] - vy) / d2 * 18;
    return <path key={id} d={`M ${a1x},${a1y} Q ${vx},${vy} ${a2x},${a2y}`} fill="none" stroke={color} strokeWidth={1.8} />;
  }
  return (
    <Wrapper width={500} height={230}>
      <line x1={245} y1={10} x2={245} y2={220} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />
      {/* ASA */}
      <Label x={120} y={22} text="ASA（角边角）" color={purple} size={13} />
      {([asaPts1, asaPts2] as [number, number][][]).map((pts, ti) => (
        <g key={`asa${ti}`}>
          <polygon points={(pts as [number, number][]).map(p => p.join(",")).join(" ")} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
          {sideTickMid(pts[0][0], pts[0][1], pts[1][0], pts[1][1], 2, red, `asabot${ti}`)}
          {angleArc(pts as [number, number][], 0, blue, `asaA${ti}`)}
          {angleArc(pts as [number, number][], 1, green, `asaB${ti}`)}
        </g>
      ))}
      <Label x={120} y={215} text="两角及夹边相等 → 全等" color={gray} size={11} />
      {/* AAS */}
      <Label x={370} y={22} text="AAS（角角边）" color={purple} size={13} />
      {([aasPts1, aasPts2] as [number, number][][]).map((pts, ti) => (
        <g key={`aas${ti}`}>
          <polygon points={(pts as [number, number][]).map(p => p.join(",")).join(" ")} fill="rgba(236,72,153,0.07)" stroke={pink} strokeWidth={2} />
          {sideTickMid(pts[1][0], pts[1][1], pts[2][0], pts[2][1], 1, red, `aasside${ti}`)}
          {angleArc(pts as [number, number][], 0, blue, `aasA${ti}`)}
          {angleArc(pts as [number, number][], 2, green, `aasC${ti}`)}
        </g>
      ))}
      <Label x={370} y={215} text="两角及非夹边相等 → 全等" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: HL congruence for right triangles */
function CongruenceHL() {
  // Left right triangle: right angle at bottom-left
  const l1ax = 60, l1ay = 160, l1bx = 60, l1by = 50, l1cx = 200, l1cy = 160;
  // Right right triangle: right angle at bottom-left
  const l2ax = 280, l2ay = 160, l2bx = 280, l2by = 50, l2cx = 420, l2cy = 160;
  function sideTick(x1: number, y1: number, x2: number, y2: number, n: number, color: string, id: string) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const px = -(y2 - y1) / len * 6, py = (x2 - x1) / len * 6;
    return Array.from({ length: n }, (_, k) => {
      const shift = (k - (n - 1) / 2) * 5;
      const sx = (x2 - x1) / len * shift, sy = (y2 - y1) / len * shift;
      return <line key={`${id}${k}`} x1={mx + px + sx} y1={my + py + sy} x2={mx - px + sx} y2={my - py + sy}
        stroke={color} strokeWidth={1.8} />;
    });
  }
  return (
    <Wrapper width={460} height={200}>
      {/* Left triangle */}
      <polygon points={`${l1ax},${l1ay} ${l1bx},${l1by} ${l1cx},${l1cy}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      {/* Right angle mark */}
      <polyline points={`${l1ax},${l1ay - 14} ${l1ax + 14},${l1ay - 14} ${l1ax + 14},${l1ay}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={l1ax - 10} y={l1ay + 14} text="A" color={pink} /><Label x={l1bx - 10} y={l1by - 6} text="B" color={pink} />
      <Label x={l1cx + 6} y={l1cy + 14} text="C" color={pink} />
      {/* Hypotenuse BC: double tick */}
      {sideTick(l1bx, l1by, l1cx, l1cy, 2, "#3B82F6", "l1h")}
      {/* Leg AB: single tick */}
      {sideTick(l1ax, l1ay, l1bx, l1by, 1, amber, "l1l")}

      {/* Right triangle 2 */}
      <polygon points={`${l2ax},${l2ay} ${l2bx},${l2by} ${l2cx},${l2cy}`} fill="rgba(236,72,153,0.08)" stroke={pink} strokeWidth={2} />
      <polyline points={`${l2ax},${l2ay - 14} ${l2ax + 14},${l2ay - 14} ${l2ax + 14},${l2ay}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={l2ax - 10} y={l2ay + 14} text="D" color={purple} /><Label x={l2bx - 10} y={l2by - 6} text="E" color={purple} />
      <Label x={l2cx + 6} y={l2cy + 14} text="F" color={purple} />
      {sideTick(l2bx, l2by, l2cx, l2cy, 2, "#3B82F6", "l2h")}
      {sideTick(l2ax, l2ay, l2bx, l2by, 1, amber, "l2l")}

      <Label x={230} y={105} text="≅" color={purple} size={22} />
      <Label x={230} y={185} text="直角三角形 HL 全等：斜边+直角边" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: auxiliary line — diagonal splits quadrilateral into two triangles */
function AuxiliaryLines() {
  // Quadrilateral ABCD
  const ax = 80, ay = 160, bx = 380, by = 160, cx = 400, cy = 60, dx = 60, dy = 50;
  return (
    <Wrapper width={460} height={200}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax - 12} y={ay + 14} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx + 6} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx + 6} y={cy - 8} text="C" color={pink} />
      <Dot x={dx} y={dy} color={pink} r={3} /><Label x={dx - 12} y={dy - 8} text="D" color={pink} />
      {/* Diagonal AC as auxiliary dashed purple line */}
      <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={purple} strokeWidth={2} strokeDasharray="6,4" />
      {/* Label the auxiliary line */}
      <Label x={(ax + cx) / 2 - 28} y={(ay + cy) / 2} text="辅助线" color={purple} size={12} anchor="end" />
      {/* Subtle shading for the two triangles */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(236,72,153,0.08)" stroke="none" />
      <polygon points={`${ax},${ay} ${cx},${cy} ${dx},${dy}`} fill="rgba(245,158,11,0.08)" stroke="none" />
      <Label x={260} y={145} text="△ABC" color={pink} size={11} />
      <Label x={160} y={90} text="△ACD" color={amber} size={11} />
      <Label x={230} y={188} text="作对角线 AC，把四边形分为两个三角形" color={gray} size={11} />
    </Wrapper>
  );
}

// ── Chapter: 勾股定理 (Pythagorean Theorem) ──

/** Diagram: squares drawn on each side of a right triangle */
function PythagoreanTheoremDiscovery() {
  // Right triangle with right angle at bottom-left
  const rx = 120, ry = 180, // right-angle vertex
    bx = 300, by = 180,    // bottom-right (leg a)
    tx = 120, ty = 60;     // top (leg b)
  const lightBlue = "rgba(147,197,253,0.5)", lightPurple = "rgba(167,139,250,0.4)";
  // Square on leg a (bottom): vertices rx,ry → bx,by → bx,by+180-ry → rx,ry+(180-ry)... rotate 90
  const aLen = bx - rx; // horizontal leg
  const bLen = ry - ty; // vertical leg
  const cDx = bx - tx, cDy = ry - ty; // hypotenuse vector
  const cLen = Math.hypot(cDx, cDy);
  const cNx = -cDy / cLen, cNy = cDx / cLen; // normal to hypotenuse
  return (
    <Wrapper width={500} height={240}>
      {/* Square on leg a (bottom, shaded blue) */}
      <polygon
        points={`${rx},${ry} ${bx},${by} ${bx},${ry + aLen} ${rx},${ry + aLen}`}
        fill={lightBlue} stroke="#3B82F6" strokeWidth={1.5} />
      <Label x={(rx + bx) / 2} y={ry + aLen / 2 + 6} text="a²" color="#3B82F6" size={14} />
      {/* Square on leg b (left, shaded blue) */}
      <polygon
        points={`${rx},${ry} ${tx},${ty} ${tx - bLen},${ty} ${rx - bLen},${ry}`}
        fill={lightBlue} stroke="#3B82F6" strokeWidth={1.5} />
      <Label x={rx - bLen / 2 - 8} y={(ry + ty) / 2 + 4} text="b²" color="#3B82F6" size={14} />
      {/* Square on hypotenuse (shaded purple) */}
      <polygon
        points={`${rx},${ry} ${bx},${by} ${bx + cNx * cLen},${by + cNy * cLen} ${rx + cNx * cLen},${ry + cNy * cLen}`}
        fill={lightPurple} stroke={purple} strokeWidth={1.5} />
      <Label x={(rx + bx) / 2 + cNx * cLen / 2 + 8} y={(ry + by) / 2 + cNy * cLen / 2} text="c²" color={purple} size={14} />
      {/* The right triangle */}
      <polygon points={`${rx},${ry} ${bx},${by} ${tx},${ty}`} fill="rgba(255,255,255,0.9)" stroke={gray} strokeWidth={2.5} />
      {/* Right angle mark */}
      <polyline points={`${rx + 14},${ry} ${rx + 14},${ry - 14} ${rx},${ry - 14}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={rx - 10} y={ry + 14} text="C" color={gray} />
      <Label x={bx + 6} y={by + 14} text="A" color={gray} />
      <Label x={tx - 12} y={ty - 6} text="B" color={gray} />
      {/* Formula */}
      <rect x={168} y={10} width={164} height={26} rx={5} fill="#EDE9FE" />
      <Label x={250} y={28} text="a² + b² = c²" color={purple} size={14} />
    </Wrapper>
  );
}

/** Diagram: right triangle statement with labeled sides */
function PythagoreanTheoremStatement() {
  const cx = 100, cy = 180, ax = 360, ay = 180, bx = 100, by = 50;
  return (
    <Wrapper width={460} height={220}>
      {/* Right triangle */}
      <polygon points={`${cx},${cy} ${ax},${ay} ${bx},${by}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2.5} />
      {/* Right angle box */}
      <polyline points={`${cx + 16},${cy} ${cx + 16},${cy - 16} ${cx},${cy - 16}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx - 14} y={cy + 16} text="C" color={pink} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax + 8} y={ay + 16} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx - 14} y={by - 8} text="B" color={pink} />
      {/* Side labels */}
      <Label x={(cx + ax) / 2} y={ay + 16} text="b" color="#3B82F6" size={14} />
      <Label x={cx - 16} y={(cy + by) / 2} text="a" color="#10B981" size={14} />
      <Label x={(ax + bx) / 2 + 14} y={(ay + by) / 2} text="c（斜边）" color={purple} size={13} anchor="start" />
      {/* Formula box */}
      <rect x={130} y={195} width={200} height={20} rx={4} fill="#EDE9FE" />
      <Label x={230} y={210} text="a² + b² = c²" color={purple} size={13} />
    </Wrapper>
  );
}

/** Diagram: applications — ladder against wall, and rectangle diagonal */
function PythagoreanApplications() {
  return (
    <Wrapper width={500} height={200}>
      {/* Divider */}
      <line x1={248} y1={10} x2={248} y2={185} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />

      {/* Left: ladder against wall */}
      <Label x={120} y={18} text="梯子问题" color={purple} size={13} />
      {/* Ground */}
      <line x1={30} y1={170} x2={220} y2={170} stroke={gray} strokeWidth={2} />
      {/* Wall */}
      <line x1={30} y1={30} x2={30} y2={170} stroke={purple} strokeWidth={2.5} />
      {/* Ladder (diagonal) */}
      <line x1={30} y1={40} x2={200} y2={170} stroke={amber} strokeWidth={2.5} />
      {/* Right angle */}
      <polyline points="30,155 44,155 44,170" fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Labels */}
      <Label x={14} y={105} text="h" color={purple} size={13} anchor="end" />
      <Label x={115} y={185} text="d" color={gray} size={13} />
      <Label x={128} y={95} text="L（梯子）" color={amber} size={11} />
      <Label x={120} y={170} text="h²+d²=L²" color={gray} size={11} />

      {/* Right: rectangle with diagonal */}
      <Label x={370} y={18} text="对角线问题" color={purple} size={13} />
      <rect x={275} y={50} width={150} height={90} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
      {/* Diagonal */}
      <line x1={275} y1={50} x2={425} y2={140} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />
      <Label x={340} y={42} text="a" color={gray} size={13} />
      <Label x={430} y={95} text="b" color={gray} size={13} anchor="start" />
      <Label x={322} y={108} text="d=√(a²+b²)" color={pink} size={11} />
    </Wrapper>
  );
}

/** Diagram: converse theorem — classify triangles by comparing a²+b² vs c² */
function ConverseTheorem() {
  function tri(pts: [number, number][], label: string, formula: string, check: string, fColor: string, lx: number, ly: number) {
    return (
      <g>
        <polygon points={pts.map(p => p.join(",")).join(" ")} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
        <Label x={lx} y={ly} text={label} color={purple} size={12} />
        <Label x={lx} y={ly + 14} text={formula} color={fColor} size={11} />
        <Label x={lx} y={ly + 26} text={check} color={fColor} size={11} />
      </g>
    );
  }
  return (
    <Wrapper width={500} height={200}>
      {/* 3-4-5: right triangle */}
      {tri([[30, 155], [120, 155], [30, 70]], "3-4-5", "9+16=25=25", "直角 ✓", "#16A34A", 75, 165)}
      {/* 5-5-5: acute */}
      {tri([[175, 155], [265, 155], [220, 75]], "5-5-5", "25+25>25", "锐角△", "#3B82F6", 220, 165)}
      {/* 2-3-6: obtuse (not valid but illustrative) */}
      {tri([[305, 155], [430, 155], [320, 85]], "2-3-6", "4+9<36", "钝角△", amber, 368, 165)}
      {/* Labels above */}
      <Label x={75} y={60} text="a²+b²=c²" color="#16A34A" size={11} />
      <Label x={220} y={60} text="a²+b²>c²" color="#3B82F6" size={11} />
      <Label x={368} y={60} text="a²+b²<c²" color={amber} size={11} />
      <Label x={250} y={18} text="勾股定理逆定理：三角形类型判断" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: table of Pythagorean triples */
function PythagoreanTriples() {
  const triples = [
    { a: 3, b: 4, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 8, b: 15, c: 17 },
    { a: 7, b: 24, c: 25 },
  ];
  const colors = [purple, pink, "#3B82F6", "#10B981"];
  const colX = [55, 130, 205, 290, 430];
  const headers = ["a", "b", "c", "a²+b²", "c²  ✓"];
  return (
    <Wrapper width={500} height={200}>
      <Label x={250} y={18} text="常见勾股数组" color={purple} size={14} />
      {/* Header row */}
      {headers.map((h, i) => (
        <Label key={h} x={colX[i]} y={40} text={h} color={gray} size={13} />
      ))}
      <line x1={20} y1={46} x2={480} y2={46} stroke={lightGray} strokeWidth={1} />
      {/* Data rows */}
      {triples.map((t, ri) => {
        const y = 72 + ri * 32;
        const color = colors[ri];
        return (
          <g key={ri}>
            <rect x={18} y={y - 14} width={464} height={28} rx={4} fill={`rgba(${ri % 2 === 0 ? "139,92,246" : "236,72,153"},0.06)`} />
            <Label x={colX[0]} y={y + 4} text={`${t.a}`} color={color} size={13} />
            <Label x={colX[1]} y={y + 4} text={`${t.b}`} color={color} size={13} />
            <Label x={colX[2]} y={y + 4} text={`${t.c}`} color={color} size={13} />
            <Label x={colX[3]} y={y + 4} text={`${t.a ** 2}+${t.b ** 2}=${t.a ** 2 + t.b ** 2}`} color={gray} size={11} />
            <Label x={colX[4]} y={y + 4} text={`${t.c ** 2}`} color="#16A34A" size={12} />
          </g>
        );
      })}
    </Wrapper>
  );
}

/** Diagram: 45-45-90 and 30-60-90 special right triangles */
function SpecialRightTriangles() {
  return (
    <Wrapper width={500} height={220}>
      <line x1={248} y1={10} x2={248} y2={210} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />

      {/* Left: 45-45-90 isosceles right triangle */}
      <Label x={120} y={18} text="等腰直角三角形" color={purple} size={12} />
      <polygon points="50,175 190,175 50,55" fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      {/* Right angle */}
      <polyline points="50,160 64,160 64,175" fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Tick marks on legs */}
      <line x1={43} y1={115} x2={57} y2={115} stroke={purple} strokeWidth={1.8} />
      <line x1={112} y1={181} x2={112} y2={168} stroke={purple} strokeWidth={1.8} />
      {/* Labels */}
      <Label x={34} y={115} text="1" color={purple} size={13} anchor="end" />
      <Label x={120} y={188} text="1" color={purple} size={13} />
      <Label x={135} y={110} text="√2" color={pink} size={13} />
      {/* Angles */}
      <Label x={62} y={62} text="45°" color={amber} size={12} anchor="start" />
      <Label x={175} y={165} text="45°" color={amber} size={12} anchor="end" />

      {/* Right: 30-60-90 triangle */}
      <Label x={370} y={18} text="30-60-90 三角形" color={purple} size={12} />
      <polygon points="270,175 450,175 270,55" fill="rgba(236,72,153,0.08)" stroke={pink} strokeWidth={2} />
      <polyline points="270,160 284,160 284,175" fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Labels */}
      <Label x={254} y={115} text="√3" color="#3B82F6" size={13} anchor="end" />
      <Label x={360} y={188} text="1" color={purple} size={13} />
      <Label x={374} y={107} text="2" color={pink} size={13} />
      {/* Angles */}
      <Label x={282} y={62} text="60°" color={amber} size={12} anchor="start" />
      <Label x={428} y={165} text="30°" color={amber} size={12} anchor="end" />
    </Wrapper>
  );
}

// ── Chapter: 轴对称 (Line Symmetry) ──

/** Diagram: a simple symmetric figure with axis of symmetry */
function LineSymmetricFigure() {
  // Draw a stylized butterfly / heart shape symmetric about x=230
  const axis = 230;
  return (
    <Wrapper width={460} height={200}>
      {/* Axis of symmetry */}
      <line x1={axis} y1={10} x2={axis} y2={190} stroke={purple} strokeWidth={2} strokeDasharray="7,4" />
      <Label x={axis} y={8} text="对称轴" color={purple} size={12} />

      {/* Left wing */}
      <path d={`M ${axis},100 C ${axis - 40},60 ${axis - 120},50 ${axis - 100},110 C ${axis - 80},150 ${axis - 20},140 ${axis},100 Z`}
        fill="rgba(236,72,153,0.2)" stroke={pink} strokeWidth={2} />
      {/* Right wing (mirror) */}
      <path d={`M ${axis},100 C ${axis + 40},60 ${axis + 120},50 ${axis + 100},110 C ${axis + 80},150 ${axis + 20},140 ${axis},100 Z`}
        fill="rgba(236,72,153,0.2)" stroke={pink} strokeWidth={2} />

      {/* Fold marks — dashed horizontal lines showing correspondence */}
      {[70, 95, 120, 145].map((y) => (
        <line key={y} x1={axis - 60} y1={y} x2={axis + 60} y2={y} stroke={lightGray} strokeWidth={1} strokeDasharray="3,3" />
      ))}

      <Label x={axis} y={185} text="两侧完全重合 → 轴对称图形" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: two figures symmetric about an axis */
function TwoFiguresSymmetric() {
  const axis = 250;
  // △ABC on left, △A'B'C' on right
  const A = { x: 160, y: 60 }, B = { x: 90, y: 170 }, C = { x: 200, y: 170 };
  const Ap = { x: axis + (axis - A.x), y: A.y };
  const Bp = { x: axis + (axis - B.x), y: B.y };
  const Cp = { x: axis + (axis - C.x), y: C.y };
  return (
    <Wrapper width={500} height={220}>
      {/* Axis */}
      <line x1={axis} y1={10} x2={axis} y2={210} stroke={purple} strokeWidth={2} strokeDasharray="7,4" />
      <Label x={axis + 6} y={18} text="对称轴" color={purple} size={12} anchor="start" />

      {/* △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(139,92,246,0.10)" stroke={purple} strokeWidth={2} />
      <Dot x={A.x} y={A.y} color={purple} r={3} /><Label x={A.x - 10} y={A.y - 8} text="A" color={purple} />
      <Dot x={B.x} y={B.y} color={purple} r={3} /><Label x={B.x - 12} y={B.y + 14} text="B" color={purple} />
      <Dot x={C.x} y={C.y} color={purple} r={3} /><Label x={C.x} y={C.y + 14} text="C" color={purple} />

      {/* △A'B'C' */}
      <polygon points={`${Ap.x},${Ap.y} ${Bp.x},${Bp.y} ${Cp.x},${Cp.y}`} fill="rgba(236,72,153,0.10)" stroke={pink} strokeWidth={2} />
      <Dot x={Ap.x} y={Ap.y} color={pink} r={3} /><Label x={Ap.x + 10} y={Ap.y - 8} text="A'" color={pink} />
      <Dot x={Bp.x} y={Bp.y} color={pink} r={3} /><Label x={Bp.x + 10} y={Bp.y + 14} text="B'" color={pink} />
      <Dot x={Cp.x} y={Cp.y} color={pink} r={3} /><Label x={Cp.x + 8} y={Cp.y + 14} text="C'" color={pink} />

      {/* Dashed correspondence lines */}
      {[[A, Ap], [B, Bp], [C, Cp]].map(([p, q], i) => (
        <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={lightGray} strokeWidth={1.2} strokeDasharray="5,3" />
      ))}

      {/* Equal distance marks from axis */}
      <Label x={axis - 50} y={60} text="|" color={gray} size={10} />
      <Label x={axis + 50} y={60} text="|" color={gray} size={10} />

      <Label x={250} y={210} text="对应点到对称轴距离相等，连线垂直于对称轴" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: perpendicular bisector */
function PerpendicularBisector() {
  const ax = 80, ay = 110, bx = 360, by = 110; // Segment AB
  const mx = (ax + bx) / 2, my = ay; // Midpoint M
  const px = mx, py = 40; // Point P on bisector
  return (
    <Wrapper width={460} height={200}>
      {/* Segment AB */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={purple} strokeWidth={2.5} />
      <Dot x={ax} y={ay} color={pink} r={4} /><Label x={ax - 12} y={ay + 16} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={4} /><Label x={bx + 8} y={by + 16} text="B" color={pink} />
      {/* Midpoint M */}
      <Dot x={mx} y={my} color={amber} r={4} /><Label x={mx + 8} y={my + 16} text="M" color={amber} />
      {/* Perpendicular bisector (vertical dashed) */}
      <line x1={mx} y1={15} x2={mx} y2={185} stroke={purple} strokeWidth={1.8} strokeDasharray="6,4" />
      {/* Right angle box */}
      <polyline points={`${mx - 10},${my} ${mx - 10},${my - 10} ${mx},${my - 10}`} fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Point P on bisector */}
      <Dot x={px} y={py} color={pink} r={4} /><Label x={px + 8} y={py - 4} text="P" color={pink} anchor="start" />
      {/* PA and PB lines (dashed) */}
      <line x1={px} y1={py} x2={ax} y2={ay} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={px} y1={py} x2={bx} y2={by} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      {/* Equal marks on PA and PB */}
      {[[px, py, ax, ay], [px, py, bx, by]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const tlen = Math.hypot(x2 - x1, y2 - y1);
        const tpx = -(y2 - y1) / tlen * 6, tpy = (x2 - x1) / tlen * 6;
        return <line key={i} x1={tmx + tpx} y1={tmy + tpy} x2={tmx - tpx} y2={tmy - tpy} stroke={gray} strokeWidth={1.8} />;
      })}
      <Label x={mx} y={195} text="垂直平分线：PA = PB，PM ⊥ AB，AM = MB" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: angle bisector property — point on bisector equidistant from both sides */
function AngleBisectorProperty() {
  const ox = 80, oy = 180; // vertex O
  // OA ray: horizontal right
  const oax = 380, oay = 180;
  // OB ray: angled up ~50°
  const ang = 50 * Math.PI / 180;
  const obx = ox + 280 * Math.cos(ang), oby = oy - 280 * Math.sin(ang);
  // Bisector OC: at 25°
  const bisAng = 25 * Math.PI / 180;
  const ocx = ox + 300 * Math.cos(bisAng), ocy = oy - 300 * Math.sin(bisAng);
  // Point P on bisector
  const t = 0.55;
  const px = ox + (ocx - ox) * t, py = oy + (ocy - oy) * t;
  // Foot D on OA (horizontal): y stays at oy, x = px
  const dx = px, dy = oy;
  // Foot E on OB: project P onto OB direction
  const obDir = [Math.cos(ang), -Math.sin(ang)];
  const proj = (px - ox) * obDir[0] + (py - oy) * obDir[1];
  const ex = ox + proj * obDir[0], ey = oy + proj * obDir[1];
  return (
    <Wrapper width={460} height={200}>
      {/* Ray OA */}
      <line x1={ox} y1={oy} x2={oax} y2={oay} stroke={purple} strokeWidth={2} />
      <polygon points={`${oax + 5},${oay} ${oax - 5},${oay - 4} ${oax - 5},${oay + 4}`} fill={purple} />
      <Label x={oax + 8} y={oay + 4} text="A" color={purple} anchor="start" />
      {/* Ray OB */}
      <line x1={ox} y1={oy} x2={obx} y2={oby} stroke={purple} strokeWidth={2} />
      <polygon points={`${obx + 4},${oby - 3} ${obx - 5},${oby} ${obx - 1},${oby + 6}`} fill={purple} />
      <Label x={obx + 4} y={oby - 6} text="B" color={purple} />
      {/* Bisector OC (dashed) */}
      <line x1={ox} y1={oy} x2={ocx} y2={ocy} stroke={pink} strokeWidth={1.8} strokeDasharray="6,4" />
      <Label x={ocx + 4} y={ocy - 4} text="C" color={pink} anchor="start" />
      {/* Point P */}
      <Dot x={px} y={py} color={pink} r={4} /><Label x={px + 8} y={py - 6} text="P" color={pink} anchor="start" />
      {/* PD perpendicular to OA */}
      <line x1={px} y1={py} x2={dx} y2={dy} stroke={gray} strokeWidth={1.5} strokeDasharray="4,3" />
      <polyline points={`${dx - 8},${dy} ${dx - 8},${dy - 8} ${dx},${dy - 8}`} fill="none" stroke={gray} strokeWidth={1.3} />
      <Dot x={dx} y={dy} color={amber} r={3} /><Label x={dx} y={dy + 14} text="D" color={amber} />
      {/* PE perpendicular to OB */}
      <line x1={px} y1={py} x2={ex} y2={ey} stroke={gray} strokeWidth={1.5} strokeDasharray="4,3" />
      <Dot x={ex} y={ey} color={amber} r={3} /><Label x={ex - 10} y={ey - 8} text="E" color={amber} />
      {/* Equal marks PD=PE */}
      {[[px, py, dx, dy], [px, py, ex, ey]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const tlen = Math.hypot(x2 - x1, y2 - y1);
        const tpx = -(y2 - y1) / tlen * 6, tpy = (x2 - x1) / tlen * 6;
        return <line key={i} x1={tmx + tpx} y1={tmy + tpy} x2={tmx - tpx} y2={tmy - tpy} stroke="#16A34A" strokeWidth={1.8} />;
      })}
      <Label x={ox - 10} y={oy + 14} text="O" color={pink} />
      <Label x={230} y={194} text="PD = PE：角平分线上的点到两边距离相等" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: isosceles triangle properties */
function IsoscelesTriangleProperties() {
  const ax = 230, ay = 30; // vertex A (top)
  const bx = 80, by = 185; // B (bottom-left)
  const cx = 380, cy = 185; // C (bottom-right)
  const mx = (bx + cx) / 2, my = by; // midpoint M of BC
  return (
    <Wrapper width={460} height={220}>
      {/* Triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2.5} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax} y={ay - 10} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx - 14} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx + 6} y={cy + 14} text="C" color={pink} />
      {/* Axis of symmetry AM */}
      <line x1={ax} y1={ay} x2={mx} y2={my} stroke={purple} strokeWidth={1.8} strokeDasharray="6,4" />
      <Dot x={mx} y={my} color={amber} r={3} /><Label x={mx} y={my + 14} text="M" color={amber} />
      {/* Right angle at M */}
      <polyline points={`${mx - 10},${my} ${mx - 10},${my - 10} ${mx},${my - 10}`} fill="none" stroke={gray} strokeWidth={1.5} />
      {/* AB = AC tick marks */}
      {[[ax, ay, bx, by], [ax, ay, cx, cy]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const tlen = Math.hypot(x2 - x1, y2 - y1);
        const tpx = -(y2 - y1) / tlen * 7, tpy = (x2 - x1) / tlen * 7;
        return <line key={i} x1={tmx + tpx} y1={tmy + tpy} x2={tmx - tpx} y2={tmy - tpy} stroke={pink} strokeWidth={2} />;
      })}
      {/* ∠B = ∠C arcs */}
      <path d="M 97,185 A 20 20 0 0 0 107,167" fill="none" stroke={amber} strokeWidth={1.8} />
      <path d="M 363,167 A 20 20 0 0 0 373,185" fill="none" stroke={amber} strokeWidth={1.8} />
      {/* Label */}
      <Label x={230} y={210} text="AB=AC(腰)，∠B=∠C，AM⊥BC，BM=MC（高=中线=角平分线）" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: isosceles triangle criterion — equal angles → equal sides */
function IsoscelesTriangleCriterion() {
  const ax = 210, ay = 30, bx = 70, by = 175, cx = 350, cy = 175;
  return (
    <Wrapper width={420} height={200}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax} y={ay - 10} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx - 14} y={by + 14} text="B" color={pink} />
      <Dot x={cx} y={cy} color={pink} r={3} /><Label x={cx + 6} y={cy + 14} text="C" color={pink} />
      {/* Equal angle arcs at B and C */}
      <path d="M 87,175 A 20 20 0 0 0 97,157" fill="none" stroke={amber} strokeWidth={2} />
      <path d="M 333,157 A 20 20 0 0 0 343,175" fill="none" stroke={amber} strokeWidth={2} />
      <Label x={110} y={160} text="∠B" color={amber} size={12} />
      <Label x={318} y={160} text="∠C" color={amber} size={12} />
      {/* Equal side marks */}
      {[[ax, ay, bx, by], [ax, ay, cx, cy]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const tlen = Math.hypot(x2 - x1, y2 - y1);
        const tpx = -(y2 - y1) / tlen * 7, tpy = (x2 - x1) / tlen * 7;
        return <line key={i} x1={tmx + tpx} y1={tmy + tpy} x2={tmx - tpx} y2={tmy - tpy} stroke={purple} strokeWidth={2} />;
      })}
      {/* Arrow and label */}
      <Label x={210} y={120} text="∠B = ∠C" color={amber} size={13} />
      <Label x={210} y={140} text="⟹  AB = AC" color={purple} size={13} />
      <Label x={210} y={190} text="等角对等边（等腰三角形判定）" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: equilateral triangle with all axes of symmetry */
function EquilateralTriangle() {
  const ax = 230, ay = 28, bx = 80, by = 192, cx2 = 380, cy2 = 192;
  const sides = [[ax, ay, bx, by], [bx, by, cx2, cy2], [cx2, cy2, ax, ay]];
  // Midpoints for axes
  const mab = [(ax + bx) / 2, (ay + by) / 2];
  const mbc = [(bx + cx2) / 2, (by + cy2) / 2];
  const mca = [(cx2 + ax) / 2, (cy2 + ay) / 2];
  function sideTick(x1: number, y1: number, x2: number, y2: number, color: string, id: string) {
    const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
    const tlen = Math.hypot(x2 - x1, y2 - y1);
    const tpx = -(y2 - y1) / tlen * 7, tpy = (x2 - x1) / tlen * 7;
    return <line key={id} x1={tmx + tpx} y1={tmy + tpy} x2={tmx - tpx} y2={tmy - tpy} stroke={color} strokeWidth={2} />;
  }
  return (
    <Wrapper width={460} height={220}>
      {/* Axes of symmetry (dashed) from each vertex to midpoint of opposite side */}
      <line x1={ax} y1={ay} x2={mbc[0]} y2={mbc[1]} stroke={purple} strokeWidth={1.5} strokeDasharray="6,4" />
      <line x1={bx} y1={by} x2={mca[0]} y2={mca[1]} stroke={purple} strokeWidth={1.5} strokeDasharray="6,4" />
      <line x1={cx2} y1={cy2} x2={mab[0]} y2={mab[1]} stroke={purple} strokeWidth={1.5} strokeDasharray="6,4" />
      {/* Triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx2},${cy2}`} fill="rgba(139,92,246,0.09)" stroke={purple} strokeWidth={2.5} />
      {/* Tick marks on all three sides */}
      {sides.map(([x1, y1, x2, y2], i) => sideTick(x1, y1, x2, y2, pink, `eq${i}`))}
      {/* Vertex labels */}
      <Dot x={ax} y={ay} color={pink} r={3} /><Label x={ax} y={ay - 10} text="A" color={pink} />
      <Dot x={bx} y={by} color={pink} r={3} /><Label x={bx - 14} y={by + 14} text="B" color={pink} />
      <Dot x={cx2} y={cy2} color={pink} r={3} /><Label x={cx2 + 6} y={cy2 + 14} text="C" color={pink} />
      {/* 60° angle labels */}
      <Label x={ax + 14} y={ay + 20} text="60°" color={amber} size={11} anchor="start" />
      <Label x={bx + 20} y={by - 4} text="60°" color={amber} size={11} anchor="start" />
      <Label x={cx2 - 18} y={cy2 - 4} text="60°" color={amber} size={11} anchor="end" />
      <Label x={230} y={212} text="三条对称轴，三边相等，三角均为 60°" color={gray} size={11} />
    </Wrapper>
  );
}

function FactorTree() {
  return (
    <svg viewBox="0 0 400 280" className="w-full max-w-md mx-auto my-4">
      {/* Root */}
      <text x="200" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#8B5CF6">360</text>
      {/* Level 1: 36 × 10 */}
      <line x1="200" y1="35" x2="120" y2="75" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="200" y1="35" x2="280" y2="75" stroke="#D1D5DB" strokeWidth="1.5"/>
      <text x="120" y="90" textAnchor="middle" fontSize="16" fill="#8B5CF6">36</text>
      <text x="280" y="90" textAnchor="middle" fontSize="16" fill="#8B5CF6">10</text>
      {/* Level 2 */}
      <line x1="120" y1="95" x2="70" y2="135" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="120" y1="95" x2="160" y2="135" stroke="#D1D5DB" strokeWidth="1.5"/>
      <text x="70" y="150" textAnchor="middle" fontSize="16" fill="#8B5CF6">4</text>
      <text x="160" y="150" textAnchor="middle" fontSize="16" fill="#8B5CF6">9</text>
      <line x1="280" y1="95" x2="240" y2="135" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="280" y1="95" x2="320" y2="135" stroke="#D1D5DB" strokeWidth="1.5"/>
      <text x="240" y="150" textAnchor="middle" fontSize="16" fill="#8B5CF6">2</text>
      <text x="320" y="150" textAnchor="middle" fontSize="16" fill="#8B5CF6">5</text>
      {/* Level 3 - primes */}
      <line x1="70" y1="155" x2="45" y2="195" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="70" y1="155" x2="95" y2="195" stroke="#D1D5DB" strokeWidth="1.5"/>
      <circle cx="45" cy="205" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="45" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">2</text>
      <circle cx="95" cy="205" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="95" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">2</text>
      <line x1="160" y1="155" x2="135" y2="195" stroke="#D1D5DB" strokeWidth="1.5"/>
      <line x1="160" y1="155" x2="185" y2="195" stroke="#D1D5DB" strokeWidth="1.5"/>
      <circle cx="135" cy="205" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="135" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">3</text>
      <circle cx="185" cy="205" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="185" y="210" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">3</text>
      <circle cx="240" cy="155" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="240" y="160" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">2</text>
      <circle cx="320" cy="155" r="14" fill="#FDF4FF" stroke="#EC4899" strokeWidth="2"/>
      <text x="320" y="160" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EC4899">5</text>
      {/* Result */}
      <rect x="80" y="235" width="240" height="32" rx="8" fill="#F3F0FF" stroke="#8B5CF6" strokeWidth="1.5"/>
      <text x="200" y="257" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#8B5CF6">360 = 2³ × 3² × 5¹</text>
    </svg>
  );
}

function DivisibilityRules() {
  const rules = [
    { n: "2", rule: "末位是偶数 (0,2,4,6,8)", example: "138 ✓" },
    { n: "3", rule: "各位数字之和能被3整除", example: "1+3+8=12 ✓" },
    { n: "4", rule: "末两位能被4整除", example: "136→36÷4=9 ✓" },
    { n: "5", rule: "末位是0或5", example: "135 ✓" },
    { n: "9", rule: "各位数字之和能被9整除", example: "1+2+6=9 ✓" },
    { n: "10", rule: "末位是0", example: "130 ✓" },
  ];
  return (
    <svg viewBox="0 0 420 230" className="w-full max-w-lg mx-auto my-4">
      <rect x="10" y="5" width="400" height="220" rx="10" fill="#FAFAFA" stroke="#E9D5FF" strokeWidth="1.5"/>
      <rect x="10" y="5" width="400" height="32" rx="10" fill="#8B5CF6"/>
      <text x="60" y="26" fontSize="12" fontWeight="bold" fill="white">整除判断</text>
      <text x="200" y="26" fontSize="12" fontWeight="bold" fill="white">规律</text>
      <text x="360" y="26" fontSize="12" fontWeight="bold" fill="white">示例</text>
      {rules.map((r, i) => {
        const y = 42 + i * 30;
        const bg = i % 2 === 0 ? "#F9F5FF" : "white";
        return (
          <g key={r.n}>
            <rect x="10" y={y} width="400" height="30" fill={bg}/>
            <circle cx="42" cy={y+15} r="12" fill="#8B5CF6"/>
            <text x="42" y={y+20} textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">{r.n}</text>
            <text x="80" y={y+19} fontSize="11" fill="#374151">{r.rule}</text>
            <text x="345" y={y+19} fontSize="11" fill="#EC4899" textAnchor="middle">{r.example}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GcdLcmVenn() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-md mx-auto my-4">
      {/* Left circle - 12 */}
      <circle cx="155" cy="105" r="80" fill="#EDE9FE" fillOpacity="0.7" stroke="#8B5CF6" strokeWidth="2"/>
      {/* Right circle - 18 */}
      <circle cx="245" cy="105" r="80" fill="#FCE7F3" fillOpacity="0.7" stroke="#EC4899" strokeWidth="2"/>
      {/* Labels */}
      <text x="100" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#8B5CF6">12的因数</text>
      <text x="300" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#EC4899">18的因数</text>
      {/* Left only */}
      <text x="110" y="95" textAnchor="middle" fontSize="13" fill="#6B7280">4</text>
      <text x="110" y="115" textAnchor="middle" fontSize="13" fill="#6B7280">12</text>
      {/* Common (GCD) */}
      <text x="200" y="90" textAnchor="middle" fontSize="13" fill="#374151">1</text>
      <text x="200" y="108" textAnchor="middle" fontSize="13" fill="#374151">2</text>
      <text x="200" y="126" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#8B5CF6">3</text>
      <text x="200" y="144" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#8B5CF6">6←GCD</text>
      {/* Right only */}
      <text x="290" y="95" textAnchor="middle" fontSize="13" fill="#6B7280">9</text>
      <text x="290" y="115" textAnchor="middle" fontSize="13" fill="#6B7280">18</text>
      {/* LCM below */}
      <rect x="120" y="190" width="160" height="24" rx="8" fill="#FDF4FF" stroke="#EC4899" strokeWidth="1.5"/>
      <text x="200" y="207" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#EC4899">LCM(12,18) = 36</text>
    </svg>
  );
}

function PrimeNumberSieve() {
  const primes = new Set([2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]);
  const nums = Array.from({length: 50}, (_, i) => i + 1);
  return (
    <svg viewBox="0 0 420 250" className="w-full max-w-lg mx-auto my-4">
      <text x="210" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#374151">1–50 的质数（紫色圈出）</text>
      {nums.map((n) => {
        const col = (n - 1) % 10;
        const row = Math.floor((n - 1) / 10);
        const x = 25 + col * 40;
        const y = 40 + row * 40;
        const isPrime = primes.has(n);
        const isOne = n === 1;
        return (
          <g key={n}>
            <circle cx={x} cy={y} r="16"
              fill={isPrime ? "#EDE9FE" : isOne ? "#FEF9C3" : "#F9FAFB"}
              stroke={isPrime ? "#8B5CF6" : isOne ? "#EAB308" : "#E5E7EB"}
              strokeWidth={isPrime ? 2 : 1}
            />
            <text x={x} y={y+5} textAnchor="middle" fontSize="12"
              fontWeight={isPrime ? "bold" : "normal"}
              fill={isPrime ? "#8B5CF6" : isOne ? "#92400E" : "#9CA3AF"}
            >{n}</text>
          </g>
        );
      })}
      <text x="210" y="245" textAnchor="middle" fontSize="11" fill="#6B7280">共 15 个质数：2,3,5,7,11,13,17,19,23,29,31,37,41,43,47</text>
    </svg>
  );
}

/** Map concept IDs to their diagrams */
const diagramMap: Record<string, React.ReactNode[]> = {
  "factor-tree": [<FactorTree key="ft" />],
  "divisibility-rules": [<DivisibilityRules key="dr" />],
  "gcd-lcm-venn": [<GcdLcmVenn key="glv" />],
  "prime-number-sieve": [<PrimeNumberSieve key="pns" />],
  "solid-and-plane-figures": [<ThreeViews key="tv" />],
  "line-ray-segment": [<LineTypes key="lt" />],
  "segment-comparison": [<SegmentMidpoint key="sm" />],
  "angle-concept": [<AngleDiagram key="ad" />],
  "angle-comparison": [<AngleBisector key="ab" />],
  "complementary-supplementary": [<ComplementarySupplementary key="cs" />],
  "cartesian-coordinate-system": [<CartesianSystem key="ccs" />],
  "ordered-pair": [<OrderedPairDiagram key="op" />],
  "translation-and-coordinates": [<CoordinateTranslation key="ct" />],
  "vertical-and-adjacent-angles": [<VerticalAdjacentAngles key="vaa" />],
  "perpendicular-lines": [<PerpendicularLines key="pl" />],
  "angles-formed-by-transversal": [<TransversalAngles key="ta" />],
  "criteria-for-parallel-lines": [<ParallelCriteria key="pc" />],
  "properties-of-parallel-lines": [<ParallelProperties key="pp" />],
  "propositions-theorems-proofs": [<PropositionDiagram key="pd" />],
  // Grade 8 triangles
  "triangle-sides": [<TriangleSides key="ts" />],
  "triangle-classification": [<TriangleClassification key="tc" />],
  "triangle-special-lines": [<TriangleSpecialLines key="tsl" />],
  "exterior-angle-theorem": [<ExteriorAngleTheorem key="eat" />],
  "polygon-angle-sum": [<PolygonAngleSum key="pas" />],
  "triangle-stability": [<TriangleStability key="tstab" />],
  // Grade 8 congruent triangles
  "congruent-figures": [<CongruentFigures key="cgf" />],
  "properties-of-congruent-triangles": [<PropertiesOfCongruentTriangles key="poct" />],
  "congruence-sss-sas": [<CongruenceSssSas key="cssa" />],
  "congruence-asa-aas": [<CongruenceAsaAas key="caaa" />],
  "congruence-hl": [<CongruenceHL key="chl" />],
  "auxiliary-lines": [<AuxiliaryLines key="al" />],
  // Grade 8 Pythagorean theorem
  "pythagorean-theorem-discovery": [<PythagoreanTheoremDiscovery key="ptd" />],
  "pythagorean-theorem-statement": [<PythagoreanTheoremStatement key="pts" />],
  "pythagorean-applications": [<PythagoreanApplications key="pa" />],
  "converse-theorem": [<ConverseTheorem key="cvt" />],
  "pythagorean-triples": [<PythagoreanTriples key="pyt" />],
  "special-right-triangles": [<SpecialRightTriangles key="srt" />],
  // Grade 8 line symmetry
  "line-symmetric-figure": [<LineSymmetricFigure key="lsf" />],
  "two-figures-symmetric": [<TwoFiguresSymmetric key="tfs" />],
  "perpendicular-bisector": [<PerpendicularBisector key="pb" />],
  "angle-bisector-property": [<AngleBisectorProperty key="abp" />],
  "isosceles-triangle-properties": [<IsoscelesTriangleProperties key="itp" />],
  "isosceles-triangle-criterion": [<IsoscelesTriangleCriterion key="itc" />],
  "equilateral-triangle": [<EquilateralTriangle key="et" />],
};

export default function GeometryDiagram({ conceptId }: { conceptId: string }) {
  const diagrams = diagramMap[conceptId];
  if (!diagrams) return null;
  return <div className="space-y-2">{diagrams}</div>;
}

export function hasGeometryDiagram(conceptId: string): boolean {
  return conceptId in diagramMap;
}
