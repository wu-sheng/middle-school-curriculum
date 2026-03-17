"use client";

const purple = "#8B5CF6";
const pink = "#EC4899";
const gray = "#6B7280";
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

/** Map concept IDs to their diagrams */
const diagramMap: Record<string, React.ReactNode[]> = {
  "solid-and-plane-figures": [<ThreeViews key="tv" />],
  "line-ray-segment": [<LineTypes key="lt" />],
  "segment-comparison": [<SegmentMidpoint key="sm" />],
  "angle-concept": [<AngleDiagram key="ad" />],
  "angle-comparison": [<AngleBisector key="ab" />],
  "complementary-supplementary": [<ComplementarySupplementary key="cs" />],
};

export default function GeometryDiagram({ conceptId }: { conceptId: string }) {
  const diagrams = diagramMap[conceptId];
  if (!diagrams) return null;
  return <div className="space-y-2">{diagrams}</div>;
}

export function hasGeometryDiagram(conceptId: string): boolean {
  return conceptId in diagramMap;
}
