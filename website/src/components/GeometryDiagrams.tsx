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
  const cx = 250, cy = 110;
  const len = 120;
  return (
    <Wrapper width={500} height={240}>
      {/* Two intersecting lines */}
      <line x1={cx - len} y1={cy - 70} x2={cx + len} y2={cy + 70} stroke={purple} strokeWidth={2} />
      <line x1={cx - len} y1={cy + 70} x2={cx + len} y2={cy - 70} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={4} />
      {/* ∠1 top-right */}
      <path d={`M ${cx},${cy - 30} A 30 30 0 0 1 ${cx + 26},${cy + 15}`} fill="none" stroke={pink} strokeWidth={1.5} />
      <Label x={cx + 18} y={cy - 18} text="∠1" color={pink} size={12} />
      {/* ∠2 bottom-right */}
      <path d={`M ${cx + 26},${cy + 15} A 30 30 0 0 1 ${cx},${cy + 30}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <Label x={cx + 24} y={cy + 28} text="∠2" color={amber} size={12} />
      {/* ∠3 bottom-left (vertical to ∠1) */}
      <path d={`M ${cx},${cy + 30} A 30 30 0 0 1 ${cx - 26},${cy - 15}`} fill="none" stroke={pink} strokeWidth={1.5} />
      <Label x={cx - 24} y={cy + 28} text="∠3" color={pink} size={12} />
      {/* ∠4 top-left (vertical to ∠2) */}
      <path d={`M ${cx - 26},${cy - 15} A 30 30 0 0 1 ${cx},${cy - 30}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <Label x={cx - 24} y={cy - 18} text="∠4" color={amber} size={12} />
      {/* Annotations */}
      <Label x={250} y={210} text="对顶角: ∠1 = ∠3, ∠2 = ∠4" color={purple} size={13} />
      <Label x={250} y={230} text="邻补角: ∠1 + ∠2 = 180°" color={gray} size={12} />
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

/** Diagram: angles formed by a transversal cutting two parallel lines */
function TransversalAngles() {
  const y1 = 60, y2 = 160;
  const tx1 = 150, ty1 = 10, tx2 = 300, ty2 = 210;
  const slope = (tx2 - tx1) / (ty2 - ty1);
  const ix1 = tx1 + slope * (y1 - ty1);
  const ix2 = tx1 + slope * (y2 - ty1);
  const arcR = 25;
  return (
    <Wrapper width={500} height={260}>
      {/* Parallel lines */}
      <line x1={60} y1={y1} x2={440} y2={y1} stroke={purple} strokeWidth={2} />
      <line x1={60} y1={y2} x2={440} y2={y2} stroke={purple} strokeWidth={2} />
      <Label x={445} y={y1 - 8} text="a" color={purple} size={13} anchor="start" />
      <Label x={445} y={y2 - 8} text="b" color={purple} size={13} anchor="start" />
      {/* Transversal */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={purple} strokeWidth={2} />
      <Label x={tx1 - 6} y={ty1 + 4} text="c" color={purple} size={13} anchor="end" />
      {/* Intersection dots */}
      <Dot x={ix1} y={y1} r={4} />
      <Dot x={ix2} y={y2} r={4} />
      {/* Corresponding angles (同位角) — F-shape: ∠1 and ∠5 */}
      <path d={`M ${ix1 + arcR},${y1} A ${arcR} ${arcR} 0 0 0 ${ix1 + arcR * 0.38},${y1 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix1 + 30} y={y1 - 10} text="∠1" color={pink} size={11} anchor="start" />
      <path d={`M ${ix2 + arcR},${y2} A ${arcR} ${arcR} 0 0 0 ${ix2 + arcR * 0.38},${y2 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix2 + 30} y={y2 - 10} text="∠5" color={pink} size={11} anchor="start" />
      {/* Alternate interior angles (内错角): ∠3 and ∠5 */}
      <path d={`M ${ix1 - arcR},${y1} A ${arcR} ${arcR} 0 0 0 ${ix1 - arcR * 0.38},${y1 + arcR * 0.92}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={ix1 - 34} y={y1 + 24} text="∠3" color={amber} size={11} anchor="end" />
      {/* Co-interior angles (同旁内角): ∠4 and ∠5 */}
      <path d={`M ${ix1 + arcR},${y1} A ${arcR} ${arcR} 0 0 1 ${ix1 + arcR * 0.38},${y1 + arcR * 0.92}`} fill="none" stroke="#10B981" strokeWidth={2} />
      <Label x={ix1 + 30} y={y1 + 24} text="∠4" color="#10B981" size={11} anchor="start" />
      {/* Legend */}
      <Label x={250} y={235} text="同位角: ∠1与∠5 (F形)　内错角: ∠3与∠5 (Z形)　同旁内角: ∠4与∠5 (U形)" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: criteria for parallel lines */
function ParallelCriteria() {
  const y1 = 60, y2 = 160;
  const tx1 = 160, ty1 = 10, tx2 = 310, ty2 = 210;
  const slope = (tx2 - tx1) / (ty2 - ty1);
  const ix1 = tx1 + slope * (y1 - ty1);
  const ix2 = tx1 + slope * (y2 - ty1);
  const arcR = 22;
  return (
    <Wrapper width={500} height={250}>
      {/* Two lines */}
      <line x1={60} y1={y1} x2={420} y2={y1} stroke={purple} strokeWidth={2} />
      <line x1={60} y1={y2} x2={420} y2={y2} stroke={purple} strokeWidth={2} />
      <Label x={425} y={y1 + 5} text="a" color={purple} size={13} anchor="start" />
      <Label x={425} y={y2 + 5} text="b" color={purple} size={13} anchor="start" />
      {/* Transversal */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={purple} strokeWidth={2} />
      <Dot x={ix1} y={y1} r={4} />
      <Dot x={ix2} y={y2} r={4} />
      {/* Equal corresponding angles */}
      <path d={`M ${ix1 + arcR},${y1} A ${arcR} ${arcR} 0 0 0 ${ix1 + arcR * 0.38},${y1 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix1 + 28} y={y1 - 8} text="∠1" color={pink} size={12} anchor="start" />
      <path d={`M ${ix2 + arcR},${y2} A ${arcR} ${arcR} 0 0 0 ${ix2 + arcR * 0.38},${y2 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix2 + 28} y={y2 - 8} text="∠2" color={pink} size={12} anchor="start" />
      {/* Arrow marks >> on parallel lines */}
      <Label x={330} y={y1 - 4} text="▸▸" color={amber} size={10} />
      <Label x={330} y={y2 - 4} text="▸▸" color={amber} size={10} />
      {/* Conclusion */}
      <Label x={250} y={220} text="∠1 = ∠2（同位角相等）" color={pink} size={13} />
      <Label x={250} y={240} text="→ a ∥ b（两直线平行）" color={purple} size={13} />
    </Wrapper>
  );
}

/** Diagram: properties of parallel lines */
function ParallelProperties() {
  const y1 = 60, y2 = 160;
  const tx1 = 155, ty1 = 10, tx2 = 305, ty2 = 210;
  const slope = (tx2 - tx1) / (ty2 - ty1);
  const ix1 = tx1 + slope * (y1 - ty1);
  const ix2 = tx1 + slope * (y2 - ty1);
  const arcR = 24;
  return (
    <Wrapper width={520} height={280}>
      {/* Parallel lines with >> marks */}
      <line x1={50} y1={y1} x2={430} y2={y1} stroke={purple} strokeWidth={2} />
      <line x1={50} y1={y2} x2={430} y2={y2} stroke={purple} strokeWidth={2} />
      <Label x={435} y={y1 + 5} text="a" color={purple} size={13} anchor="start" />
      <Label x={435} y={y2 + 5} text="b" color={purple} size={13} anchor="start" />
      <Label x={340} y={y1 - 4} text="▸▸" color={amber} size={10} />
      <Label x={340} y={y2 - 4} text="▸▸" color={amber} size={10} />
      {/* Transversal */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={purple} strokeWidth={2} />
      <Dot x={ix1} y={y1} r={4} />
      <Dot x={ix2} y={y2} r={4} />
      {/* Corresponding angles (pink) */}
      <path d={`M ${ix1 + arcR},${y1} A ${arcR} ${arcR} 0 0 0 ${ix1 + arcR * 0.38},${y1 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix1 + 30} y={y1 - 8} text="∠1" color={pink} size={11} anchor="start" />
      <path d={`M ${ix2 + arcR},${y2} A ${arcR} ${arcR} 0 0 0 ${ix2 + arcR * 0.38},${y2 - arcR * 0.92}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ix2 + 30} y={y2 - 8} text="∠2" color={pink} size={11} anchor="start" />
      {/* Alternate interior angles (amber) */}
      <path d={`M ${ix1 - arcR},${y1} A ${arcR} ${arcR} 0 0 0 ${ix1 - arcR * 0.38},${y1 + arcR * 0.92}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={ix1 - 34} y={y1 + 24} text="∠3" color={amber} size={11} anchor="end" />
      {/* Co-interior angles (green) */}
      <path d={`M ${ix1 + arcR},${y1} A ${arcR} ${arcR} 0 0 1 ${ix1 + arcR * 0.38},${y1 + arcR * 0.92}`} fill="none" stroke="#10B981" strokeWidth={2} />
      <Label x={ix1 + 30} y={y1 + 24} text="∠4" color="#10B981" size={11} anchor="start" />
      {/* Three properties */}
      <Label x={260} y={210} text="a ∥ b →" color={purple} size={13} />
      <Label x={260} y={230} text="同位角相等: ∠1 = ∠2　内错角相等: ∠3 = ∠2" color={gray} size={11} />
      <Label x={260} y={250} text="同旁内角互补: ∠4 + ∠2 = 180°" color={gray} size={11} />
    </Wrapper>
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

/** Map concept IDs to their diagrams */
const diagramMap: Record<string, React.ReactNode[]> = {
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
};

export default function GeometryDiagram({ conceptId }: { conceptId: string }) {
  const diagrams = diagramMap[conceptId];
  if (!diagrams) return null;
  return <div className="space-y-2">{diagrams}</div>;
}

export function hasGeometryDiagram(conceptId: string): boolean {
  return conceptId in diagramMap;
}
