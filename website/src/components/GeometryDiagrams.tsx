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

function AngleDiagram() {
  const cx = 100, cy = 130;
  // Angle 30 degrees
  const bx = cx + 200 * Math.cos(-30 * Math.PI / 180);
  const by = cy + 200 * Math.sin(-30 * Math.PI / 180);
  // Arc at radius 50
  const ax = cx + 50 * Math.cos(-30 * Math.PI / 180);
  const ay = cy + 50 * Math.sin(-30 * Math.PI / 180);

  return (
    <Wrapper width={360} height={180}>
      {/* Ray OA - horizontal */}
      <line x1={cx} y1={cy} x2={320} y2={cy} stroke={purple} strokeWidth={2} />
      <polygon points={`325,${cy} 315,${cy - 5} 315,${cy + 5}`} fill={purple} />
      {/* Ray OB - angled up at 30 deg */}
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke={purple} strokeWidth={2} />
      {/* Better arrow for OB */}
      <g transform={`translate(${bx},${by}) rotate(-30)`}>
        <polygon points="5,0 -5,-4 -5,4" fill={purple} />
      </g>
      {/* Arc for angle */}
      <path d={`M ${cx + 50},${cy} A 50 50 0 0 0 ${ax},${ay}`} fill="none" stroke={pink} strokeWidth={1.5} />
      {/* Labels */}
      <Dot x={cx} y={cy} r={5} />
      <Label x={cx - 10} y={cy + 18} text="O" color={pink} />
      <Label x={325} y={cy + 18} text="A" color={purple} />
      <Label x={bx + 5} y={by - 5} text="B" color={purple} anchor="start" />
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

function AngleBisector() {
  const cx = 80, cy = 140;
  const rad = Math.PI / 180;
  const angB = -40 * rad, angC = -20 * rad, angA = 0;
  const rL = 260;
  const bx = cx + rL * Math.cos(angB), by = cy + rL * Math.sin(angB);
  const cx_line = cx + rL * Math.cos(angC), cy_line = cy + rL * Math.sin(angC);
  const ax = cx + rL * Math.cos(angA), ay = cy + rL * Math.sin(angA);

  const arc = (r: number, a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    return `M ${x1},${y1} A ${r} ${r} 0 0 0 ${x2},${y2}`;
  };

  return (
    <Wrapper width={380} height={180}>
      {/* Ray OA */}
      <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={purple} strokeWidth={2} />
      <polygon points={`${ax + 5},${ay} ${ax - 5},${ay - 4} ${ax - 5},${ay + 4}`} fill={purple} />
      {/* Ray OB */}
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke={purple} strokeWidth={2} />
      <g transform={`translate(${bx},${by}) rotate(-40)`}><polygon points="5,0 -5,-4 -5,4" fill={purple} /></g>
      {/* Bisector OC (dashed) */}
      <line x1={cx} y1={cy} x2={cx_line} y2={cy_line} stroke={pink} strokeWidth={1.5} strokeDasharray="5,4" />
      {/* Equal angle marks */}
      <path d={arc(40, angA, angC)} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={arc(45, angA, angC)} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={arc(40, angC, angB)} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      <path d={arc(45, angC, angB)} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
      {/* Labels */}
      <Dot x={cx} y={cy} r={5} />
      <Label x={cx - 12} y={cy + 16} text="O" color={pink} />
      <Label x={ax + 8} y={ay + 16} text="A" color={purple} />
      <Label x={bx + 5} y={by - 5} text="B" color={purple} anchor="start" />
      <Label x={cx_line + 5} y={cy_line - 5} text="C" color={pink} anchor="start" />
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
  // Transversal: Top-Right to Bottom-Left for standard ∠1 acute look
  const tx1 = 305, ty1 = 10, tx2 = 155, ty2 = 210;
  const slope = (tx2 - tx1) / (ty2 - ty1); // -150/200 = -0.75
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
        <Label x={120} y={y1 - 4} text="▸▸" color={amber} size={10} />
        <Label x={120} y={y2 - 4} text="▸▸" color={amber} size={10} />
      </>}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={purple} strokeWidth={2} />
      <Label x={tx1 + 6} y={ty1 + 4} text="c" color={purple} size={13} anchor="start" />
      <Dot x={ix1} y={y1} r={4} />
      <Dot x={ix2} y={y2} r={4} />
      {children(ix1, y1, ix2, y2, arcR)}
    </Wrapper>
  );
}

/* Arc helpers for the 8 standard angles at an intersection. 
   Transversal angle: atan2(200, -150) = 126.87 deg.
   Upper ray: -53.13 deg (cos=0.6, sin=-0.8)
   Lower ray: 126.87 deg (cos=-0.6, sin=0.8)
*/
function arcUpperRight(ix: number, y: number, r: number) {
  // From Right (0) to Upper-Right (-53.13 deg)
  return `M ${ix + r},${y} A ${r} ${r} 0 0 0 ${ix + r * 0.6},${y - r * 0.8}`;
}
function arcUpperLeft(ix: number, y: number, r: number) {
  // From Upper-Right (-53.13 deg) to Left (180 deg)
  return `M ${ix + r * 0.6},${y - r * 0.8} A ${r} ${r} 0 0 0 ${ix - r},${y}`;
}
function arcLowerLeft(ix: number, y: number, r: number) {
  // From Left (180) to Lower-Left (126.87 deg)
  return `M ${ix - r},${y} A ${r} ${r} 0 0 0 ${ix - r * 0.6},${y + r * 0.8}`;
}
function arcLowerRight(ix: number, y: number, r: number) {
  // From Lower-Left (126.87 deg) to Right (0)
  return `M ${ix - r * 0.6},${y + r * 0.8} A ${r} ${r} 0 0 0 ${ix + r},${y}`;
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
  const rad = Math.PI / 180;
  const ang = Math.atan2(55, 90); // ~31.4 deg
  const r = 24;
  
  const p = (a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  
  return (
    <Wrapper width={500} height={230}>
      {/* Title: if...then... structure */}
      <rect x={80} y={10} width={340} height={36} rx={6} fill="none" stroke={purple} strokeWidth={1.5} />
      <Label x={250} y={33} text="命题结构: 如果……那么……" color={purple} size={14} />
      {/* Two intersecting lines */}
      <line x1={cx - len} y1={cy - 55} x2={cx + len} y2={cy + 55} stroke={purple} strokeWidth={2} />
      <line x1={cx - len} y1={cy + 55} x2={cx + len} y2={cy - 55} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={4} />
      {/* Mark equal vertical angle pair 1 (Right and Left) */}
      <path d={`M ${p(-ang).x},${p(-ang).y} A ${r} ${r} 0 0 1 ${p(ang).x},${p(ang).y}`} fill="none" stroke={pink} strokeWidth={2} />
      <path d={`M ${p(Math.PI - ang).x},${p(Math.PI - ang).y} A ${r} ${r} 0 0 1 ${p(Math.PI + ang).x},${p(Math.PI + ang).y}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={cx + 30} y={cy + 4} text="α" color={pink} size={13} anchor="start" />
      <Label x={cx - 30} y={cy + 4} text="α" color={pink} size={13} anchor="end" />
      {/* Mark equal vertical angle pair 2 (Top and Bottom) */}
      <path d={`M ${p(Math.PI + ang).x},${p(Math.PI + ang).y} A ${r} ${r} 0 0 1 ${p(2 * Math.PI - ang).x},${p(2 * Math.PI - ang).y}`} fill="none" stroke={amber} strokeWidth={2} />
      <path d={`M ${p(ang).x},${p(ang).y} A ${r} ${r} 0 0 1 ${p(Math.PI - ang).x},${p(Math.PI - ang).y}`} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={cx} y={cy - 30} text="β" color={amber} size={13} />
      <Label x={cx} y={cy + 38} text="β" color={amber} size={13} />
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
      <polygon points="50,175 175,175 50,50" fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      {/* Right angle */}
      <polyline points="50,160 64,160 64,175" fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Tick marks on legs */}
      <line x1={43} y1={112} x2={57} y2={112} stroke={purple} strokeWidth={1.8} />
      <line x1={112} y1={181} x2={112} y2={168} stroke={purple} strokeWidth={1.8} />
      {/* Labels */}
      <Label x={34} y={115} text="1" color={purple} size={13} anchor="end" />
      <Label x={112} y={192} text="1" color={purple} size={13} />
      <Label x={128} y={110} text="√2" color={pink} size={13} />
      {/* Angles */}
      <Label x={60} y={75} text="45°" color={amber} size={12} anchor="start" />
      <Label x={160} y={165} text="45°" color={amber} size={12} anchor="end" />

      {/* Right: 30-60-90 triangle (60 at top) */}
      <Label x={370} y={18} text="30-60-90 三角形" color={purple} size={12} />
      <polygon points="270,175 350,175 270,36.4" fill="rgba(236,72,153,0.08)" stroke={pink} strokeWidth={2} />
      <polyline points="270,160 284,160 284,175" fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Labels */}
      <Label x={254} y={105} text="√3" color="#3B82F6" size={13} anchor="end" />
      <Label x={310} y={188} text="1" color={purple} size={13} />
      <Label x={330} y={100} text="2" color={pink} size={13} />
      {/* Angles */}
      <Label x={282} y={62} text="30°" color={amber} size={12} anchor="start" />
      <Label x={335} y={165} text="60°" color={amber} size={12} anchor="end" />
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
  const ax = 230, ay = 39;
  const bx = 140, by = 195;
  const cx2 = 320, cy2 = 195;
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
      <Label x={ax + 14} y={ay + 24} text="60°" color={amber} size={11} anchor="start" />
      <Label x={bx + 24} y={by - 4} text="60°" color={amber} size={11} anchor="start" />
      <Label x={cx2 - 22} y={cy2 - 4} text="60°" color={amber} size={11} anchor="end" />
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

/** Diagram: Parallelogram ABCD with properties — opposite sides/angles equal, diagonals bisect */
function ParallelogramProperties() {
  // Parallelogram ABCD: A top-left, B top-right, C bottom-right, D bottom-left
  const ax = 120, ay = 40, bx = 340, by = 40, cx = 380, cy = 170, dx = 80, dy = 170;
  const ox = (ax + cx) / 2, oy = (ay + cy) / 2; // diagonal intersection
  function tick(x1: number, y1: number, x2: number, y2: number, n: number, color: string, id: string) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
    const marks: React.ReactNode[] = [];
    for (let k = 0; k < n; k++) {
      const off = (k - (n - 1) / 2) * 6;
      const dx2 = (x2 - x1) / len * off, dy2 = (y2 - y1) / len * off;
      marks.push(<line key={`${id}${k}`} x1={mx + px + dx2} y1={my + py + dy2} x2={mx - px + dx2} y2={my - py + dy2} stroke={color} strokeWidth={2} />);
    }
    return <>{marks}</>;
  }
  return (
    <Wrapper width={460} height={210}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
      {/* Diagonals */}
      <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={lightGray} strokeWidth={1.5} strokeDasharray="6,3" />
      <line x1={bx} y1={by} x2={dx} y2={dy} stroke={lightGray} strokeWidth={1.5} strokeDasharray="6,3" />
      <Dot x={ox} y={oy} color={amber} r={4} />
      <Label x={ox + 10} y={oy - 8} text="O" color={amber} />
      {/* Opposite side tick marks: AB‖CD (1 tick), AD‖BC (2 ticks) */}
      {tick(ax, ay, bx, by, 1, pink, "ab")}
      {tick(dx, dy, cx, cy, 1, pink, "dc")}
      {tick(ax, ay, dx, dy, 2, purple, "ad")}
      {tick(bx, by, cx, cy, 2, purple, "bc")}
      {/* Vertex labels */}
      <Label x={ax - 8} y={ay - 8} text="A" color={pink} />
      <Label x={bx + 8} y={by - 8} text="B" color={pink} />
      <Label x={cx + 10} y={cy + 14} text="C" color={pink} />
      <Label x={dx - 14} y={dy + 14} text="D" color={pink} />
      {/* Equal angle arcs at A and C */}
      <path d={`M ${ax + 20},${ay} A 12 12 0 0 1 ${ax + 12},${ay + 16}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <path d={`M ${cx - 20},${cy} A 12 12 0 0 1 ${cx - 12},${cy - 16}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <Label x={230} y={205} text="OA=OC, OB=OD（对角线互相平分）" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: 3 criteria for parallelogram — side by side */
function ParallelogramCriteria() {
  // Three small parallelograms
  const w = 480, h = 170;
  function mini(ox: number, label: string, subtitle: string) {
    const ax = ox, ay = 35, bx = ox + 80, by = 35, cx = ox + 95, cy = 110, dx = ox + 15, dy = 110;
    return (
      <g>
        <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={1.8} />
        <Label x={(ax + cx) / 2} y={15} text={label} color={purple} size={12} />
        <Label x={(ax + cx) / 2} y={135} text={subtitle} color={gray} size={10} />
      </g>
    );
  }
  return (
    <Wrapper width={w} height={h}>
      {mini(20, "(a) 两组对边平行", "AB‖CD, AD‖BC")}
      {mini(175, "(b) 两组对边相等", "AB=CD, AD=BC")}
      {mini(330, "(c) 对角线互相平分", "OA=OC, OB=OD")}
      {/* Diagonal cross for (c) */}
      <line x1={330} y1={35} x2={425} y2={110} stroke={lightGray} strokeWidth={1.2} strokeDasharray="4,3" />
      <line x1={410} y1={35} x2={345} y2={110} stroke={lightGray} strokeWidth={1.2} strokeDasharray="4,3" />
      <Dot x={377} y={72} color={amber} r={3} />
      <Label x={240} y={162} text="满足任一条件即可判定为平行四边形" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Rectangle with right angles, equal diagonals */
function RectangleDiagram() {
  const ax = 80, ay = 35, bx = 380, by = 35, cx = 380, cy = 175, dx = 80, dy = 175;
  const ox2 = (ax + cx) / 2, oy2 = (ay + cy) / 2;
  const sq = 12; // right-angle square size
  return (
    <Wrapper width={460} height={210}>
      <rect x={ax} y={ay} width={bx - ax} height={cy - ay} fill="rgba(139,92,246,0.06)" stroke={purple} strokeWidth={2} rx={2} />
      {/* Diagonals */}
      <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={amber} strokeWidth={1.5} />
      <line x1={bx} y1={by} x2={dx} y2={dy} stroke={amber} strokeWidth={1.5} />
      <Dot x={ox2} y={oy2} color={amber} r={4} />
      <Label x={ox2 + 12} y={oy2 - 6} text="O" color={amber} />
      {/* Right angle marks at 4 corners */}
      {[[ax, ay, 1, 1], [bx, by, -1, 1], [cx, cy, -1, -1], [dx, dy, 1, -1]].map(([x, y, sx, sy], i) => (
        <polyline key={`ra${i}`} points={`${x + sq * sx},${y} ${x + sq * sx},${y + sq * sy} ${x},${y + sq * sy}`} fill="none" stroke={gray} strokeWidth={1.2} />
      ))}
      {/* Vertex labels */}
      <Label x={ax - 12} y={ay - 6} text="A" color={pink} />
      <Label x={bx + 10} y={by - 6} text="B" color={pink} />
      <Label x={cx + 10} y={cy + 14} text="C" color={pink} />
      <Label x={dx - 12} y={dy + 14} text="D" color={pink} />
      <Label x={230} y={205} text="∠=90°, AC=BD, OA=OB=OC=OD" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Rhombus with equal sides, perpendicular diagonals */
function RhombusDiagram() {
  const cx3 = 230, top = 20, bot = 190, left = 100, right = 360;
  const cy3 = (top + bot) / 2;
  // Rhombus: top, right, bottom, left
  const pts = `${cx3},${top} ${right},${cy3} ${cx3},${bot} ${left},${cy3}`;
  function tick(x1: number, y1: number, x2: number, y2: number, id: string) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
    return <line key={id} x1={mx + px} y1={my + py} x2={mx - px} y2={my - py} stroke={pink} strokeWidth={2} />;
  }
  return (
    <Wrapper width={460} height={220}>
      <polygon points={pts} fill="rgba(139,92,246,0.07)" stroke={purple} strokeWidth={2} />
      {/* Diagonals */}
      <line x1={cx3} y1={top} x2={cx3} y2={bot} stroke={lightGray} strokeWidth={1.5} />
      <line x1={left} y1={cy3} x2={right} y2={cy3} stroke={lightGray} strokeWidth={1.5} />
      {/* Perpendicular mark at center */}
      <polyline points={`${cx3 + 10},${cy3} ${cx3 + 10},${cy3 - 10} ${cx3},${cy3 - 10}`} fill="none" stroke={gray} strokeWidth={1.5} />
      {/* Equal side ticks */}
      {tick(cx3, top, right, cy3, "s1")}
      {tick(right, cy3, cx3, bot, "s2")}
      {tick(cx3, bot, left, cy3, "s3")}
      {tick(left, cy3, cx3, top, "s4")}
      {/* Vertex labels */}
      <Label x={cx3} y={top - 8} text="A" color={pink} />
      <Label x={right + 10} y={cy3 + 4} text="B" color={pink} />
      <Label x={cx3} y={bot + 16} text="C" color={pink} />
      <Label x={left - 14} y={cy3 + 4} text="D" color={pink} />
      <Dot x={cx3} y={cy3} color={amber} r={3} />
      <Label x={cx3 + 14} y={cy3 + 16} text="O" color={amber} />
      <Label x={230} y={215} text="四边相等，对角线互相垂直平分且平分顶角" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Square — combining rectangle and rhombus properties */
function SquareDiagram() {
  const s = 130, mx2 = 230, my2 = 105;
  const ax = mx2 - s / 2, ay = my2 - s / 2, bx2 = mx2 + s / 2, by2 = my2 - s / 2;
  const cx4 = mx2 + s / 2, cy4 = my2 + s / 2, dx3 = mx2 - s / 2, dy3 = my2 + s / 2;
  const sq = 10;
  function tick(x1: number, y1: number, x2: number, y2: number, id: string) {
    const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
    return <line key={id} x1={tmx + px} y1={tmy + py} x2={tmx - px} y2={tmy - py} stroke={pink} strokeWidth={2} />;
  }
  return (
    <Wrapper width={460} height={220}>
      <rect x={ax} y={ay} width={s} height={s} fill="rgba(139,92,246,0.06)" stroke={purple} strokeWidth={2} />
      {/* Diagonals */}
      <line x1={ax} y1={ay} x2={cx4} y2={cy4} stroke={amber} strokeWidth={1.3} />
      <line x1={bx2} y1={by2} x2={dx3} y2={dy3} stroke={amber} strokeWidth={1.3} />
      {/* Perpendicular mark at center */}
      <polyline points={`${mx2 + 8},${my2} ${mx2 + 8},${my2 - 8} ${mx2},${my2 - 8}`} fill="none" stroke={gray} strokeWidth={1.2} />
      {/* Right angle marks at corners */}
      {[[ax, ay, 1, 1], [bx2, by2, -1, 1], [cx4, cy4, -1, -1], [dx3, dy3, 1, -1]].map(([x, y, sx, sy], i) => (
        <polyline key={`sq${i}`} points={`${x + sq * sx},${y} ${x + sq * sx},${y + sq * sy} ${x},${y + sq * sy}`} fill="none" stroke={gray} strokeWidth={1} />
      ))}
      {/* Equal side ticks */}
      {tick(ax, ay, bx2, by2, "t1")}
      {tick(bx2, by2, cx4, cy4, "t2")}
      {tick(cx4, cy4, dx3, dy3, "t3")}
      {tick(dx3, dy3, ax, ay, "t4")}
      {/* Vertex labels */}
      <Label x={ax - 10} y={ay - 6} text="A" color={pink} />
      <Label x={bx2 + 10} y={by2 - 6} text="B" color={pink} />
      <Label x={cx4 + 10} y={cy4 + 14} text="C" color={pink} />
      <Label x={dx3 - 10} y={dy3 + 14} text="D" color={pink} />
      <Label x={230} y={210} text="正方形 = 矩形 ∩ 菱形：等边、等角、等对角线、对角线互相垂直" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Trapezoid with parallel sides, height, area formula */
function TrapezoidDiagram() {
  const ax = 160, ay = 40, bx = 320, by = 40; // top base (a)
  const cx5 = 400, cy5 = 170, dx4 = 80, dy4 = 170; // bottom base (b)
  const hx = 240; // height drop x
  return (
    <Wrapper width={480} height={210}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx5},${cy5} ${dx4},${dy4}`} fill="rgba(139,92,246,0.06)" stroke={purple} strokeWidth={2} />
      {/* Parallel marks on top and bottom */}
      <Label x={(ax + bx) / 2} y={ay - 10} text="a (上底)" color={purple} size={12} />
      <Label x={(dx4 + cx5) / 2} y={cy5 + 18} text="b (下底)" color={purple} size={12} />
      {/* Parallel arrows */}
      <line x1={ax + 30} y1={ay + 4} x2={bx - 30} y2={by + 4} stroke={purple} strokeWidth={0} />
      {/* // marks on top */}
      <line x1={(ax + bx) / 2 - 4} y1={ay + 7} x2={(ax + bx) / 2 - 8} y2={ay + 15} stroke={purple} strokeWidth={1.5} />
      <line x1={(ax + bx) / 2 + 4} y1={ay + 7} x2={(ax + bx) / 2} y2={ay + 15} stroke={purple} strokeWidth={1.5} />
      {/* // marks on bottom */}
      <line x1={(dx4 + cx5) / 2 - 4} y1={cy5 - 15} x2={(dx4 + cx5) / 2 - 8} y2={cy5 - 7} stroke={purple} strokeWidth={1.5} />
      <line x1={(dx4 + cx5) / 2 + 4} y1={cy5 - 15} x2={(dx4 + cx5) / 2} y2={cy5 - 7} stroke={purple} strokeWidth={1.5} />
      {/* Height line */}
      <line x1={hx} y1={ay} x2={hx} y2={cy5} stroke={pink} strokeWidth={1.5} strokeDasharray="5,3" />
      <polyline points={`${hx + 8},${cy5} ${hx + 8},${cy5 - 8} ${hx},${cy5 - 8}`} fill="none" stroke={gray} strokeWidth={1.2} />
      <Label x={hx + 16} y={(ay + cy5) / 2 + 4} text="h" color={pink} size={14} anchor="start" />
      {/* Area formula */}
      <Label x={240} y={205} text="S = (a + b) × h ÷ 2" color={amber} size={13} />
    </Wrapper>
  );
}

/** Diagram: Midsegment theorem — DE ‖ BC, DE = BC/2 */
function MidsegmentTheorem() {
  const ax = 230, ay = 25, bx = 70, by = 185, cx6 = 400, cy6 = 185;
  // Midpoints D on AB, E on AC
  const ddx = (ax + bx) / 2, ddy = (ay + by) / 2;
  const ex = (ax + cx6) / 2, ey = (ay + cy6) / 2;
  return (
    <Wrapper width={470} height={220}>
      {/* Full triangle */}
      <polygon points={`${ax},${ay} ${bx},${by} ${cx6},${cy6}`} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      {/* Midsegment DE */}
      <line x1={ddx} y1={ddy} x2={ex} y2={ey} stroke={amber} strokeWidth={2.5} />
      {/* Midpoint ticks on AB: AD=DB */}
      {[[ax, ay, ddx, ddy], [ddx, ddy, bx, by]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const len = Math.hypot(x2 - x1, y2 - y1);
        const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
        return <line key={`ab${i}`} x1={tmx + px} y1={tmy + py} x2={tmx - px} y2={tmy - py} stroke={pink} strokeWidth={2} />;
      })}
      {/* Midpoint ticks on AC: AE=EC */}
      {[[ax, ay, ex, ey], [ex, ey, cx6, cy6]].map(([x1, y1, x2, y2], i) => {
        const tmx = (x1 + x2) / 2, tmy = (y1 + y2) / 2;
        const len = Math.hypot(x2 - x1, y2 - y1);
        const px = -(y2 - y1) / len * 7, py = (x2 - x1) / len * 7;
        return <line key={`ac${i}`} x1={tmx + px} y1={tmy + py} x2={tmx - px} y2={tmy - py} stroke={pink} strokeWidth={2} />;
      })}
      {/* Parallel marks on DE and BC */}
      <line x1={(ddx + ex) / 2 - 4} y1={(ddy + ey) / 2 - 8} x2={(ddx + ex) / 2 - 8} y2={(ddy + ey) / 2} stroke={amber} strokeWidth={1.5} />
      <line x1={(ddx + ex) / 2 + 4} y1={(ddy + ey) / 2 - 8} x2={(ddx + ex) / 2} y2={(ddy + ey) / 2} stroke={amber} strokeWidth={1.5} />
      <line x1={(bx + cx6) / 2 - 4} y1={cy6 - 8} x2={(bx + cx6) / 2 - 8} y2={cy6} stroke={purple} strokeWidth={1.5} />
      <line x1={(bx + cx6) / 2 + 4} y1={cy6 - 8} x2={(bx + cx6) / 2} y2={cy6} stroke={purple} strokeWidth={1.5} />
      {/* Vertex labels */}
      <Label x={ax} y={ay - 8} text="A" color={pink} />
      <Label x={bx - 14} y={by + 14} text="B" color={pink} />
      <Label x={cx6 + 8} y={cy6 + 14} text="C" color={pink} />
      <Dot x={ddx} y={ddy} color={amber} r={4} /><Label x={ddx - 16} y={ddy - 4} text="D" color={amber} />
      <Dot x={ex} y={ey} color={amber} r={4} /><Label x={ex + 10} y={ey - 4} text="E" color={amber} />
      <Label x={235} y={212} text="DE ‖ BC，DE = ½BC（三角形中位线定理）" color={gray} size={11} />
    </Wrapper>
  );
}

// ─── Linear & Quadratic Function Diagrams ───

function FunctionConceptDiagram() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md mx-auto my-4">
      {/* Function machine box */}
      <rect x="150" y="30" width="120" height="60" rx="12" fill="#EDE9FE" stroke={purple} strokeWidth="2"/>
      <text x="210" y="68" textAnchor="middle" fontSize="28" fontWeight="bold" fill={purple}>f</text>
      {/* Input arrow */}
      <defs>
        <marker id="arrowFC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={gray}/>
        </marker>
      </defs>
      <line x1="60" y1="60" x2="148" y2="60" stroke={gray} strokeWidth="2" markerEnd="url(#arrowFC)"/>
      <text x="50" y="65" textAnchor="end" fontSize="14" fontWeight="bold" fill={purple}>x</text>
      {/* Output arrow */}
      <line x1="272" y1="60" x2="360" y2="60" stroke={gray} strokeWidth="2" markerEnd="url(#arrowFC)"/>
      <text x="370" y="65" textAnchor="start" fontSize="14" fontWeight="bold" fill={pink}>y</text>
      {/* Mapping examples below */}
      {[{x: "1", y: "3"}, {x: "2", y: "5"}, {x: "3", y: "7"}].map((p, i) => {
        const cy = 120 + i * 26;
        return (
          <g key={i}>
            <circle cx="130" cy={cy} r="14" fill="#EDE9FE" stroke={purple} strokeWidth="1.5"/>
            <text x="130" y={cy + 5} textAnchor="middle" fontSize="12" fill={purple}>{p.x}</text>
            <line x1="146" y1={cy} x2="264" y2={cy} stroke={lightGray} strokeWidth="1" strokeDasharray="4,3"/>
            <polygon points={`264,${cy} 258,${cy - 3} 258,${cy + 3}`} fill={lightGray}/>
            <circle cx="280" cy={cy} r="14" fill="#FCE7F3" stroke={pink} strokeWidth="1.5"/>
            <text x="280" y={cy + 5} textAnchor="middle" fontSize="12" fill={pink}>{p.y}</text>
          </g>
        );
      })}
      <text x="210" y="198" textAnchor="middle" fontSize="11" fill={gray}>每个 x 对应唯一的 y</text>
    </svg>
  );
}

function DirectProportionDiagram() {
  const ox = 160, oy = 160, s = 30;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;
  return (
    <svg viewBox="0 0 340 200" className="w-full max-w-md mx-auto my-4">
      {/* Axes */}
      <line x1={toX(-2)} y1={oy} x2={toX(5)} y2={oy} stroke={gray} strokeWidth="1.5"/>
      <line x1={ox} y1={toY(-1)} x2={ox} y2={toY(5)} stroke={gray} strokeWidth="1.5"/>
      <text x={toX(5) + 4} y={oy + 4} fontSize="12" fill={gray}>x</text>
      <text x={ox + 6} y={toY(5) - 2} fontSize="12" fill={gray}>y</text>
      <text x={ox - 12} y={oy + 14} fontSize="11" fill={gray}>O</text>
      {/* y=2x (steep, purple) */}
      <line x1={toX(-0.5)} y1={toY(-1)} x2={toX(2.3)} y2={toY(4.6)} stroke={purple} strokeWidth="2"/>
      <text x={toX(2.5)} y={toY(4.8)} fontSize="12" fontWeight="bold" fill={purple}>y=2x</text>
      {/* y=0.5x (gentle, amber) */}
      <line x1={toX(-1)} y1={toY(-0.5)} x2={toX(4.5)} y2={toY(2.25)} stroke={amber} strokeWidth="2"/>
      <text x={toX(4.6)} y={toY(2)} fontSize="12" fontWeight="bold" fill={amber}>y=0.5x</text>
      {/* Origin dot */}
      <circle cx={ox} cy={oy} r="3" fill={pink}/>
    </svg>
  );
}

function LinearFunctionDefinition() {
  const ox = 120, oy = 170, s = 35;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;
  // line: y = 0.8x + 2
  const x1 = -1, y1v = 0.8 * x1 + 2;
  const x2 = 4.5, y2v = 0.8 * x2 + 2;
  return (
    <svg viewBox="0 0 380 230" className="w-full max-w-md mx-auto my-4">
      {/* Axes */}
      <line x1={toX(-1.5)} y1={oy} x2={toX(5)} y2={oy} stroke={gray} strokeWidth="1.5"/>
      <line x1={ox} y1={toY(-0.5)} x2={ox} y2={toY(5.5)} stroke={gray} strokeWidth="1.5"/>
      <text x={toX(5) + 4} y={oy + 4} fontSize="12" fill={gray}>x</text>
      <text x={ox + 6} y={toY(5.5) - 2} fontSize="12" fill={gray}>y</text>
      <text x={ox - 12} y={oy + 14} fontSize="11" fill={gray}>O</text>
      {/* Line y = 0.8x + 2 */}
      <line x1={toX(x1)} y1={toY(y1v)} x2={toX(x2)} y2={toY(y2v)} stroke={purple} strokeWidth="2.5"/>
      {/* y-intercept b */}
      <circle cx={ox} cy={toY(2)} r="4" fill={pink}/>
      <text x={ox - 8} y={toY(2) - 8} textAnchor="end" fontSize="12" fontWeight="bold" fill={pink}>b (截距)</text>
      {/* Rise/run triangle: from (1,2.8) to (3,2.8) to (3,4.4) */}
      <line x1={toX(1)} y1={toY(2.8)} x2={toX(3)} y2={toY(2.8)} stroke={amber} strokeWidth="1.5" strokeDasharray="4,3"/>
      <line x1={toX(3)} y1={toY(2.8)} x2={toX(3)} y2={toY(4.4)} stroke={amber} strokeWidth="1.5" strokeDasharray="4,3"/>
      <text x={toX(2)} y={toY(2.8) + 14} textAnchor="middle" fontSize="11" fill={amber}>Δx</text>
      <text x={toX(3) + 14} y={toY(3.6)} textAnchor="start" fontSize="11" fill={amber}>Δy</text>
      <text x={toX(3.5)} y={toY(4.8)} fontSize="12" fontWeight="bold" fill={purple}>y = kx + b</text>
      {/* Note */}
      <text x="190" y="225" textAnchor="middle" fontSize="11" fill={gray}>{"k>0 上升，k<0 下降"}</text>
    </svg>
  );
}

function SlopeInterceptDiagram() {
  const cases: { label: string; kPos: boolean; bPos: boolean }[] = [
    { label: "k>0, b>0", kPos: true, bPos: true },
    { label: "k>0, b<0", kPos: true, bPos: false },
    { label: "k<0, b>0", kPos: false, bPos: true },
    { label: "k<0, b<0", kPos: false, bPos: false },
  ];
  const cellW = 160, cellH = 130;
  return (
    <svg viewBox="0 0 340 280" className="w-full max-w-md mx-auto my-4">
      {cases.map((c, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const cx = 20 + col * 170 + cellW / 2;
        const cy = 10 + row * 140 + cellH / 2;
        const ax = cx, ay = cy;
        const halfW = 55, halfH = 45;
        const k = c.kPos ? 0.7 : -0.7;
        const b = c.bPos ? 20 : -20;
        const lx1 = ax - halfW, ly1 = ay - (k * (-halfW) + b);
        const lx2 = ax + halfW, ly2 = ay - (k * halfW + b);
        return (
          <g key={i}>
            <rect x={cx - cellW / 2 + 10} y={cy - cellH / 2} width={cellW - 20} height={cellH - 10} rx="6" fill="#FAFAF9" stroke={lightGray} strokeWidth="1"/>
            <line x1={ax - halfW - 5} y1={ay} x2={ax + halfW + 5} y2={ay} stroke={gray} strokeWidth="1"/>
            <line x1={ax} y1={ay + halfH + 5} x2={ax} y2={ay - halfH - 5} stroke={gray} strokeWidth="1"/>
            <text x={ax + halfW + 8} y={ay + 4} fontSize="9" fill={gray}>x</text>
            <text x={ax + 4} y={ay - halfH - 8} fontSize="9" fill={gray}>y</text>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={purple} strokeWidth="2"/>
            <circle cx={ax} cy={ay - b} r="3" fill={pink}/>
            <text x={cx} y={cy + cellH / 2 - 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={purple}>{c.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function FunctionsEquationsInequalities() {
  const ox = 140, oy = 170, s = 35;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;
  // y = 2x - 4 → root at x=2
  const xMin = -0.5, xMax = 4.5;
  const yAtMin = 2 * xMin - 4, yAtMax = 2 * xMax - 4;
  return (
    <svg viewBox="0 0 380 230" className="w-full max-w-md mx-auto my-4">
      {/* Shading: y<0 region (x<2) */}
      <polygon points={`${toX(0)},${oy} ${toX(0)},${toY(-4)} ${toX(2)},${oy}`} fill="#FCE7F3" fillOpacity="0.5"/>
      {/* Shading: y>0 region (x>2) */}
      <polygon points={`${toX(2)},${oy} ${toX(4)},${toY(4)} ${toX(4)},${oy}`} fill="#EDE9FE" fillOpacity="0.5"/>
      {/* Axes */}
      <line x1={toX(-1)} y1={oy} x2={toX(5)} y2={oy} stroke={gray} strokeWidth="1.5"/>
      <line x1={ox} y1={toY(-4.5)} x2={ox} y2={toY(5.5)} stroke={gray} strokeWidth="1.5"/>
      <text x={toX(5) + 4} y={oy + 4} fontSize="12" fill={gray}>x</text>
      <text x={ox + 6} y={toY(5.5) - 2} fontSize="12" fill={gray}>y</text>
      <text x={ox - 12} y={oy + 14} fontSize="11" fill={gray}>O</text>
      {/* Line y=2x-4 */}
      <line x1={toX(xMin)} y1={toY(yAtMin)} x2={toX(xMax)} y2={toY(yAtMax)} stroke={purple} strokeWidth="2.5"/>
      <text x={toX(4)} y={toY(4.5)} fontSize="12" fontWeight="bold" fill={purple}>{"y=2x−4"}</text>
      {/* Root point (2,0) */}
      <circle cx={toX(2)} cy={oy} r="4" fill={pink}/>
      <text x={toX(2)} y={oy + 16} textAnchor="middle" fontSize="11" fontWeight="bold" fill={pink}>{"x=2 方程的解"}</text>
      {/* Labels for regions */}
      <text x={toX(0.6)} y={oy - 8} textAnchor="middle" fontSize="10" fill={pink}>{"y<0"}</text>
      <text x={toX(3.3)} y={oy - 8} textAnchor="middle" fontSize="10" fill={purple}>{"y>0"}</text>
      {/* Tick marks */}
      {[1, 2, 3, 4].map(i => (
        <g key={i}>
          <line x1={toX(i)} y1={oy - 3} x2={toX(i)} y2={oy + 3} stroke={gray} strokeWidth="1"/>
          <text x={toX(i)} y={oy + 26} textAnchor="middle" fontSize="9" fill={gray}>{i}</text>
        </g>
      ))}
    </svg>
  );
}

function BasicParabola() {
  const ox = 200, oy = 180, s = 40;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;
  const steps = 40;
  const upPts: string[] = [];
  const downPts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = -2.5 + (5 * i) / steps;
    upPts.push(`${toX(x)},${toY(x * x)}`);
    downPts.push(`${toX(x)},${toY(-x * x)}`);
  }
  return (
    <svg viewBox="0 0 420 280" className="w-full max-w-md mx-auto my-4">
      {/* Axes */}
      <line x1={toX(-3)} y1={oy} x2={toX(3)} y2={oy} stroke={gray} strokeWidth="1.5"/>
      <line x1={ox} y1={toY(-3)} x2={ox} y2={toY(4)} stroke={gray} strokeWidth="1.5"/>
      <text x={toX(3) + 4} y={oy + 4} fontSize="12" fill={gray}>x</text>
      <text x={ox + 8} y={toY(4) - 2} fontSize="12" fill={gray}>y</text>
      <text x={ox - 12} y={oy + 14} fontSize="11" fill={gray}>O</text>
      {/* Axis of symmetry */}
      <line x1={ox} y1={toY(-2.5)} x2={ox} y2={toY(3.5)} stroke={lightGray} strokeWidth="1" strokeDasharray="5,4"/>
      {/* y=x² (purple, upward) */}
      <polyline points={upPts.join(" ")} fill="none" stroke={purple} strokeWidth="2.5"/>
      <text x={toX(1.8)} y={toY(3.5)} fontSize="12" fontWeight="bold" fill={purple}>{"y=x²"}</text>
      <text x={toX(2.6)} y={toY(2.8)} fontSize="10" fill={purple}>{"开口向上 a>0"}</text>
      {/* y=-x² (amber, downward) */}
      <polyline points={downPts.join(" ")} fill="none" stroke={amber} strokeWidth="2.5"/>
      <text x={toX(1.8)} y={toY(-2.5)} fontSize="12" fontWeight="bold" fill={amber}>{"y=−x²"}</text>
      <text x={toX(2.6)} y={toY(-1.8)} fontSize="10" fill={amber}>{"开口向下 a<0"}</text>
      {/* Vertex dot */}
      <circle cx={ox} cy={oy} r="4" fill={pink}/>
    </svg>
  );
}

function VertexFormDiagram() {
  const ox = 140, oy = 200, s = 35;
  const toX = (v: number) => ox + v * s;
  const toY = (v: number) => oy - v * s;
  const steps = 40;
  const basePts: string[] = [];
  const transPts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = -2.5 + (7 * i) / steps;
    const yBase = x * x;
    if (yBase <= 6) basePts.push(`${toX(x)},${toY(yBase)}`);
    const yTrans = (x - 2) * (x - 2) + 1;
    if (yTrans <= 6) transPts.push(`${toX(x)},${toY(yTrans)}`);
  }
  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-md mx-auto my-4">
      <defs>
        <marker id="arrowVF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={pink}/>
        </marker>
      </defs>
      {/* Axes */}
      <line x1={toX(-2.5)} y1={oy} x2={toX(5.5)} y2={oy} stroke={gray} strokeWidth="1.5"/>
      <line x1={ox} y1={toY(-0.5)} x2={ox} y2={toY(6.5)} stroke={gray} strokeWidth="1.5"/>
      <text x={toX(5.5) + 4} y={oy + 4} fontSize="12" fill={gray}>x</text>
      <text x={ox + 6} y={toY(6.5) - 2} fontSize="12" fill={gray}>y</text>
      <text x={ox - 12} y={oy + 14} fontSize="11" fill={gray}>O</text>
      {/* y=x² in light gray */}
      <polyline points={basePts.join(" ")} fill="none" stroke={lightGray} strokeWidth="2" strokeDasharray="5,4"/>
      <text x={toX(-1.8)} y={toY(3.5)} fontSize="11" fill={gray}>{"y=x²"}</text>
      {/* y=(x-2)²+1 in purple */}
      <polyline points={transPts.join(" ")} fill="none" stroke={purple} strokeWidth="2.5"/>
      <text x={toX(4)} y={toY(3)} fontSize="11" fontWeight="bold" fill={purple}>{"y=(x−2)²+1"}</text>
      {/* Translation arrow from (0,0) to (2,1) */}
      <line x1={ox} y1={oy} x2={toX(2) - 4} y2={toY(1) + 4} stroke={pink} strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowVF)"/>
      {/* Vertices */}
      <circle cx={ox} cy={oy} r="3.5" fill={lightGray}/>
      <circle cx={toX(2)} cy={toY(1)} r="4" fill={pink}/>
      <text x={toX(2) + 8} y={toY(1) + 4} textAnchor="start" fontSize="12" fontWeight="bold" fill={pink}>{"(h,k)=(2,1)"}</text>
    </svg>
  );
}

function DiscriminantIntersections() {
  const cellW = 130, cellH = 140;
  const cases = [
    { label: "Δ>0 两个根", shift: 0 },
    { label: "Δ=0 一个根", shift: 1 },
    { label: "Δ<0 无实根", shift: 2 },
  ];
  return (
    <svg viewBox="0 0 420 160" className="w-full max-w-lg mx-auto my-4">
      {cases.map((c, i) => {
        const cx = 30 + i * 140 + cellW / 2;
        const axisY = 110;
        const steps = 30;
        const pts: string[] = [];
        for (let j = 0; j <= steps; j++) {
          const t = -2 + (4 * j) / steps;
          let yVal: number;
          if (c.shift === 0) yVal = t * t - 1;
          else if (c.shift === 1) yVal = t * t;
          else yVal = t * t + 0.8;
          const px = cx + t * 25;
          const py = axisY - yVal * 25;
          pts.push(`${px},${py}`);
        }
        return (
          <g key={i}>
            <rect x={cx - cellW / 2 + 5} y="5" width={cellW - 10} height={cellH} rx="6" fill="#FAFAF9" stroke={lightGray} strokeWidth="1"/>
            <line x1={cx - 55} y1={axisY} x2={cx + 55} y2={axisY} stroke={gray} strokeWidth="1"/>
            <line x1={cx} y1={axisY + 15} x2={cx} y2="20" stroke={gray} strokeWidth="1"/>
            <polyline points={pts.join(" ")} fill="none" stroke={purple} strokeWidth="2"/>
            {c.shift === 0 && <>
              <circle cx={cx - 25} cy={axisY} r="3" fill={pink}/>
              <circle cx={cx + 25} cy={axisY} r="3" fill={pink}/>
            </>}
            {c.shift === 1 && <circle cx={cx} cy={axisY} r="3" fill={pink}/>}
            <text x={cx} y={cellH + 12} textAnchor="middle" fontSize="11" fontWeight="bold" fill={purple}>{c.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Grade 9 Circle Diagrams ───

/** Diagram: circle basic concepts — radius, diameter, chord, arc, central angle */
function CircleBasicConcepts() {
  const cx = 200, cy = 130, r = 90;
  const chordAx = cx - 70, chordAy = cy - 57;
  const chordBx = cx + 85, chordBy = cy - 30;
  return (
    <Wrapper width={440} height={280}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} />
      <Label x={cx - 10} y={cy + 5} text="O" color={pink} />
      {/* radius */}
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={purple} strokeWidth={2} />
      <Label x={cx + 48} y={cy + 16} text="r" color={purple} size={14} />
      {/* diameter dashed */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={amber} strokeWidth={1.5} strokeDasharray="6,3" />
      <Dot x={cx - r} y={cy} color={amber} r={3} />
      <Dot x={cx + r} y={cy} color={amber} r={3} />
      <Label x={cx - r - 5} y={cy - 8} text="A" color={amber} />
      <Label x={cx + r + 5} y={cy - 8} text="B" color={amber} />
      <Label x={cx} y={cy + 30} text="直径 diameter" color={amber} size={11} />
      {/* chord */}
      <line x1={chordAx} y1={chordAy} x2={chordBx} y2={chordBy} stroke={pink} strokeWidth={2} />
      <Dot x={chordAx} y={chordAy} color={pink} r={3} />
      <Dot x={chordBx} y={chordBy} color={pink} r={3} />
      <Label x={chordAx - 12} y={chordAy - 4} text="C" color={pink} />
      <Label x={chordBx + 10} y={chordBy - 4} text="D" color={pink} />
      <Label x={(chordAx + chordBx) / 2} y={chordAy - 16} text="弦 chord" color={pink} size={11} />
      {/* minor arc highlight */}
      <path d={`M ${cx + r * Math.cos(-Math.PI / 3)},${cy + r * Math.sin(-Math.PI / 3)} A ${r} ${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke={gray} strokeWidth={3} opacity={0.5} />
      <Label x={cx + r + 16} y={cy - 45} text="弧 arc" color={gray} size={11} />
      {/* central angle indicator */}
      <line x1={cx} y1={cy} x2={cx + r * Math.cos(-Math.PI / 3)} y2={cy + r * Math.sin(-Math.PI / 3)} stroke={gray} strokeWidth={1.5} strokeDasharray="4,3" />
      <path d="M 225,130 A 25 25 0 0 0 212,105" fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={238} y={110} text="圆心角" color={gray} size={11} />
      <Label x={200} y={268} text="半径 radius = r，直径 = 2r" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: point and circle positional relationship */
function PointCircleRelation() {
  const cx = 200, cy = 110, r = 70;
  return (
    <Wrapper width={400} height={230}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={3} />
      <Label x={cx + 8} y={cy + 14} text="O" color={gray} />
      {/* Inside point */}
      <Dot x={cx - 25} y={cy + 10} color={pink} r={5} />
      <Label x={cx - 25} y={cy + 30} text="P₁" color={pink} />
      <Label x={cx - 25} y={cy + 44} text="d < r（内）" color={pink} size={11} />
      {/* On the circle */}
      <Dot x={cx + r} y={cy} color={amber} r={5} />
      <Label x={cx + r + 12} y={cy + 4} text="P₂" color={amber} />
      <Label x={cx + r + 12} y={cy + 18} text="d = r（上）" color={amber} size={11} />
      {/* Outside point */}
      <Dot x={cx - 30} y={cy - r - 30} color={gray} r={5} />
      <Label x={cx - 30} y={cy - r - 40} text="P₃" color={gray} />
      <Label x={cx - 55} y={cy - r - 52} text="d > r（外）" color={gray} size={11} />
      {/* dashed lines from O */}
      <line x1={cx} y1={cy} x2={cx - 25} y2={cy + 10} stroke={pink} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={amber} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={cx} y1={cy} x2={cx - 30} y2={cy - r - 30} stroke={gray} strokeWidth={1} strokeDasharray="3,3" />
      <Label x={200} y={218} text="d = 点到圆心的距离" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: line and circle positional relationship */
function LineCircleRelation() {
  const cx = 200, cy = 120, r = 60;
  const secantY = cy - 20;
  const halfChord = Math.sqrt(r * r - 20 * 20);
  return (
    <Wrapper width={440} height={260}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} r={3} />
      <Label x={cx + 8} y={cy + 14} text="O" color={gray} />
      {/* Secant — 2 intersections */}
      <line x1={100} y1={secantY} x2={340} y2={secantY} stroke={pink} strokeWidth={2} />
      <Dot x={cx - halfChord} y={secantY} color={pink} r={3} />
      <Dot x={cx + halfChord} y={secantY} color={pink} r={3} />
      <Label x={350} y={secantY - 2} text="割线 secant" color={pink} size={11} anchor="start" />
      {/* Tangent — 1 intersection */}
      <line x1={100} y1={cy + r} x2={340} y2={cy + r} stroke={amber} strokeWidth={2} />
      <Dot x={cx} y={cy + r} color={amber} r={4} />
      <Label x={cx + 8} y={cy + r + 16} text="T" color={amber} />
      <line x1={cx} y1={cy} x2={cx} y2={cy + r} stroke={amber} strokeWidth={1.5} strokeDasharray="4,3" />
      <rect x={cx} y={cy + r - 10} width={10} height={10} fill="none" stroke={amber} strokeWidth={1} />
      <Label x={350} y={cy + r + 4} text="切线 tangent" color={amber} size={11} anchor="start" />
      {/* Non-intersecting line */}
      <line x1={100} y1={cy + r + 45} x2={340} y2={cy + r + 45} stroke={gray} strokeWidth={2} />
      <Label x={350} y={cy + r + 49} text="不相交" color={gray} size={11} anchor="start" />
      <Label x={220} y={252} text="d < r 相交 | d = r 相切 | d > r 相离" color={purple} size={11} />
    </Wrapper>
  );
}

/** Diagram: two circles positional relationships (5 cases) */
function CircleCircleRelation() {
  const y = 65, r1 = 24, r2 = 16, gap = 90;
  const cases = [
    { label: "外离", d: r1 + r2 + 10 },
    { label: "外切", d: r1 + r2 },
    { label: "相交", d: r1 + 4 },
    { label: "内切", d: r1 - r2 },
    { label: "内含", d: 3 },
  ];
  return (
    <Wrapper width={500} height={150}>
      {cases.map((c, i) => {
        const baseX = 50 + i * gap;
        return (
          <g key={i}>
            <circle cx={baseX} cy={y} r={r1} fill="none" stroke={purple} strokeWidth={1.5} />
            <circle cx={baseX + c.d} cy={y} r={r2} fill="none" stroke={pink} strokeWidth={1.5} />
            <Dot x={baseX} y={y} color={purple} r={2} />
            <Dot x={baseX + c.d} y={y} color={pink} r={2} />
            <Label x={baseX + c.d / 2} y={y + r1 + 20} text={c.label} color={gray} size={11} />
          </g>
        );
      })}
      <Label x={250} y={140} text="d = 圆心距，R 大半径，r 小半径" color={purple} size={11} />
    </Wrapper>
  );
}

/** Diagram: central angle, arc, and chord relationship */
function CentralAngleArcChord() {
  const cx = 200, cy = 130, r = 90;
  const a1 = -Math.PI / 3, a2 = -Math.PI * 2 / 3;
  const ax = cx + r * Math.cos(a1), ay = cy + r * Math.sin(a1);
  const bx = cx + r * Math.cos(a2), by = cy + r * Math.sin(a2);
  return (
    <Wrapper width={440} height={280}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={lightGray} strokeWidth={1.5} />
      <Dot x={cx} y={cy} />
      <Label x={cx + 8} y={cy + 14} text="O" color={pink} />
      {/* Radii OA, OB */}
      <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={purple} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke={purple} strokeWidth={2} />
      <Dot x={ax} y={ay} color={pink} r={4} />
      <Dot x={bx} y={by} color={pink} r={4} />
      <Label x={ax + 10} y={ay - 4} text="A" color={pink} />
      <Label x={bx - 14} y={by - 4} text="B" color={pink} />
      {/* Chord AB */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={amber} strokeWidth={2} />
      <Label x={(ax + bx) / 2} y={(ay + by) / 2 - 12} text="弦 AB" color={amber} size={12} />
      {/* Arc AB */}
      <path d={`M ${ax},${ay} A ${r} ${r} 0 0 0 ${bx},${by}`} fill="none" stroke={pink} strokeWidth={3} />
      <Label x={cx} y={cy - r - 10} text="⌢AB" color={pink} size={13} />
      {/* Central angle arc */}
      <path d={`M ${cx + 25 * Math.cos(a1)},${cy + 25 * Math.sin(a1)} A 25 25 0 0 0 ${cx + 25 * Math.cos(a2)},${cy + 25 * Math.sin(a2)}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={cx} y={cy - 32} text="∠AOB" color={gray} size={12} />
      <Label x={220} y={268} text="等圆中：等圆心角 ↔ 等弧 ↔ 等弦" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: inscribed angle theorem */
function InscribedAngleTheorem() {
  const cx = 200, cy = 130, r = 90;
  const aAng = -Math.PI / 4, bAng = -Math.PI * 3 / 4;
  const cAng = Math.PI / 2 + 0.3;
  const ax = cx + r * Math.cos(aAng), ay = cy + r * Math.sin(aAng);
  const bx = cx + r * Math.cos(bAng), by = cy + r * Math.sin(bAng);
  const px = cx + r * Math.cos(cAng), py = cy + r * Math.sin(cAng);
  return (
    <Wrapper width={440} height={280}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={lightGray} strokeWidth={1.5} />
      <Dot x={cx} y={cy} r={3} />
      <Label x={cx + 8} y={cy - 6} text="O" color={gray} />
      {/* Central angle AOB */}
      <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={purple} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={bx} y2={by} stroke={purple} strokeWidth={2} />
      <path d={`M ${cx + 20 * Math.cos(aAng)},${cy + 20 * Math.sin(aAng)} A 20 20 0 0 0 ${cx + 20 * Math.cos(bAng)},${cy + 20 * Math.sin(bAng)}`} fill="none" stroke={purple} strokeWidth={1.5} />
      <Label x={cx} y={cy - 22} text="2α" color={purple} size={13} />
      {/* Inscribed angle ACB */}
      <line x1={px} y1={py} x2={ax} y2={ay} stroke={pink} strokeWidth={2} />
      <line x1={px} y1={py} x2={bx} y2={by} stroke={pink} strokeWidth={2} />
      <Label x={px} y={py + 18} text="α" color={pink} size={14} />
      {/* Points */}
      <Dot x={ax} y={ay} color={amber} r={4} />
      <Dot x={bx} y={by} color={amber} r={4} />
      <Dot x={px} y={py} color={pink} r={4} />
      <Label x={ax + 10} y={ay - 6} text="A" color={amber} />
      <Label x={bx - 14} y={by - 6} text="B" color={amber} />
      <Label x={px + 12} y={py + 6} text="C" color={pink} />
      <Label x={220} y={268} text="圆周角 = ½ 圆心角（同弧）" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: tangent line properties — OT ⊥ tangent */
function TangentProperties() {
  const cx = 200, cy = 110, r = 70;
  const ty = cy + r;
  return (
    <Wrapper width={420} height={240}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} />
      <Label x={cx + 10} y={cy - 6} text="O" color={pink} />
      {/* Radius OT */}
      <line x1={cx} y1={cy} x2={cx} y2={ty} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={ty} color={amber} r={5} />
      <Label x={cx + 10} y={ty + 4} text="T" color={amber} />
      {/* Tangent line through T */}
      <line x1={cx - 130} y1={ty} x2={cx + 130} y2={ty} stroke={amber} strokeWidth={2} />
      {/* Right angle mark */}
      <rect x={cx} y={ty - 12} width={12} height={12} fill="none" stroke={gray} strokeWidth={1.2} />
      <Label x={cx + 14} y={(cy + ty) / 2} text="r" color={purple} size={14} />
      <Label x={cx + 90} y={ty - 10} text="切线 l" color={amber} size={12} />
      <Label x={210} y={228} text="OT ⊥ l — 切线过切点垂直于半径" color={purple} size={12} />
    </Wrapper>
  );
}

/** Diagram: arc length and sector area formulas */
function ArcLengthSectorArea() {
  const cx = 180, cy = 150, r = 100;
  const angle = Math.PI / 3;
  const ax = cx + r, ay = cy;
  const bx = cx + r * Math.cos(-angle), by = cy + r * Math.sin(-angle);
  return (
    <Wrapper width={440} height={280}>
      {/* Sector */}
      <path d={`M ${cx},${cy} L ${ax},${ay} A ${r} ${r} 0 0 0 ${bx},${by} Z`} fill={purple} fillOpacity={0.1} stroke={purple} strokeWidth={2} />
      <Dot x={cx} y={cy} />
      <Label x={cx - 14} y={cy + 4} text="O" color={pink} />
      {/* Radius labels */}
      <Label x={(cx + ax) / 2} y={ay + 18} text="r" color={purple} size={14} />
      <Label x={(cx + bx) / 2 + 6} y={(cy + by) / 2 - 6} text="r" color={purple} size={14} />
      {/* Angle arc */}
      <path d={`M ${cx + 30},${cy} A 30 30 0 0 0 ${cx + 30 * Math.cos(-angle)},${cy + 30 * Math.sin(-angle)}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <Label x={cx + 42} y={cy - 14} text="n°" color={amber} size={13} />
      {/* Arc highlight */}
      <path d={`M ${ax},${ay} A ${r} ${r} 0 0 0 ${bx},${by}`} fill="none" stroke={pink} strokeWidth={3} />
      <Label x={cx + r + 12} y={(ay + by) / 2 - 10} text="⌢" color={pink} size={14} />
      {/* Formulas */}
      <Label x={220} y={240} text="弧长 l = nπr / 180" color={gray} size={13} />
      <Label x={220} y={260} text="扇形面积 S = nπr² / 360 = ½lr" color={gray} size={13} />
    </Wrapper>
  );
}

// ─── Inverse Proportion Function Diagrams ───

/** Diagram: Inverse proportion concept — table showing xy = 12 */
function InverseProportionConcept() {
  const xs = [1, 2, 3, 4, 6, 12];
  const ys = [12, 6, 4, 3, 2, 1];
  const colW = 52, startX = 70, headerY = 30, rowH = 32;
  return (
    <Wrapper width={420} height={170}>
      <defs>
        <marker id="arrowIPC" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={pink} />
        </marker>
      </defs>
      <Label x={startX - 30} y={headerY + 6} text="x" color={purple} size={14} />
      <Label x={startX - 30} y={headerY + rowH + 6} text="y" color={amber} size={14} />
      {xs.map((x, i) => {
        const cx = startX + i * colW + colW / 2;
        return (
          <g key={i}>
            <rect x={startX + i * colW} y={headerY - 14} width={colW} height={rowH} fill="rgba(139,92,246,0.08)" stroke={lightGray} strokeWidth={1} rx={3} />
            <Label x={cx} y={headerY + 6} text={String(x)} color={purple} size={13} />
            <rect x={startX + i * colW} y={headerY + rowH - 14} width={colW} height={rowH} fill="rgba(245,158,11,0.08)" stroke={lightGray} strokeWidth={1} rx={3} />
            <Label x={cx} y={headerY + rowH + 6} text={String(ys[i])} color={amber} size={13} />
            <line x1={cx} y1={headerY + rowH - 16} x2={cx} y2={headerY + rowH - 12} stroke={pink} strokeWidth={1.5} markerEnd="url(#arrowIPC)" />
          </g>
        );
      })}
      <Label x={210} y={headerY + 2 * rowH + 16} text="x × y = 12（积为常数 / product is constant）" color={pink} size={12} />
      <Label x={210} y={155} text="x 增大 → y 减小 / As x increases, y decreases" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Hyperbola graph — y=6/x (k>0) and y=-6/x (k<0) */
function HyperbolaGraph() {
  const ox = 220, oy = 160, scale = 18;
  const toSvg = (x: number, y: number): [number, number] => [ox + x * scale, oy - y * scale];
  const xVals = [0.5, 0.8, 1, 1.5, 2, 3, 4, 5, 6, 8];
  const posQ1 = xVals.map(x => toSvg(x, 6 / x));
  const posQ3 = xVals.map(x => toSvg(-x, -6 / x));
  const negQ2 = xVals.map(x => toSvg(-x, 6 / x));
  const negQ4 = xVals.map(x => toSvg(x, -6 / x));
  const pts = (arr: [number, number][]) => arr.map(p => p.join(",")).join(" ");
  return (
    <Wrapper width={440} height={320}>
      {/* Axes */}
      <line x1={20} y1={oy} x2={420} y2={oy} stroke={gray} strokeWidth={1.5} />
      <line x1={ox} y1={10} x2={ox} y2={310} stroke={gray} strokeWidth={1.5} />
      <polygon points={`420,${oy} 414,${oy - 4} 414,${oy + 4}`} fill={gray} />
      <polygon points={`${ox},10 ${ox - 4},16 ${ox + 4},16`} fill={gray} />
      <Label x={430} y={oy + 4} text="x" color={gray} size={12} anchor="start" />
      <Label x={ox + 8} y={20} text="y" color={gray} size={12} anchor="start" />
      <Label x={ox - 10} y={oy + 14} text="O" color={gray} size={11} />
      {/* Asymptote dashes */}
      <line x1={20} y1={oy} x2={420} y2={oy} stroke={lightGray} strokeWidth={0.5} strokeDasharray="4,3" />
      <line x1={ox} y1={10} x2={ox} y2={310} stroke={lightGray} strokeWidth={0.5} strokeDasharray="4,3" />
      {/* y=6/x (k>0): Q1 and Q3 in purple */}
      <polyline points={pts(posQ1)} fill="none" stroke={purple} strokeWidth={2.5} />
      <polyline points={pts(posQ3)} fill="none" stroke={purple} strokeWidth={2.5} />
      <Label x={posQ1[0][0] + 10} y={posQ1[0][1] - 8} text="y = 6/x" color={purple} size={12} anchor="start" />
      {/* y=-6/x (k<0): Q2 and Q4 in amber */}
      <polyline points={pts(negQ2)} fill="none" stroke={amber} strokeWidth={2.5} />
      <polyline points={pts(negQ4)} fill="none" stroke={amber} strokeWidth={2.5} />
      <Label x={negQ2[0][0] - 10} y={negQ2[0][1] - 8} text="y = −6/x" color={amber} size={12} anchor="end" />
      {/* Quadrant labels */}
      <Label x={350} y={50} text="I" color={lightGray} size={16} />
      <Label x={80} y={50} text="II" color={lightGray} size={16} />
      <Label x={80} y={270} text="III" color={lightGray} size={16} />
      <Label x={350} y={270} text="IV" color={lightGray} size={16} />
      <Label x={220} y={310} text="渐近线: x轴 & y轴 / Asymptotes: x-axis & y-axis" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Hyperbola properties — rectangle area = |k| */
function HyperbolaProperties() {
  const ox = 60, oy = 220, scale = 28;
  const toSvg = (x: number, y: number): [number, number] => [ox + x * scale, oy - y * scale];
  const k = 6;
  const xVals = [0.8, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const curve = xVals.map(x => toSvg(x, k / x));
  const pts = curve.map(p => p.join(",")).join(" ");
  const px = 2;
  const [spx, spy] = toSvg(px, k / px);
  const [sxP] = toSvg(px, 0);
  return (
    <Wrapper width={380} height={260}>
      {/* Axes */}
      <line x1={ox} y1={oy} x2={360} y2={oy} stroke={gray} strokeWidth={1.5} />
      <line x1={ox} y1={oy} x2={ox} y2={10} stroke={gray} strokeWidth={1.5} />
      <polygon points={`360,${oy} 354,${oy - 4} 354,${oy + 4}`} fill={gray} />
      <polygon points={`${ox},10 ${ox - 4},16 ${ox + 4},16`} fill={gray} />
      <Label x={370} y={oy + 4} text="x" color={gray} size={12} anchor="start" />
      <Label x={ox + 8} y={18} text="y" color={gray} size={12} anchor="start" />
      <Label x={ox - 6} y={oy + 14} text="O" color={gray} size={11} />
      {/* Curve */}
      <polyline points={pts} fill="none" stroke={purple} strokeWidth={2.5} />
      {/* Rectangle from O to P */}
      <rect x={ox} y={spy} width={sxP - ox} height={oy - spy} fill="rgba(236,72,153,0.12)" stroke={pink} strokeWidth={1.5} strokeDasharray="4,3" />
      {/* Point P */}
      <Dot x={spx} y={spy} color={pink} r={5} />
      <Label x={spx + 8} y={spy - 8} text="P(2, 3)" color={pink} size={12} anchor="start" />
      {/* Perpendicular drop lines */}
      <line x1={spx} y1={spy} x2={spx} y2={oy} stroke={pink} strokeWidth={1} strokeDasharray="3,2" />
      <line x1={spx} y1={spy} x2={ox} y2={spy} stroke={pink} strokeWidth={1} strokeDasharray="3,2" />
      {/* Area label */}
      <Label x={(ox + sxP) / 2} y={(spy + oy) / 2 + 4} text="S = |k| = 6" color={amber} size={13} />
      {/* Arrow: x increases, y decreases */}
      <Label x={260} y={50} text="x 增大 → y 减小" color={purple} size={11} />
      <Label x={260} y={65} text="x increases → y decreases" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: |k| geometric meaning — larger |k| = farther from origin */
function KGeometricMeaning() {
  const ox = 60, oy = 210, scale = 16;
  const toSvg = (x: number, y: number): [number, number] => [ox + x * scale, oy - y * scale];
  const xVals = [0.5, 0.8, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 14];
  const curve4 = xVals.filter(x => 4 / x <= 13).map(x => toSvg(x, 4 / x));
  const curve12 = xVals.filter(x => 12 / x <= 13).map(x => toSvg(x, 12 / x));
  const pts4 = curve4.map(p => p.join(",")).join(" ");
  const pts12 = curve12.map(p => p.join(",")).join(" ");
  const [r1x, r1y] = toSvg(2, 2);
  const [r2x, r2y] = toSvg(3, 4);
  return (
    <Wrapper width={380} height={260}>
      {/* Axes */}
      <line x1={ox} y1={oy} x2={360} y2={oy} stroke={gray} strokeWidth={1.5} />
      <line x1={ox} y1={oy} x2={ox} y2={10} stroke={gray} strokeWidth={1.5} />
      <polygon points={`360,${oy} 354,${oy - 4} 354,${oy + 4}`} fill={gray} />
      <polygon points={`${ox},10 ${ox - 4},16 ${ox + 4},16`} fill={gray} />
      <Label x={370} y={oy + 4} text="x" color={gray} size={12} anchor="start" />
      <Label x={ox + 8} y={18} text="y" color={gray} size={12} anchor="start" />
      <Label x={ox - 6} y={oy + 14} text="O" color={gray} size={11} />
      {/* k=4 curve (closer to axes, amber) */}
      <polyline points={pts4} fill="none" stroke={amber} strokeWidth={2} />
      <Label x={curve4[curve4.length - 1][0] + 4} y={curve4[curve4.length - 1][1] - 6} text="k = 4" color={amber} size={12} anchor="start" />
      {/* k=12 curve (farther from axes, purple) */}
      <polyline points={pts12} fill="none" stroke={purple} strokeWidth={2.5} />
      <Label x={curve12[curve12.length - 1][0] + 4} y={curve12[curve12.length - 1][1] - 6} text="k = 12" color={purple} size={12} anchor="start" />
      {/* Rectangle for k=4 */}
      <rect x={ox} y={r1y} width={r1x - ox} height={oy - r1y} fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={1} strokeDasharray="3,2" />
      <Dot x={r1x} y={r1y} color={amber} r={4} />
      <Label x={r1x + 4} y={r1y - 6} text="S = 4" color={amber} size={10} anchor="start" />
      {/* Rectangle for k=12 */}
      <rect x={ox} y={r2y} width={r2x - ox} height={oy - r2y} fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={1} strokeDasharray="3,2" />
      <Dot x={r2x} y={r2y} color={purple} r={4} />
      <Label x={r2x + 4} y={r2y - 6} text="S = 12" color={purple} size={10} anchor="start" />
      <Label x={210} y={248} text="|k| 越大，曲线离原点越远 / Larger |k| → farther from origin" color={gray} size={10} />
    </Wrapper>
  );
}

// ─── Algebra Area Model Diagrams ───

/** Diagram: Polynomial area model — (a+b)(c+d) = ac + ad + bc + bd */
function PolynomialAreaModel() {
  const sx = 40, sy = 30;
  const wa = 140, wb = 100;
  const hc = 100, hd = 70;
  const totalW = wa + wb, totalH = hc + hd;
  return (
    <Wrapper width={400} height={260}>
      <rect x={sx} y={sy} width={totalW} height={totalH} fill="none" stroke={gray} strokeWidth={2} />
      {/* ac (top-left, purple) */}
      <rect x={sx} y={sy} width={wa} height={hc} fill="rgba(139,92,246,0.12)" stroke={purple} strokeWidth={1.5} />
      <Label x={sx + wa / 2} y={sy + hc / 2 + 4} text="ac" color={purple} size={16} />
      {/* ad (bottom-left, pink) */}
      <rect x={sx} y={sy + hc} width={wa} height={hd} fill="rgba(236,72,153,0.10)" stroke={pink} strokeWidth={1.5} />
      <Label x={sx + wa / 2} y={sy + hc + hd / 2 + 4} text="ad" color={pink} size={16} />
      {/* bc (top-right, amber) */}
      <rect x={sx + wa} y={sy} width={wb} height={hc} fill="rgba(245,158,11,0.12)" stroke={amber} strokeWidth={1.5} />
      <Label x={sx + wa + wb / 2} y={sy + hc / 2 + 4} text="bc" color={amber} size={16} />
      {/* bd (bottom-right, gray) */}
      <rect x={sx + wa} y={sy + hc} width={wb} height={hd} fill="rgba(107,114,128,0.10)" stroke={gray} strokeWidth={1.5} />
      <Label x={sx + wa + wb / 2} y={sy + hc + hd / 2 + 4} text="bd" color={gray} size={16} />
      {/* Dimension labels: top */}
      <Label x={sx + wa / 2} y={sy - 10} text="a" color={purple} size={14} />
      <Label x={sx + wa + wb / 2} y={sy - 10} text="b" color={amber} size={14} />
      {/* Dimension labels: left */}
      <Label x={sx - 16} y={sy + hc / 2 + 4} text="c" color={purple} size={14} />
      <Label x={sx - 16} y={sy + hc + hd / 2 + 4} text="d" color={pink} size={14} />
      {/* Formula */}
      <Label x={sx + totalW / 2} y={sy + totalH + 28} text="(a + b)(c + d) = ac + ad + bc + bd" color={purple} size={13} />
      <Label x={sx + totalW / 2} y={sy + totalH + 46} text="多项式乘法 = 面积拼合 / Polynomial multiplication = area model" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Factorization area model — perfect square trinomial + difference of squares */
function FactorizationAreaModel() {
  const sx = 20, sy = 20, sa = 100, sb = 60;
  const total = sa + sb;
  const sx2 = 240, sideA = 130, sideB = 50;
  return (
    <Wrapper width={480} height={270}>
      {/* === Part 1: Perfect square trinomial === */}
      <Label x={sx + total / 2} y={sy - 6} text="(a + b)² = a² + 2ab + b²" color={purple} size={12} />
      <rect x={sx} y={sy + 8} width={sa} height={sa} fill="rgba(139,92,246,0.15)" stroke={purple} strokeWidth={1.5} />
      <Label x={sx + sa / 2} y={sy + 8 + sa / 2 + 4} text="a²" color={purple} size={15} />
      <rect x={sx + sa} y={sy + 8} width={sb} height={sa} fill="rgba(236,72,153,0.10)" stroke={pink} strokeWidth={1.5} />
      <Label x={sx + sa + sb / 2} y={sy + 8 + sa / 2 + 4} text="ab" color={pink} size={13} />
      <rect x={sx} y={sy + 8 + sa} width={sa} height={sb} fill="rgba(236,72,153,0.10)" stroke={pink} strokeWidth={1.5} />
      <Label x={sx + sa / 2} y={sy + 8 + sa + sb / 2 + 4} text="ab" color={pink} size={13} />
      <rect x={sx + sa} y={sy + 8 + sa} width={sb} height={sb} fill="rgba(245,158,11,0.15)" stroke={amber} strokeWidth={1.5} />
      <Label x={sx + sa + sb / 2} y={sy + 8 + sa + sb / 2 + 4} text="b²" color={amber} size={13} />
      {/* Dimension labels */}
      <Label x={sx - 10} y={sy + 8 + sa / 2 + 4} text="a" color={purple} size={12} />
      <Label x={sx - 10} y={sy + 8 + sa + sb / 2 + 4} text="b" color={amber} size={12} />
      <Label x={sx + sa / 2} y={sy + 8 + total + 16} text="a" color={purple} size={12} />
      <Label x={sx + sa + sb / 2} y={sy + 8 + total + 16} text="b" color={amber} size={12} />
      {/* === Part 2: Difference of squares === */}
      <Label x={sx2 + sideA / 2} y={sy - 6} text="a² − b² = (a+b)(a−b)" color={amber} size={12} />
      <rect x={sx2} y={sy + 8} width={sideA} height={sideA} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={1.5} />
      <rect x={sx2 + sideA - sideB} y={sy + 8} width={sideB} height={sideB} fill="rgba(245,158,11,0.20)" stroke={amber} strokeWidth={1.5} />
      <Label x={sx2 + sideA - sideB / 2} y={sy + 8 + sideB / 2 + 4} text="b²" color={amber} size={13} />
      <Label x={sx2 + 35} y={sy + 8 + sideA / 2 + 10} text="a²−b²" color={purple} size={14} />
      <Label x={sx2 - 10} y={sy + 8 + sideA / 2} text="a" color={purple} size={12} />
      <Label x={sx2 + sideA / 2} y={sy + 8 + sideA + 16} text="a" color={purple} size={12} />
      <Label x={sx2 + sideA + 6} y={sy + 8 + sideB / 2} text="b" color={amber} size={12} anchor="start" />
      <Label x={240} y={250} text="因式分解 = 面积逆向拆分 / Factorization = reverse area decomposition" color={gray} size={10} />
    </Wrapper>
  );
}

// ===================== Grade 9: Trigonometric Functions =====================

/** Diagram: Right triangle with trig ratios sin, cos, tan */
function TrigDefinition() {
  const ax = 60, ay = 180, bx = 340, by = 180, cx = 340, cy = 40;
  return (
    <Wrapper width={500} height={220}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <polyline points={`${bx - 18},${by} ${bx - 18},${by - 18} ${bx},${by - 18}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <path d={`M ${ax + 40},${ay} A 40 40 0 0 0 ${ax + 36},${ay - 18}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ax + 52} y={ay - 6} text="α" color={pink} size={15} />
      <Label x={(ax + bx) / 2} y={ay + 18} text="邻边 adjacent" color={gray} size={11} />
      <Label x={bx + 14} y={(by + cy) / 2 + 4} text="对边" color={purple} size={11} anchor="start" />
      <Label x={bx + 14} y={(by + cy) / 2 + 18} text="opposite" color={purple} size={10} anchor="start" />
      <Label x={(ax + cx) / 2 - 30} y={(ay + cy) / 2 - 8} text="斜边 hypotenuse" color={pink} size={11} />
      <Label x={ax - 12} y={ay + 4} text="A" color={pink} />
      <Label x={bx + 8} y={by + 14} text="B" color={pink} />
      <Label x={cx + 8} y={cy - 6} text="C" color={pink} />
      <Label x={440} y={40} text="sin α = 对/斜" color={purple} size={12} anchor="start" />
      <Label x={440} y={60} text="cos α = 邻/斜" color={purple} size={12} anchor="start" />
      <Label x={440} y={80} text="tan α = 对/邻" color={purple} size={12} anchor="start" />
    </Wrapper>
  );
}

/** Diagram: 30-60-90 and 45-45-90 special angle triangles */
function SpecialAngles() {
  return (
    <Wrapper width={500} height={210}>
      <polygon points="100,180 180,180 180,41.4" fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <polyline points="162,180 162,162 180,162" fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={120} y={176} text="30°" color={pink} size={12} />
      <Label x={170} y={65} text="60°" color={pink} size={12} anchor="end" />
      <Label x={140} y={192} text="√3" color={purple} size={13} />
      <Label x={192} y={115} text="1" color={purple} size={13} anchor="start" />
      <Label x={125} y={105} text="2" color={amber} size={13} />
      <Label x={140} y={28} text="30°-60°-90°" color={gray} size={12} />

      <polygon points="300,180 420,180 420,60" fill="rgba(245,158,11,0.05)" stroke={amber} strokeWidth={2} />
      <polyline points="402,180 402,162 420,162" fill="none" stroke={gray} strokeWidth={1.5} />
      <Label x={325} y={176} text="45°" color={pink} size={12} />
      <Label x={410} y={80} text="45°" color={pink} size={12} anchor="end" />
      <Label x={360} y={192} text="1" color={amber} size={13} />
      <Label x={432} y={120} text="1" color={amber} size={13} anchor="start" />
      <Label x={345} y={110} text="√2" color={purple} size={13} />
      <Label x={360} y={28} text="45°-45°-90°" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: Solving a right triangle — given angle and one side, find others */
function SolvingRightTriangles() {
  const ax = 80, ay = 170, bx = 280, by = 170, cx = 280, cy = 30;
  return (
    <Wrapper width={480} height={210}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <polyline points={`${bx - 16},${by} ${bx - 16},${by - 16} ${bx},${by - 16}`} fill="none" stroke={gray} strokeWidth={1.5} />
      <path d={`M ${ax + 35},${ay} A 35 35 0 0 0 ${ax + 28.6},${ay - 20}`} fill="none" stroke={pink} strokeWidth={2} />
      <Label x={ax + 48} y={ay - 6} text="35°" color={pink} size={13} />
      <Label x={(ax + bx) / 2} y={ay + 18} text="已知 given = 10" color={amber} size={12} />
      <line x1={ax + 20} y1={ay + 6} x2={bx - 20} y2={by + 6} stroke={amber} strokeWidth={2.5} strokeDasharray="6,3" />
      <Label x={bx + 10} y={(by + cy) / 2 + 4} text="? = 10·tan35°" color={purple} size={11} anchor="start" />
      <Label x={(ax + cx) / 2 - 28} y={(ay + cy) / 2 - 6} text="? = 10/cos35°" color={purple} size={11} />
      <Label x={ax - 10} y={ay + 4} text="A" color={pink} />
      <Label x={bx + 6} y={by + 14} text="B" color={pink} />
      <Label x={cx + 6} y={cy - 6} text="C" color={pink} />
      <Label x={240} y={205} text="已知一角一边 → 求其余边" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Elevation and depression angles from a horizontal line of sight */
function ElevationDepression() {
  const px = 80, py = 110;
  return (
    <Wrapper width={460} height={210}>
      <circle cx={px} cy={py - 18} r={8} fill="none" stroke={purple} strokeWidth={2} />
      <line x1={px} y1={py - 10} x2={px} y2={py + 40} stroke={purple} strokeWidth={2} />
      <line x1={px} y1={py + 10} x2={px - 14} y2={py + 30} stroke={purple} strokeWidth={2} />
      <line x1={px} y1={py + 10} x2={px + 14} y2={py + 30} stroke={purple} strokeWidth={2} />
      <line x1={px} y1={py + 40} x2={px - 12} y2={py + 60} stroke={purple} strokeWidth={2} />
      <line x1={px} y1={py + 40} x2={px + 12} y2={py + 60} stroke={purple} strokeWidth={2} />
      <line x1={px + 10} y1={py} x2={400} y2={py} stroke={lightGray} strokeWidth={1.5} strokeDasharray="6,3" />
      <Label x={350} y={py - 8} text="水平线 horizontal" color={gray} size={10} />
      <line x1={px + 10} y1={py} x2={380} y2={30} stroke={amber} strokeWidth={2} />
      <Dot x={380} y={30} color={amber} r={5} />
      <Label x={390} y={28} text="目标" color={amber} size={11} anchor="start" />
      <path d="M 140,110 A 60 60 0 0 0 130,76" fill="none" stroke={amber} strokeWidth={2} />
      <Label x={160} y={90} text="仰角" color={amber} size={12} anchor="start" />
      <Label x={160} y={104} text="elevation" color={amber} size={10} anchor="start" />
      <line x1={px + 10} y1={py} x2={380} y2={190} stroke={pink} strokeWidth={2} />
      <Dot x={380} y={190} color={pink} r={5} />
      <Label x={390} y={192} text="目标" color={pink} size={11} anchor="start" />
      <path d="M 140,110 A 60 60 0 0 1 132,142" fill="none" stroke={pink} strokeWidth={2} />
      <Label x={160} y={134} text="俯角" color={pink} size={12} anchor="start" />
      <Label x={160} y={148} text="depression" color={pink} size={10} anchor="start" />
    </Wrapper>
  );
}

// ===================== Grade 9: Similar Figures =====================

/** Diagram: Proportional segments a:b = c:d */
function ProportionalSegments() {
  return (
    <Wrapper width={460} height={160}>
      <line x1={40} y1={40} x2={160} y2={40} stroke={purple} strokeWidth={3} />
      <line x1={180} y1={40} x2={340} y2={40} stroke={amber} strokeWidth={3} />
      <Dot x={40} y={40} color={pink} /><Dot x={160} y={40} color={pink} /><Dot x={180} y={40} color={pink} /><Dot x={340} y={40} color={pink} />
      <Label x={100} y={30} text="a" color={purple} size={14} />
      <Label x={260} y={30} text="b" color={amber} size={14} />
      <line x1={40} y1={90} x2={130} y2={90} stroke={purple} strokeWidth={3} />
      <line x1={150} y1={90} x2={280} y2={90} stroke={amber} strokeWidth={3} />
      <Dot x={40} y={90} color={pink} /><Dot x={130} y={90} color={pink} /><Dot x={150} y={90} color={pink} /><Dot x={280} y={90} color={pink} />
      <Label x={85} y={80} text="c" color={purple} size={14} />
      <Label x={215} y={80} text="d" color={amber} size={14} />
      <Label x={380} y={45} text="a : b = c : d" color={gray} size={13} />
      <Label x={380} y={70} text="⟹  a·d = b·c" color={pink} size={13} />
      <Label x={230} y={140} text="成比例线段（交叉相乘）" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Parallel line cutting triangle sides proportionally */
function ParallelProportionality() {
  const ax = 200, ay = 20, bx = 50, by = 185, cx = 380, cy = 185;
  const t = 0.45;
  const dx = ax + (bx - ax) * t, dy = ay + (by - ay) * t;
  const ex = ax + (cx - ax) * t, ey = ay + (cy - ay) * t;
  return (
    <Wrapper width={440} height={220}>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <line x1={dx} y1={dy} x2={ex} y2={ey} stroke={amber} strokeWidth={2.5} />
      <Label x={(dx + ex) / 2} y={dy - 8} text="∥" color={amber} size={14} />
      <Label x={ax} y={ay - 8} text="A" color={pink} />
      <Label x={bx - 12} y={by + 14} text="B" color={pink} />
      <Label x={cx + 8} y={cy + 14} text="C" color={pink} />
      <Dot x={dx} y={dy} color={amber} r={4} /><Label x={dx - 16} y={dy - 4} text="D" color={amber} />
      <Dot x={ex} y={ey} color={amber} r={4} /><Label x={ex + 10} y={ey - 4} text="E" color={amber} />
      <Label x={220} y={212} text="DE ∥ BC ⟹ AD/DB = AE/EC" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Two similar rectangles with corresponding sides labeled */
function SimilarPolygons() {
  return (
    <Wrapper width={460} height={180}>
      <rect x={30} y={30} width={160} height={100} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} rx={2} />
      <Label x={110} y={148} text="a" color={purple} size={13} />
      <Label x={200} y={82} text="b" color={purple} size={13} anchor="start" />
      <Label x={50} y={20} text="A" color={pink} size={11} /><Label x={170} y={20} text="B" color={pink} size={11} />
      <Label x={170} y={145} text="C" color={pink} size={11} /><Label x={50} y={145} text="D" color={pink} size={11} />
      <rect x={270} y={55} width={112} height={70} fill="rgba(245,158,11,0.05)" stroke={amber} strokeWidth={2} rx={2} />
      <Label x={326} y={143} text="a'" color={amber} size={13} />
      <Label x={392} y={92} text="b'" color={amber} size={13} anchor="start" />
      <Label x={282} y={47} text="A'" color={pink} size={11} /><Label x={368} y={47} text="B'" color={pink} size={11} />
      <Label x={368} y={140} text="C'" color={pink} size={11} /><Label x={282} y={140} text="D'" color={pink} size={11} />
      <Label x={232} y={85} text="∼" color={gray} size={22} />
      <Label x={230} y={175} text="a/a' = b/b' = k（相似比）" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: AA, SAS, SSS similarity criteria side by side */
function SimilarTriangleCriteria() {
  return (
    <Wrapper width={500} height={190}>
      <polygon points="30,145 110,145 80,55" fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <path d="M 46,145 A 16 16 0 0 0 52,132" fill="none" stroke={pink} strokeWidth={2} />
      <path d="M 104,145 A 16 16 0 0 1 95,132" fill="none" stroke={pink} strokeWidth={2} />
      <Label x={70} y={165} text="AA" color={purple} size={14} />
      <Label x={70} y={180} text="两角相等" color={gray} size={10} />
      <polygon points="180,145 270,145 240,55" fill="rgba(245,158,11,0.05)" stroke={amber} strokeWidth={2} />
      <path d="M 196,145 A 16 16 0 0 0 207,133" fill="none" stroke={pink} strokeWidth={2} />
      <line x1={180} y1={145} x2={240} y2={55} stroke={pink} strokeWidth={3} />
      <line x1={180} y1={145} x2={270} y2={145} stroke={pink} strokeWidth={3} />
      <Label x={225} y={165} text="SAS" color={amber} size={14} />
      <Label x={225} y={180} text="两边之比+夹角" color={gray} size={10} />
      <polygon points="330,145 430,145 395,55" fill="rgba(236,72,153,0.05)" stroke={pink} strokeWidth={2} />
      <line x1={330} y1={145} x2={430} y2={145} stroke={pink} strokeWidth={3} />
      <line x1={330} y1={145} x2={395} y2={55} stroke={pink} strokeWidth={3} />
      <line x1={430} y1={145} x2={395} y2={55} stroke={pink} strokeWidth={3} />
      <Label x={380} y={165} text="SSS" color={pink} size={14} />
      <Label x={380} y={180} text="三边之比相等" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Two similar triangles showing side ratio k, perimeter ratio k, area ratio k² */
function SimilarTriangleProperties() {
  return (
    <Wrapper width={480} height={200}>
      <polygon points="40,160 200,160 140,40" fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      <Label x={120} y={175} text="a" color={purple} size={12} />
      <Label x={178} y={95} text="b" color={purple} size={12} />
      <Label x={78} y={95} text="c" color={purple} size={12} />
      <polygon points="280,160 380,160 342,88" fill="rgba(245,158,11,0.05)" stroke={amber} strokeWidth={2} />
      <Label x={330} y={175} text="a'" color={amber} size={12} />
      <Label x={368} y={120} text="b'" color={amber} size={12} />
      <Label x={302} y={120} text="c'" color={amber} size={12} />
      <Label x={240} y={130} text="∼" color={gray} size={20} />
      <Label x={420} y={50} text="相似比 = k" color={purple} size={12} anchor="start" />
      <Label x={420} y={72} text="周长比 = k" color={amber} size={12} anchor="start" />
      <Label x={420} y={94} text="面积比 = k²" color={pink} size={12} anchor="start" />
    </Wrapper>
  );
}

/** Diagram: Homothety — triangle and its dilation from center O */
function HomothetyDiagram() {
  const ox = 60, oy = 100;
  const a = [180, 160], b = [250, 160], c = [220, 80];
  const k = 1.6;
  const a2 = [ox + (a[0] - ox) * k, oy + (a[1] - oy) * k];
  const b2 = [ox + (b[0] - ox) * k, oy + (b[1] - oy) * k];
  const c2 = [ox + (c[0] - ox) * k, oy + (c[1] - oy) * k];
  return (
    <Wrapper width={500} height={220}>
      <line x1={ox} y1={oy} x2={a2[0]} y2={a2[1]} stroke={lightGray} strokeWidth={1} strokeDasharray="5,3" />
      <line x1={ox} y1={oy} x2={b2[0]} y2={b2[1]} stroke={lightGray} strokeWidth={1} strokeDasharray="5,3" />
      <line x1={ox} y1={oy} x2={c2[0]} y2={c2[1]} stroke={lightGray} strokeWidth={1} strokeDasharray="5,3" />
      <polygon points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="rgba(139,92,246,0.08)" stroke={purple} strokeWidth={2} />
      <polygon points={`${a2[0]},${a2[1]} ${b2[0]},${b2[1]} ${c2[0]},${c2[1]}`} fill="rgba(245,158,11,0.08)" stroke={amber} strokeWidth={2} />
      <Dot x={ox} y={oy} color={pink} r={5} />
      <Label x={ox - 12} y={oy + 4} text="O" color={pink} size={14} />
      <Label x={a[0] - 4} y={a[1] + 14} text="A" color={purple} size={11} />
      <Label x={b[0] + 6} y={b[1] + 14} text="B" color={purple} size={11} />
      <Label x={c[0]} y={c[1] - 8} text="C" color={purple} size={11} />
      <Label x={a2[0] - 4} y={a2[1] + 14} text="A'" color={amber} size={11} />
      <Label x={b2[0] + 6} y={b2[1] + 14} text="B'" color={amber} size={11} />
      <Label x={c2[0]} y={c2[1] - 8} text="C'" color={amber} size={11} />
      <Label x={250} y={215} text="位似变换（中心O，比 k）" color={gray} size={11} />
    </Wrapper>
  );
}

// ===================== Grade 9: Rotation =====================

/** Diagram: Triangle rotated 60° around center point */
function RotationDefinition() {
  const ox = 200, oy = 120;
  const pts = [[260, 60], [310, 140], [240, 150]];
  const angle = Math.PI / 3;
  const rot = (x: number, y: number) => {
    const dx = x - ox, dy = y - oy;
    return [ox + dx * Math.cos(angle) - dy * Math.sin(angle), oy + dx * Math.sin(angle) + dy * Math.cos(angle)];
  };
  const rpts = pts.map(([x, y]) => rot(x, y));
  const r = Math.hypot(pts[0][0] - ox, pts[0][1] - oy);
  return (
    <Wrapper width={460} height={240}>
      <polygon points={pts.map(p => p.join(",")).join(" ")} fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={2} />
      <polygon points={rpts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ")} fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={2} />
      <path d={`M ${pts[0][0]},${pts[0][1]} A ${r} ${r} 0 0 1 ${rpts[0][0].toFixed(1)},${rpts[0][1].toFixed(1)}`} fill="none" stroke={pink} strokeWidth={2} strokeDasharray="4,3" />
      <Dot x={ox} y={oy} color={pink} r={5} />
      <Label x={ox - 14} y={oy + 4} text="O" color={pink} size={14} />
      <Label x={pts[0][0] + 6} y={pts[0][1] - 6} text="A" color={purple} size={11} />
      <Label x={rpts[0][0] + 6} y={rpts[0][1] - 6} text="A'" color={amber} size={11} />
      <Label x={230} y={232} text="旋转60°（原图紫色，像为金色）" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Rotation preserves distances and angles */
function RotationProperties() {
  const ox = 180, oy = 120;
  const pts: [number, number][] = [[250, 50], [300, 130]];
  const angle = Math.PI / 4;
  const rot = (x: number, y: number) => {
    const dx = x - ox, dy = y - oy;
    return [ox + dx * Math.cos(angle) - dy * Math.sin(angle), oy + dx * Math.sin(angle) + dy * Math.cos(angle)] as [number, number];
  };
  const rpts = pts.map(([x, y]) => rot(x, y));
  return (
    <Wrapper width={460} height={220}>
      <line x1={ox} y1={oy} x2={pts[0][0]} y2={pts[0][1]} stroke={purple} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={ox} y1={oy} x2={pts[1][0]} y2={pts[1][1]} stroke={purple} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={ox} y1={oy} x2={rpts[0][0]} y2={rpts[0][1]} stroke={amber} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={ox} y1={oy} x2={rpts[1][0]} y2={rpts[1][1]} stroke={amber} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[1][0]} y2={pts[1][1]} stroke={purple} strokeWidth={2.5} />
      <line x1={rpts[0][0]} y1={rpts[0][1]} x2={rpts[1][0]} y2={rpts[1][1]} stroke={amber} strokeWidth={2.5} />
      <Dot x={pts[0][0]} y={pts[0][1]} color={purple} r={4} /><Label x={pts[0][0] + 8} y={pts[0][1] - 6} text="A" color={purple} />
      <Dot x={pts[1][0]} y={pts[1][1]} color={purple} r={4} /><Label x={pts[1][0] + 8} y={pts[1][1] + 4} text="B" color={purple} />
      <Dot x={rpts[0][0]} y={rpts[0][1]} color={amber} r={4} /><Label x={rpts[0][0] + 8} y={rpts[0][1] - 6} text="A'" color={amber} />
      <Dot x={rpts[1][0]} y={rpts[1][1]} color={amber} r={4} /><Label x={rpts[1][0] + 8} y={rpts[1][1] + 4} text="B'" color={amber} />
      <Dot x={ox} y={oy} color={pink} r={5} /><Label x={ox - 16} y={oy + 4} text="O" color={pink} size={14} />
      <Label x={230} y={210} text="OA = OA'，OB = OB'，AB = A'B'" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Central symmetry — 180° rotation */
function CentralSymmetry() {
  const ox = 220, oy = 110;
  const pts = [[140, 50], [180, 140], [100, 130]];
  const rpts = pts.map(([x, y]) => [2 * ox - x, 2 * oy - y]);
  return (
    <Wrapper width={460} height={220}>
      <polygon points={pts.map(p => p.join(",")).join(" ")} fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={2} />
      <polygon points={rpts.map(p => p.join(",")).join(" ")} fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={2} />
      {pts.map((p, i) => (
        <line key={`cs${i}`} x1={p[0]} y1={p[1]} x2={rpts[i][0]} y2={rpts[i][1]} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />
      ))}
      <Dot x={ox} y={oy} color={pink} r={5} />
      <Label x={ox} y={oy - 12} text="O" color={pink} size={14} />
      <Label x={pts[0][0] - 8} y={pts[0][1] - 8} text="A" color={purple} size={11} />
      <Label x={pts[1][0] + 8} y={pts[1][1] + 4} text="B" color={purple} size={11} />
      <Label x={pts[2][0] - 12} y={pts[2][1] + 4} text="C" color={purple} size={11} />
      <Label x={rpts[0][0] + 8} y={rpts[0][1] + 14} text="A'" color={amber} size={11} />
      <Label x={rpts[1][0] - 12} y={rpts[1][1] - 4} text="B'" color={amber} size={11} />
      <Label x={rpts[2][0] + 10} y={rpts[2][1] - 4} text="C'" color={amber} size={11} />
      <Label x={230} y={212} text="中心对称（旋转180°）" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Comparison — line symmetry vs central symmetry vs rotation */
function RotationVsSymmetry() {
  return (
    <Wrapper width={500} height={200}>
      <line x1={80} y1={15} x2={80} y2={155} stroke={lightGray} strokeWidth={1.5} strokeDasharray="5,3" />
      <polygon points="40,50 70,130 30,120" fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={2} />
      <polygon points="120,50 90,130 130,120" fill="rgba(139,92,246,0.1)" stroke={purple} strokeWidth={2} strokeDasharray="4,2" />
      <Label x={80} y={175} text="轴对称" color={purple} size={11} />
      <Label x={80} y={190} text="Line Sym." color={gray} size={10} />
      <polygon points="210,40 240,100 200,95" fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={2} />
      <polygon points="290,130 260,70 300,75" fill="rgba(245,158,11,0.1)" stroke={amber} strokeWidth={2} strokeDasharray="4,2" />
      <Dot x={250} y={85} color={pink} r={4} />
      <Label x={250} y={175} text="中心对称" color={amber} size={11} />
      <Label x={250} y={190} text="Central (180°)" color={gray} size={10} />
      <polygon points="380,40 420,110 370,100" fill="rgba(236,72,153,0.1)" stroke={pink} strokeWidth={2} />
      <polygon points="410,30 450,90 430,50" fill="rgba(236,72,153,0.1)" stroke={pink} strokeWidth={2} strokeDasharray="4,2" />
      <Dot x={400} y={75} color={pink} r={4} />
      <path d="M 414,47 A 22 22 0 0 1 418,68" fill="none" stroke={pink} strokeWidth={1.5} />
      <Label x={420} y={175} text="旋转" color={pink} size={11} />
      <Label x={420} y={190} text="Rotation (θ)" color={gray} size={10} />
    </Wrapper>
  );
}

/** Diagram: Point (a,b) rotated 90° and 180° on coordinate plane */
function CoordinateRotation() {
  const ox = 200, oy = 120, scale = 40;
  const axLen = 160;
  const px = ox + 3 * scale, py = oy - 2 * scale;
  const p90x = ox + (-2) * scale, p90y = oy - 3 * scale;
  const p180x = ox + (-3) * scale, p180y = oy - (-2) * scale;
  const r0 = Math.hypot(px - ox, py - oy);
  return (
    <Wrapper width={440} height={240}>
      <line x1={ox - axLen} y1={oy} x2={ox + axLen} y2={oy} stroke={gray} strokeWidth={1.5} />
      <line x1={ox} y1={oy + axLen} x2={ox} y2={oy - axLen} stroke={gray} strokeWidth={1.5} />
      <polygon points={`${ox + axLen - 6},${oy - 4} ${ox + axLen},${oy} ${ox + axLen - 6},${oy + 4}`} fill={gray} />
      <polygon points={`${ox - 4},${oy - axLen + 6} ${ox},${oy - axLen} ${ox + 4},${oy - axLen + 6}`} fill={gray} />
      <Label x={ox + axLen - 4} y={oy + 16} text="x" color={gray} size={12} />
      <Label x={ox + 12} y={oy - axLen + 10} text="y" color={gray} size={12} />
      <Label x={ox - 10} y={oy + 14} text="O" color={gray} size={11} />
      <Dot x={px} y={py} color={purple} r={5} />
      <Label x={px + 8} y={py - 8} text="P(a, b)" color={purple} size={12} anchor="start" />
      <path d={`M ${px},${py} A ${r0} ${r0} 0 0 0 ${p90x},${p90y}`} fill="none" stroke={amber} strokeWidth={1.5} strokeDasharray="4,3" />
      <Dot x={p90x} y={p90y} color={amber} r={5} />
      <Label x={p90x - 8} y={p90y - 10} text="90°: (−b, a)" color={amber} size={11} anchor="end" />
      <path d={`M ${px},${py} A ${r0} ${r0} 0 0 0 ${p180x},${p180y}`} fill="none" stroke={pink} strokeWidth={1.5} strokeDasharray="4,3" />
      <Dot x={p180x} y={p180y} color={pink} r={5} />
      <Label x={p180x - 8} y={p180y + 14} text="180°: (−a, −b)" color={pink} size={11} anchor="end" />
      <line x1={ox} y1={oy} x2={px} y2={py} stroke={purple} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={ox} y1={oy} x2={p90x} y2={p90y} stroke={amber} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={ox} y1={oy} x2={p180x} y2={p180y} stroke={pink} strokeWidth={1} strokeDasharray="3,3" />
    </Wrapper>
  );
}

/** Diagram: Boomerang Model (Concave Quadrilateral) */
function BoomerangModelDiagram() {
  const A1 = { x: 190, y: 30 };
  const B1 = { x: 100, y: 150 };
  const C1 = { x: 280, y: 150 };
  const D1 = { x: 190, y: 90 }; // reflex vertex

  return (
    <Wrapper width={380} height={200}>
      <polygon points={`${A1.x},${A1.y} ${B1.x},${B1.y} ${D1.x},${D1.y} ${C1.x},${C1.y}`} fill="rgba(139,92,246,0.05)" stroke={purple} strokeWidth={2} />
      {/* Auxiliary line AD extended */}
      <line x1={A1.x} y1={A1.y} x2={A1.x} y2={180} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      
      {/* Angles for Boomerang */}
      <path d="M 180,45 A 18 18 0 0 0 200,45" fill="none" stroke={purple} strokeWidth={1.5} />
      <path d="M 115,145 A 16 16 0 0 0 120,130" fill="none" stroke={purple} strokeWidth={1.5} />
      <path d="M 265,145 A 16 16 0 0 1 260,130" fill="none" stroke={purple} strokeWidth={1.5} />
      {/* Reflex/Obtuse angle at D */}
      <path d="M 175,105 A 20 20 0 0 0 205,105" fill="none" stroke={amber} strokeWidth={2} />

      <Dot x={A1.x} y={A1.y} color={purple} r={4} />
      <Dot x={B1.x} y={B1.y} color={purple} r={4} />
      <Dot x={C1.x} y={C1.y} color={purple} r={4} />
      <Dot x={D1.x} y={D1.y} color={amber} r={4} />

      <Label x={A1.x} y={A1.y - 10} text="A" color={purple} />
      <Label x={B1.x - 12} y={B1.y + 10} text="B" color={purple} />
      <Label x={C1.x + 12} y={C1.y + 10} text="C" color={purple} />
      <Label x={D1.x + 16} y={D1.y - 10} text="D" color={amber} />
      <Label x={190} y={192} text="∠BDC = ∠A+∠B+∠C" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: Kite Model (Intersecting Cevians) */
function KiteModelDiagram() {
  const A2 = { x: 190, y: 30 };
  const B2 = { x: 90, y: 160 };
  const C2 = { x: 290, y: 160 };
  const P2 = { x: 190, y: 110 };
  // D2 on A2C2: B2P2 extended
  const D2 = { x: 240, y: 80 };
  // E2 on A2B2: C2P2 extended
  const E2 = { x: 140, y: 80 };

  return (
    <Wrapper width={380} height={200}>
      <polygon points={`${A2.x},${A2.y} ${B2.x},${B2.y} ${C2.x},${C2.y}`} fill="none" stroke={purple} strokeWidth={2} />
      {/* Intersecting lines */}
      <line x1={B2.x} y1={B2.y} x2={D2.x} y2={D2.y} stroke={amber} strokeWidth={2} />
      <line x1={C2.x} y1={C2.y} x2={E2.x} y2={E2.y} stroke={amber} strokeWidth={2} />

      {/* Angles for Kite */}
      <path d="M 180,50 A 22 22 0 0 1 200,50" fill="none" stroke={purple} strokeWidth={1.5} />
      <path d="M 176,117 A 16 16 0 0 0 204,117" fill="none" stroke={amber} strokeWidth={2} />
      {/* Wings */}
      <path d="M 240,95 A 15 15 0 0 1 253,75" fill="none" stroke={pink} strokeWidth={1.5} />
      <path d="M 140,95 A 15 15 0 0 0 127,75" fill="none" stroke={pink} strokeWidth={1.5} />

      <Dot x={A2.x} y={A2.y} color={purple} r={4} />
      <Dot x={B2.x} y={B2.y} color={purple} r={4} />
      <Dot x={C2.x} y={C2.y} color={purple} r={4} />
      <Dot x={P2.x} y={P2.y} color={pink} r={5} />
      <Dot x={D2.x} y={D2.y} color={amber} r={4} />
      <Dot x={E2.x} y={E2.y} color={amber} r={4} />

      <Label x={A2.x} y={A2.y - 10} text="A" color={purple} />
      <Label x={B2.x - 12} y={B2.y + 10} text="B" color={purple} />
      <Label x={C2.x + 12} y={C2.y + 10} text="C" color={purple} />
      <Label x={P2.x - 12} y={P2.y + 10} text="P" color={pink} />
      <Label x={D2.x + 10} y={D2.y - 4} text="D" color={amber} />
      <Label x={E2.x - 12} y={E2.y - 4} text="E" color={amber} />
      <Label x={190} y={192} text="∠BPC = ∠A+∠ABD+∠ACE" color={gray} size={12} />
    </Wrapper>
  );
}

/** Diagram: Hourglass/bowtie — △ABE ∼ △DCE, AB∥CD, X crossing at E */
function HourglassModelDiagram() {
  // AB short on top, CD long on bottom. Lines AC and BD cross at E.
  // Pre-computed E: intersection of line A(130,30)→C(320,200) and line B(230,30)→D(40,200).
  // AC parametric: (130+190t, 30+170t). BD parametric: (230-190s, 30+170s).
  // 130+190t = 230-190s → t+s = 100/190. 30+170t = 30+170s → t=s.
  // 2t = 100/190 → t≈0.263. E = (130+50, 30+45) = (180, 75). Adjusted to (180, 85) for visual.
  const A = { x: 130, y: 30 };
  const B = { x: 230, y: 30 };
  const C = { x: 320, y: 200 };
  const D = { x: 40, y: 200 };
  const E = { x: 180, y: 85 };
  return (
    <Wrapper width={440} height={230}>
      {/* Top segment AB */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={purple} strokeWidth={2} />
      {/* Bottom segment CD (note: D left, C right) */}
      <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke={amber} strokeWidth={2} />
      {/* Cross lines forming the X */}
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={purple} strokeWidth={2} />
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={purple} strokeWidth={2} />
      {/* Parallel marks on AB (arrows-style double tick) */}
      <line x1={176} y1={26} x2={180} y2={34} stroke={purple} strokeWidth={2} />
      <line x1={182} y1={26} x2={186} y2={34} stroke={purple} strokeWidth={2} />
      {/* Parallel marks on CD */}
      <line x1={176} y1={196} x2={180} y2={204} stroke={amber} strokeWidth={2} />
      <line x1={182} y1={196} x2={186} y2={204} stroke={amber} strokeWidth={2} />
      {/* Vertical angle marks at E (two opposite pairs) */}
      <path d="M 168,75 A 14 14 0 0 0 174,72" fill="none" stroke={pink} strokeWidth={2} />
      <path d="M 192,95 A 14 14 0 0 0 186,98" fill="none" stroke={pink} strokeWidth={2} />
      {/* Points */}
      <Dot x={E.x} y={E.y} color={pink} r={5} />
      {/* Labels */}
      <Label x={A.x - 10} y={A.y - 6} text="A" color={purple} />
      <Label x={B.x + 10} y={B.y - 6} text="B" color={purple} />
      <Label x={E.x + 14} y={E.y + 4} text="E" color={pink} />
      <Label x={C.x + 10} y={C.y + 10} text="C" color={amber} />
      <Label x={D.x - 10} y={D.y + 10} text="D" color={amber} />
      <Label x={340} y={30} text="AB ∥ CD" color={gray} size={12} />
      <Label x={340} y={50} text="△ABE ∼ △DCE" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Hand-in-hand — two isosceles triangles sharing vertex O, rotated */
function HandInHandDiagram() {
  // Two isosceles triangles sharing vertex O with equal apex angles.
  // △OAB (purple): OA=OB=176 (symmetric about O). A and B symmetric below O.
  // △OCD (amber): rotated 30° around O. Pre-computed from rotation of OA, OB.
  // OA=(-100,145), rotated 30°: cos30≈0.866, sin30=0.5
  // C = O + rot(OA) = (230 + (-100*0.866 - 145*0.5), 40 + (-100*0.5 + 145*0.866))
  //   = (230 - 87 - 73, 40 - 50 + 126) = (70, 116) → use (71, 116)
  // OB=(100,145), rotated 30°:
  // D = O + rot(OB) = (230 + (100*0.866 - 145*0.5), 40 + (100*0.5 + 145*0.866))
  //   = (230 + 87 - 73, 40 + 50 + 126) = (244, 216)
  const O = { x: 230, y: 40 };
  const A = { x: 130, y: 185 };
  const B = { x: 330, y: 185 };
  const C = { x: 71, y: 116 };
  const D = { x: 244, y: 216 };
  return (
    <Wrapper width={420} height={230}>
      {/* △OAB in purple (isosceles, OA=OB≈176) */}
      <polygon points={`${O.x},${O.y} ${A.x},${A.y} ${B.x},${B.y}`} fill="none" stroke={purple} strokeWidth={2} />
      {/* △OCD in amber (isosceles, OC=OD≈176, rotated copy) */}
      <polygon points={`${O.x},${O.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="none" stroke={amber} strokeWidth={2} />
      {/* Connecting segments AC and BD — the "hands" (key conclusion: AC=BD) */}
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />
      {/* Single tick marks: OA=OC */}
      <line x1={177} y1={108} x2={183} y2={118} stroke={purple} strokeWidth={2} />
      <line x1={147} y1={74} x2={153} y2={84} stroke={amber} strokeWidth={2} />
      {/* Double tick marks: OB=OD */}
      <line x1={280} y1={108} x2={274} y2={118} stroke={purple} strokeWidth={2} />
      <line x1={284} y1={112} x2={278} y2={122} stroke={purple} strokeWidth={2} />
      <line x1={238} y1={125} x2={234} y2={135} stroke={amber} strokeWidth={2} />
      <line x1={242} y1={129} x2={238} y2={139} stroke={amber} strokeWidth={2} />
      {/* Angle arcs at O: ∠AOB (purple) and ∠COD (amber) — equal */}
      <path d="M 214,58 A 20 20 0 0 1 246,58" fill="none" stroke={purple} strokeWidth={1.5} />
      <path d="M 216,52 A 22 22 0 0 0 238,56" fill="none" stroke={amber} strokeWidth={1.5} />
      {/* Point O */}
      <Dot x={O.x} y={O.y} color={pink} r={5} />
      {/* Labels */}
      <Label x={O.x + 2} y={O.y - 12} text="O" color={pink} />
      <Label x={A.x - 14} y={A.y + 8} text="A" color={purple} />
      <Label x={B.x + 10} y={B.y + 8} text="B" color={purple} />
      <Label x={C.x - 14} y={C.y + 4} text="C" color={amber} />
      <Label x={D.x + 10} y={D.y + 8} text="D" color={amber} />
      <Label x={30} y={20} text="△OAC ≅ △OBD" color={gray} size={12} />
      <Label x={30} y={40} text="AC = BD" color={pink} size={11} />
    </Wrapper>
  );
}

/** Diagram: Half-angle model — ∠A = 2∠B, cut BD=BC to construct isosceles △BDC */
function HalfAngleDiagram() {
  // Classic half-angle model: Square ABCD, E on BC, F on CD, ∠EAF = 45°.
  // Rotate △ABE 90° to △ADG.
  const A = { x: 100, y: 180 }; // Bottom-left for standard orientation, but SVG y goes down. Let's make A bottom-left: (100, 180)
  const B = { x: 260, y: 180 }; // Bottom-right
  const C = { x: 260, y: 20 };  // Top-right
  const D = { x: 100, y: 20 };  // Top-left
  // E on BC (right side), F on CD (top side). Let AE make 20° with AB, AF make 65° with AB (so ∠EAF = 45°).
  // Actually, A is bottom-left, so AB is horizontal, AD is vertical.
  // AE is at 20° from AB. tan(20°) ≈ 0.364. BE = 160 * 0.364 ≈ 58. E = (260, 180 - 58) = (260, 122).
  const E = { x: 260, y: 122 };
  // AF is at 65° from AB (25° from AD). tan(25°) ≈ 0.466. DF = 160 * 0.466 ≈ 75. F = (100 + 75, 20) = (175, 20).
  const F = { x: 175, y: 20 };
  // G is on CD extended to the left. DG = BE = 58. G = (100 - 58, 20) = (42, 20).
  const G = { x: 42, y: 20 };

  return (
    <Wrapper width={400} height={220}>
      {/* Square ABCD */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="none" stroke={purple} strokeWidth={2} />
      
      {/* Rays AE and AF */}
      <line x1={A.x} y1={A.y} x2={E.x} y2={E.y} stroke={purple} strokeWidth={2} />
      <line x1={A.x} y1={A.y} x2={F.x} y2={F.y} stroke={purple} strokeWidth={2} />
      <line x1={E.x} y1={E.y} x2={F.x} y2={F.y} stroke={amber} strokeWidth={2} />

      {/* Rotation construction: △ADG and ray AG */}
      <line x1={D.x} y1={D.y} x2={G.x} y2={G.y} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />
      <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />
      <line x1={G.x} y1={G.y} x2={F.x} y2={F.y} stroke={pink} strokeWidth={2} strokeDasharray="5,3" />

      {/* Angle arc for ∠EAF = 45° */}
      {/* AE dir: (160, -58), AF dir: (75, -160). Arc radius 40. */}
      {/* Normalize: AE (0.94, -0.34) -> (100+38, 180-14) = (138, 166). AF (0.42, -0.90) -> (100+17, 180-36) = (117, 144) */}
      <path d="M 138,166 A 40 40 0 0 0 117,144" fill="none" stroke={purple} strokeWidth={1.5} />
      <Label x={132} y={148} text="45°" color={purple} size={11} />

      {/* Angle arcs for rotated angles: ∠BAE = ∠DAG */}
      {/* AB dir: (1, 0), AE dir: (0.94, -0.34). Arc radius 25. -> (125, 180) to (123, 171) */}
      <path d="M 125,180 A 25 25 0 0 0 123,171" fill="none" stroke={pink} strokeWidth={1.5} />
      {/* AD dir: (0, -1), AG dir: (-0.34, -0.94). Arc radius 25. -> (100, 155) to (91, 156) */}
      <path d="M 100,155 A 25 25 0 0 0 91,156" fill="none" stroke={pink} strokeWidth={1.5} />

      {/* Points */}
      <Dot x={A.x} y={A.y} color={purple} r={4} />
      <Dot x={B.x} y={B.y} color={purple} r={4} />
      <Dot x={C.x} y={C.y} color={purple} r={4} />
      <Dot x={D.x} y={D.y} color={purple} r={4} />
      <Dot x={E.x} y={E.y} color={purple} r={4} />
      <Dot x={F.x} y={F.y} color={purple} r={4} />
      <Dot x={G.x} y={G.y} color={pink} r={4} />

      {/* Labels */}
      <Label x={A.x - 12} y={A.y + 12} text="A" color={purple} />
      <Label x={B.x + 12} y={B.y + 12} text="B" color={purple} />
      <Label x={C.x + 12} y={C.y - 6} text="C" color={purple} />
      <Label x={D.x} y={D.y - 10} text="D" color={purple} />
      <Label x={E.x + 12} y={E.y + 4} text="E" color={purple} />
      <Label x={F.x} y={F.y - 10} text="F" color={purple} />
      <Label x={G.x} y={G.y - 10} text="G" color={pink} />

      {/* Congruence and Perimeter labels */}
      <Label x={300} y={50} text="△ABE ≅ △ADG" color={pink} size={12} anchor="start" />
      <Label x={300} y={70} text="EF = FG = DF + BE" color={gray} size={12} anchor="start" />
      <Label x={300} y={90} text="C_△CEF = 2AB" color={amber} size={12} anchor="start" />
    </Wrapper>
  );
}

/** Diagram: One-line-three-equal-angles — isosceles △ABC (AB=AC), D on BC, ∠ADE=∠B=∠C */
function OneLineThreeAngles() {
  // Classic K-type similarity (Three Perpendiculars model):
  // Right triangle ABC with right angle at A. A is on line l.
  // BD ⊥ l at D, CE ⊥ l at E.
  // Let line l be horizontal y = 160.
  // A = (200, 160).
  // Let AB make angle 35° with l. Then AC makes 35°+90° = 125° with l.
  // Let AB = 100, AC = 100 (isosceles right triangle for AAS congruence).
  // cos(35°) ≈ 0.819, sin(35°) ≈ 0.574
  // B = (200 - 100*0.819, 160 - 100*0.574) = (118, 103)
  // C = (200 + 100*0.574, 160 - 100*0.819) = (257, 78)
  const A = { x: 200, y: 160 };
  const B = { x: 118, y: 103 };
  const C = { x: 257, y: 78 };
  
  // D and E are projections of B and C onto l
  const D = { x: 118, y: 160 };
  const E = { x: 257, y: 160 };

  return (
    <Wrapper width={400} height={200}>
      {/* Line l */}
      <line x1={50} y1={160} x2={350} y2={160} stroke={gray} strokeWidth={2} />
      
      {/* Right triangle ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke={purple} strokeWidth={2} />
      
      {/* Perpendiculars BD and CE */}
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={pink} strokeWidth={2} />
      <line x1={C.x} y1={C.y} x2={E.x} y2={E.y} stroke={pink} strokeWidth={2} />

      {/* Right angle symbols */}
      <polyline points={`${D.x},${D.y - 10} ${D.x + 10},${D.y - 10} ${D.x + 10},${D.y}`} fill="none" stroke={amber} strokeWidth={1.5} />
      <polyline points={`${E.x},${E.y - 10} ${E.x - 10},${E.y - 10} ${E.x - 10},${E.y}`} fill="none" stroke={amber} strokeWidth={1.5} />
      {/* Right angle at A in △ABC */}
      {/* AB dir (-0.819, -0.574) -> norm * 15 = (-12.3, -8.6). AC dir (0.574, -0.819) -> norm * 15 = (8.6, -12.3) */}
      <polyline points={`${A.x - 12.3},${A.y - 8.6} ${A.x - 12.3 + 8.6},${A.y - 8.6 - 12.3} ${A.x + 8.6},${A.y - 12.3}`} fill="none" stroke={purple} strokeWidth={1.5} />

      {/* Equal angles: ∠ABD = ∠CAE */}
      <path d="M 118,123 A 20 20 0 0 1 129,119" fill="none" stroke={pink} strokeWidth={2} />
      <path d="M 220,160 A 20 20 0 0 0 216,144" fill="none" stroke={pink} strokeWidth={2} />

      {/* Equal angles: ∠DAB = ∠ACE */}
      <path d="M 180,160 A 20 20 0 0 1 184,149" fill="none" stroke={amber} strokeWidth={2} />
      {/* ACE angle at C: CE dir (0, 1), CA dir (-0.574, 0.819). arc from CE towards CA */}
      <path d="M 257,98 A 20 20 0 0 1 245,95" fill="none" stroke={amber} strokeWidth={2} />

      {/* Points */}
      <Dot x={A.x} y={A.y} color={purple} r={4} />
      <Dot x={B.x} y={B.y} color={purple} r={4} />
      <Dot x={C.x} y={C.y} color={purple} r={4} />
      <Dot x={D.x} y={D.y} color={pink} r={4} />
      <Dot x={E.x} y={E.y} color={pink} r={4} />

      {/* Labels */}
      <Label x={A.x} y={A.y + 16} text="A" color={purple} />
      <Label x={B.x - 12} y={B.y} text="B" color={purple} />
      <Label x={C.x + 12} y={C.y} text="C" color={purple} />
      <Label x={D.x} y={D.y + 16} text="D" color={pink} />
      <Label x={E.x} y={E.y + 16} text="E" color={pink} />
      <Label x={360} y={160} text="l" color={gray} />

      {/* Equations */}
      <Label x={200} y={40} text="△ABD ≅ △CAE (AAS)" color={pink} size={14} />
    </Wrapper>
  );
}

/** Diagram: Area as function — P moves along a line, height changes, area changes */
function AreaAsFunction() {
  const B = { x: 80, y: 170 }, C = { x: 320, y: 170 };
  const ps = [{ x: 120, y: 50 }, { x: 200, y: 50 }, { x: 280, y: 50 }];
  return (
    <Wrapper width={420} height={210}>
      {/* Base BC */}
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={purple} strokeWidth={2.5} />
      {/* Moving line */}
      <line x1={60} y1={50} x2={360} y2={50} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      {ps.map((p, i) => (
        <g key={i} opacity={i === 1 ? 1 : 0.4}>
          <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${p.x},${p.y}`} fill="none" stroke={i === 1 ? pink : lightGray} strokeWidth={1.5} strokeDasharray={i === 1 ? "0" : "4,3"} />
          <line x1={p.x} y1={p.y} x2={p.x} y2={C.y} stroke={amber} strokeWidth={1} strokeDasharray="3,2" />
          <Dot x={p.x} y={p.y} color={i === 1 ? pink : lightGray} r={4} />
        </g>
      ))}
      <Label x={B.x} y={B.y + 16} text="B" color={purple} />
      <Label x={C.x} y={C.y + 16} text="C" color={purple} />
      <Label x={ps[1].x} y={ps[1].y - 10} text="P" color={pink} />
      <Label x={ps[1].x + 14} y={120} text="h" color={amber} size={12} />
      <Label x={360} y={40} text="h changes → area changes" color={gray} size={11} anchor="end" />
    </Wrapper>
  );
}

/** Diagram: Path & trajectory — midpoint M of moving segment traces a line */
function PathTrajectory() {
  const positions = [
    { a: { x: 60, y: 50 }, b: { x: 180, y: 150 } },
    { a: { x: 120, y: 50 }, b: { x: 240, y: 150 } },
    { a: { x: 180, y: 50 }, b: { x: 300, y: 150 } },
  ];
  const mids = positions.map(p => ({ x: (p.a.x + p.b.x) / 2, y: (p.a.y + p.b.y) / 2 }));
  return (
    <Wrapper width={400} height={200}>
      {/* Guide lines */}
      <line x1={30} y1={50} x2={370} y2={50} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      <line x1={30} y1={150} x2={370} y2={150} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      {positions.map((p, i) => (
        <g key={i} opacity={i === 1 ? 1 : 0.4}>
          <line x1={p.a.x} y1={p.a.y} x2={p.b.x} y2={p.b.y} stroke={purple} strokeWidth={1.5} />
          <Dot x={p.a.x} y={p.a.y} color={purple} r={3} />
          <Dot x={p.b.x} y={p.b.y} color={purple} r={3} />
        </g>
      ))}
      {/* Trajectory of M */}
      <line x1={mids[0].x} y1={mids[0].y} x2={mids[2].x} y2={mids[2].y} stroke={pink} strokeWidth={2} strokeDasharray="6,3" />
      {mids.map((m, i) => <Dot key={i} x={m.x} y={m.y} color={pink} r={5} />)}
      <Label x={mids[1].x} y={mids[1].y - 12} text="M" color={pink} />
      <Label x={350} y={190} text="trajectory of M" color={gray} size={11} anchor="end" />
    </Wrapper>
  );
}

/** Diagram: Piecewise discussion — point moves along L-shaped path on rectangle */
function PiecewiseDiscussion() {
  const A = { x: 60, y: 40 }, B = { x: 340, y: 40 }, C = { x: 340, y: 160 }, D = { x: 60, y: 160 };
  const turn = { x: 340, y: 40 }; // corner B is the turning point
  return (
    <Wrapper width={420} height={200}>
      <rect x={A.x} y={A.y} width={280} height={120} fill="none" stroke={lightGray} strokeWidth={1.5} />
      {/* Phase 1: along AB */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={purple} strokeWidth={3} />
      {/* Phase 2: along BC */}
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={amber} strokeWidth={3} />
      {/* Shaded regions */}
      <rect x={A.x} y={A.y} width={140} height={5} fill={purple} opacity={0.2} />
      <rect x={B.x - 5} y={B.y} width={5} height={60} fill={amber} opacity={0.2} />
      {/* Turning point */}
      <Dot x={turn.x} y={turn.y} color={pink} r={6} />
      <Label x={A.x} y={A.y - 8} text="A (start)" color={purple} size={11} />
      <Label x={turn.x} y={turn.y - 12} text="B (turn)" color={pink} size={11} />
      <Label x={C.x + 4} y={C.y + 14} text="C" color={amber} size={11} />
      <Label x={D.x} y={D.y + 14} text="D" color={gray} size={11} />
      <Label x={200} y={A.y + 30} text="case 1" color={purple} size={12} />
      <Label x={B.x + 30} y={100} text="case 2" color={amber} size={12} anchor="start" />
      <Label x={200} y={190} text="formula changes at turning point" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Drinking horse — reflection across a line to find shortest path */
function DrinkingHorseDiagram() {
  const ly = 130;
  const A = { x: 80, y: 50 }, B = { x: 320, y: 60 };
  const Ap = { x: 80, y: 2 * ly - 50 }; // reflection of A
  // P = intersection of A'B with line l
  const t = (ly - Ap.y) / (B.y - Ap.y);
  const P = { x: Ap.x + t * (B.x - Ap.x), y: ly };
  return (
    <Wrapper width={420} height={240}>
      {/* Line l */}
      <line x1={30} y1={ly} x2={390} y2={ly} stroke={gray} strokeWidth={2} />
      <Label x={395} y={ly + 4} text="l" color={gray} size={14} anchor="start" />
      {/* A and B */}
      <Dot x={A.x} y={A.y} color={pink} r={5} />
      <Dot x={B.x} y={B.y} color={pink} r={5} />
      <Label x={A.x} y={A.y - 10} text="A" color={pink} />
      <Label x={B.x} y={B.y - 10} text="B" color={pink} />
      {/* A' reflection */}
      <Dot x={Ap.x} y={Ap.y} color={amber} r={5} />
      <Label x={Ap.x} y={Ap.y + 16} text="A'" color={amber} />
      {/* Dashed AA' */}
      <line x1={A.x} y1={A.y} x2={Ap.x} y2={Ap.y} stroke={lightGray} strokeWidth={1} strokeDasharray="4,3" />
      {/* A'B line through P */}
      <line x1={Ap.x} y1={Ap.y} x2={B.x} y2={B.y} stroke={amber} strokeWidth={1.5} strokeDasharray="5,3" />
      {/* Paths AP + PB */}
      <line x1={A.x} y1={A.y} x2={P.x} y2={P.y} stroke={purple} strokeWidth={2} />
      <line x1={P.x} y1={P.y} x2={B.x} y2={B.y} stroke={purple} strokeWidth={2} />
      <Dot x={P.x} y={P.y} color={purple} r={5} />
      <Label x={P.x} y={P.y - 10} text="P" color={purple} />
      <Label x={200} y={225} text="AP + PB = A'P + PB = A'B (min)" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: Triangle perimeter optimization — isosceles minimizes perimeter */
function TrianglePerimeterOpt() {
  const B = { x: 100, y: 170 }, C = { x: 300, y: 170 };
  const A1 = { x: 200, y: 40 }; // isosceles (optimal)
  const A2 = { x: 130, y: 50 }; // non-isosceles
  return (
    <Wrapper width={420} height={210}>
      {/* Line above */}
      <line x1={60} y1={40} x2={360} y2={40} stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      {/* Non-isosceles (faded) */}
      <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${A2.x},${A2.y}`} fill="none" stroke={lightGray} strokeWidth={1.5} strokeDasharray="4,3" />
      <Dot x={A2.x} y={A2.y} color={lightGray} r={3} />
      {/* Isosceles (optimal) */}
      <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${A1.x},${A1.y}`} fill="none" stroke={purple} strokeWidth={2} />
      <Dot x={A1.x} y={A1.y} color={pink} r={5} />
      {/* Symmetry axis */}
      <line x1={200} y1={30} x2={200} y2={180} stroke={amber} strokeWidth={1} strokeDasharray="3,3" />
      <Label x={B.x} y={B.y + 16} text="B" color={purple} />
      <Label x={C.x} y={C.y + 16} text="C" color={purple} />
      <Label x={A1.x + 14} y={A1.y - 4} text="A (isosceles)" color={pink} size={11} />
      <Label x={A2.x - 14} y={A2.y + 16} text="A'" color={lightGray} size={11} />
      <Label x={350} y={200} text="isosceles = min perimeter" color={gray} size={11} anchor="end" />
    </Wrapper>
  );
}

/** Diagram: Completing the square — parabola with vertex as minimum */
function CompletingSquareDiagram() {
  const ox = 60, oy = 180, sx = 60, sy = 35;
  const vx = 2, vy = 1; // vertex at (2,1)
  const toSvg = (x: number, y: number) => ({ x: ox + x * sx, y: oy - y * sy });
  const v = toSvg(vx, vy);
  const pts: string[] = [];
  for (let t = -0.5; t <= 4.5; t += 0.2) {
    const y = (t - 2) * (t - 2) + 1;
    if (y > 5.5) continue;
    const p = toSvg(t, y);
    pts.push(`${p.x},${p.y}`);
  }
  return (
    <Wrapper width={380} height={220}>
      {/* Axes */}
      <line x1={ox} y1={10} x2={ox} y2={oy + 10} stroke={gray} strokeWidth={1.5} />
      <line x1={ox - 10} y1={oy} x2={350} y2={oy} stroke={gray} strokeWidth={1.5} />
      <Label x={ox - 8} y={16} text="y" color={gray} size={12} />
      <Label x={348} y={oy + 16} text="x" color={gray} size={12} />
      {/* Parabola */}
      <polyline points={pts.join(" ")} fill="none" stroke={purple} strokeWidth={2} />
      {/* Vertex */}
      <Dot x={v.x} y={v.y} color={pink} r={6} />
      <line x1={v.x} y1={v.y} x2={v.x} y2={oy} stroke={amber} strokeWidth={1} strokeDasharray="3,3" />
      <line x1={v.x} y1={v.y} x2={ox} y2={v.y} stroke={amber} strokeWidth={1} strokeDasharray="3,3" />
      <Label x={v.x} y={v.y - 12} text="(2, 1)" color={pink} size={12} />
      <Label x={v.x + 40} y={v.y - 20} text="vertex = min value" color={gray} size={11} />
      <Label x={ox + 4} y={oy + 16} text="O" color={gray} size={11} />
    </Wrapper>
  );
}

/** Diagram: AM-GM — square (max area) vs thin rectangle (same perimeter) */
function AMGMDiagram() {
  const y0 = 30;
  // Square: 80×80
  const sq = { x: 60, y: y0, w: 100, h: 100 };
  // Thin rect: 140×40, same perimeter (2*(100+100)=400 vs 2*(140+40)=360... adjust to same perimeter: 2*(a+b)=400 → a+b=200 → use 130×70 scaled)
  const rc = { x: 220, y: y0 + 20, w: 150, h: 60 };
  return (
    <Wrapper width={420} height={180}>
      {/* Square (optimal) */}
      <rect x={sq.x} y={sq.y} width={sq.w} height={sq.h} fill={purple} fillOpacity={0.15} stroke={purple} strokeWidth={2} />
      <Label x={sq.x + sq.w / 2} y={sq.y + sq.h + 20} text="a = b → max area" color={purple} size={12} />
      <Label x={sq.x + sq.w / 2} y={sq.y + sq.h / 2 + 4} text="a × a" color={purple} size={13} />
      {/* Thin rectangle */}
      <rect x={rc.x} y={rc.y} width={rc.w} height={rc.h} fill={amber} fillOpacity={0.12} stroke={amber} strokeWidth={2} />
      <Label x={rc.x + rc.w / 2} y={rc.y + rc.h + 20} text="a ≠ b → smaller area" color={amber} size={12} />
      <Label x={rc.x + rc.w / 2} y={rc.y + rc.h / 2 + 4} text="a × b" color={amber} size={13} />
      <Label x={210} y={170} text="same perimeter, different area" color={gray} size={12} />
    </Wrapper>
  );
}

/** Map concept IDs to their diagrams */
const diagramMap: Record<string, React.ReactNode[]> = {
  "factor-tree": [<FactorTree key="ft" />],
  "divisibility-rules": [<DivisibilityRules key="dr" />],
  "gcd-lcm": [<GcdLcmVenn key="glv" />],
  "prime-factorization": [<PrimeNumberSieve key="pns" />],
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
  // Grade 8 quadrilaterals
  "parallelogram-properties": [<ParallelogramProperties key="pp2" />],
  "parallelogram-criteria": [<ParallelogramCriteria key="pc2" />],
  "rectangle": [<RectangleDiagram key="rect" />],
  "rhombus": [<RhombusDiagram key="rhom" />],
  "square": [<SquareDiagram key="sq" />],
  "trapezoid": [<TrapezoidDiagram key="trap" />],
  "midsegment-theorem": [<MidsegmentTheorem key="ms" />],
  // Grade 8 linear functions
  "function-concept": [<FunctionConceptDiagram key="fcd" />],
  "direct-proportion": [<DirectProportionDiagram key="dpd" />],
  "linear-function-definition": [<LinearFunctionDefinition key="lfd" />],
  "slope-intercept": [<SlopeInterceptDiagram key="sid" />],
  "functions-equations-inequalities": [<FunctionsEquationsInequalities key="fei" />],
  // Grade 9 quadratic functions
  "basic-parabola": [<BasicParabola key="bp" />],
  "vertex-form": [<VertexFormDiagram key="vfd" />],
  "discriminant-intersections": [<DiscriminantIntersections key="di" />],
  // Grade 9 circles
  "circle-basic-concepts": [<CircleBasicConcepts key="cbc" />],
  "point-circle-relation": [<PointCircleRelation key="pcr" />],
  "line-circle-relation": [<LineCircleRelation key="lcr" />],
  "circle-circle-relation": [<CircleCircleRelation key="ccr" />],
  "central-angle-arc-chord": [<CentralAngleArcChord key="caac" />],
  "inscribed-angle-theorem": [<InscribedAngleTheorem key="iat" />],
  "tangent-properties": [<TangentProperties key="tp" />],
  "arc-length-sector-area": [<ArcLengthSectorArea key="alsa" />],
  // Grade 9 inverse proportion functions
  "inverse-proportion-concept": [<InverseProportionConcept key="ipc" />],
  "hyperbola-graph": [<HyperbolaGraph key="hg" />],
  "hyperbola-properties": [<HyperbolaProperties key="hp" />],
  "k-geometric-meaning": [<KGeometricMeaning key="kgm" />],
  // Algebra area models
  "polynomial-area-model": [<PolynomialAreaModel key="pam" />],
  "factorization-area-model": [<FactorizationAreaModel key="fam" />],
  // Grade 9 trigonometric functions
  "trig-definition": [<TrigDefinition key="td" />],
  "special-angles": [<SpecialAngles key="sa" />],
  "solving-right-triangles": [<SolvingRightTriangles key="srt2" />],
  "elevation-depression": [<ElevationDepression key="ed" />],
  // Grade 9 similar figures
  "proportional-segments": [<ProportionalSegments key="ps" />],
  "parallel-proportionality": [<ParallelProportionality key="pprop" />],
  "similar-polygons": [<SimilarPolygons key="sp" />],
  "similar-triangle-criteria": [<SimilarTriangleCriteria key="stc" />],
  "similar-triangle-properties": [<SimilarTriangleProperties key="stp" />],
  "homothety": [<HomothetyDiagram key="hd" />],
  // Grade 9 rotation
  "rotation-definition": [<RotationDefinition key="rd" />],
  "rotation-properties": [<RotationProperties key="rp" />],
  "central-symmetry": [<CentralSymmetry key="csym" />],
  "rotation-vs-symmetry": [<RotationVsSymmetry key="rvs" />],
  "coordinate-rotation": [<CoordinateRotation key="cr" />],
  // Geometry special topics - triangle classic models
  "boomerang-model": [<BoomerangModelDiagram key="bmd" />],
  "kite-model": [<KiteModelDiagram key="kmd" />],
  "hourglass-model": [<HourglassModelDiagram key="hmd" />],
  "hand-in-hand-model": [<HandInHandDiagram key="hhd" />],
  "half-angle-model": [<HalfAngleDiagram key="had" />],
  "one-line-three-equal-angles": [<OneLineThreeAngles key="olta" />],
  // Geometry special topics - dynamic point problems
  "area-as-function": [<AreaAsFunction key="aaf" />],
  "path-and-trajectory": [<PathTrajectory key="pt" />],
  "piecewise-discussion": [<PiecewiseDiscussion key="pwd" />],
  // Geometry special topics - optimization problems
  "general-drinking-horse": [<DrinkingHorseDiagram key="dhd" />],
  "triangle-perimeter-optimization": [<TrianglePerimeterOpt key="tpo" />],
  "algebraic-optimization": [<CompletingSquareDiagram key="csd" />],
  "geometric-algebraic-combined": [<AMGMDiagram key="amgm" />],
};

export default function GeometryDiagram({ conceptId }: { conceptId: string }) {
  const diagrams = diagramMap[conceptId];
  if (!diagrams) return null;
  return <div className="space-y-2">{diagrams}</div>;
}

export function hasGeometryDiagram(conceptId: string): boolean {
  return conceptId in diagramMap;
}
