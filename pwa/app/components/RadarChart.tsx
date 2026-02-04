import CountUpValue from "./CountUpValue";

export type RadarCategory = {
  id: string;
  label: string;
  score: number;
  rank: number | null;
};

type RadarChartProps = {
  categories: RadarCategory[];
};

const size = 320;
const center = size / 2;
const maxRadius = size / 2 - 32;

export default function RadarChart({ categories }: RadarChartProps) {
  const axisCount = categories.length;
  const angleStep = (Math.PI * 2) / axisCount;

  const axisPoints = categories.map((_, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    return {
      x: center + maxRadius * Math.cos(angle),
      y: center + maxRadius * Math.sin(angle)
    };
  });

  const polygonPoints = categories
    .map((item, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const radius = (item.score / 100) * maxRadius;
      return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
    })
    .join(" ");

  const rings = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const ringPoints = categories
      .map((_, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const radius = ratio * maxRadius;
        return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
      })
      .join(" ");

    return ringPoints;
  });

  const labelPositions = categories.map((_, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const labelRadius = maxRadius + 50;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return {
      left: `${(x / size) * 100}%`,
      top: `${(y / size) * 100}%`
    };
  });

  return (
    <div className="radar-shell home-radar-shell">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full motion-safe:animate-radarIn"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1746FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0091FF" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {rings.map((points, index) => (
          <polygon
            key={`ring-${index}`}
            points={points}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
        ))}
        {axisPoints.map((point, index) => (
          <line
            key={`axis-${index}`}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}
        <polygon points={polygonPoints} fill="url(#radarGradient)" fillOpacity="0.32" />
        <polygon
          points={polygonPoints}
          fill="none"
          stroke="rgba(23, 70, 255, 0.85)"
          strokeWidth="2"
          className="radar-ring"
        />
        {polygonPoints.split(" ").map((point, index) => {
          const [x, y] = point.split(",");
          return (
            <circle
              key={`dot-${index}`}
              cx={x}
              cy={y}
              r={3}
              fill="#1746FF"
              opacity="0.9"
            />
          );
        })}
      </svg>
      <div className="radar-label-layer">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="absolute text-center radar-label"
            style={{
              left: labelPositions[index].left,
              top: labelPositions[index].top
            }}
          >
            <div className="label-chip uppercase tracking-[0.14em] text-muted sm:tracking-[0.18em]">
              {category.label}
            </div>
            <div className="radar-label-score mt-2 text-lg font-semibold text-accent numeric-glow">
              <CountUpValue value={category.score} />
            </div>
            <div className="radar-label-rank text-[11px] text-muted sm:text-[10px]">
              {category.rank ? `${category.rank}位` : "--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
