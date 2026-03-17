"use client";

interface NumberLineProps {
  points?: { value: number; label?: string }[];
  min?: number;
  max?: number;
}

export default function NumberLine({
  points = [
    { value: -3, label: "-3" },
    { value: 0, label: "0" },
    { value: 2, label: "2" },
  ],
  min = -5,
  max = 5,
}: NumberLineProps) {
  const width = 600;
  const height = 80;
  const padding = 40;
  const lineY = 45;
  const range = max - min;
  const unitWidth = (width - padding * 2) / range;

  const toX = (val: number) => padding + (val - min) * unitWidth;

  return (
    <div className="flex justify-center my-4 overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full"
      >
        {/* Main line */}
        <line
          x1={padding - 10}
          y1={lineY}
          x2={width - padding + 10}
          y2={lineY}
          stroke="#8B5CF6"
          strokeWidth={2}
        />
        {/* Arrow */}
        <polygon
          points={`${width - padding + 10},${lineY} ${width - padding + 2},${lineY - 5} ${width - padding + 2},${lineY + 5}`}
          fill="#8B5CF6"
        />

        {/* Tick marks */}
        {Array.from({ length: range + 1 }, (_, i) => {
          const val = min + i;
          const x = toX(val);
          return (
            <g key={val}>
              <line
                x1={x}
                y1={lineY - 6}
                x2={x}
                y2={lineY + 6}
                stroke="#6B7280"
                strokeWidth={1}
              />
              <text
                x={x}
                y={lineY + 22}
                textAnchor="middle"
                fontSize={12}
                fill="#6B7280"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Points */}
        {points.map((p) => (
          <g key={p.value}>
            <circle
              cx={toX(p.value)}
              cy={lineY}
              r={6}
              fill="#EC4899"
              stroke="white"
              strokeWidth={2}
            />
            {p.label && (
              <text
                x={toX(p.value)}
                y={lineY - 14}
                textAnchor="middle"
                fontSize={13}
                fontWeight="bold"
                fill="#EC4899"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
