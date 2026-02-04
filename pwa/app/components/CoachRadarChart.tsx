import type { CoachRadarMetric } from "../lib/coachData";

type CoachRadarChartProps = {
  metrics: CoachRadarMetric[];
};

const size = 280;
const center = size / 2;
const maxRadius = size / 2 - 46;

const toneClass = (tone?: CoachRadarMetric["tone"]) => {
  switch (tone) {
    case "up":
      return "text-success";
    case "down":
      return "text-danger";
    case "flat":
      return "text-muted";
    default:
      return "text-accent";
  }
};

export default function CoachRadarChart({ metrics }: CoachRadarChartProps) {
  const axisCount = metrics.length;
  const angleStep = (Math.PI * 2) / axisCount;

  const axisPoints = metrics.map((_, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    return {
      x: center + maxRadius * Math.cos(angle),
      y: center + maxRadius * Math.sin(angle)
    };
  });

  const polygonPoints = metrics
    .map((item, index) => {
      const angle = -Math.PI / 2 + angleStep * index;
      const radius = (item.score / 100) * maxRadius;
      return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
    })
    .join(" ");

  const rings = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const ringPoints = metrics
      .map((_, index) => {
        const angle = -Math.PI / 2 + angleStep * index;
        const radius = ratio * maxRadius;
        return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
      })
      .join(" ");

    return ringPoints;
  });

  const labelPositions = metrics.map((_, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const labelRadius = maxRadius + 34;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return {
      left: `${(x / size) * 100}%`,
      top: `${(y / size) * 100}%`
    };
  });

  return (
    <div className="radar-shell coach-radar-shell">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="coachRadarGradient" x1="0" y1="0" x2="1" y2="1">
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
        <polygon points={polygonPoints} fill="url(#coachRadarGradient)" fillOpacity="0.32" />
        <polygon
          points={polygonPoints}
          fill="none"
          stroke="rgba(23, 70, 255, 0.85)"
          strokeWidth="2"
          className="radar-ring"
        />
        {polygonPoints.split(" ").map((point, index) => {
          const [x, y] = point.split(",");
          return <circle key={`dot-${index}`} cx={x} cy={y} r={3} fill="#1746FF" />;
        })}
      </svg>
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className="absolute text-center"
          style={{
            left: labelPositions[index].left,
            top: labelPositions[index].top,
            transform: "translate(-50%, -50%)"
          }}
        >
          <div className="max-w-[84px] text-[9px] uppercase leading-tight tracking-[0.1em] text-muted sm:max-w-[120px] sm:text-[11px] sm:tracking-[0.18em]">
            {metric.label}
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="font-display text-base font-semibold metric-score sm:text-lg">
              {metric.score}
            </span>
            <span className="text-[11px] text-muted">|</span>
            <span
              className={`text-[12px] sm:text-[13px] numeric-glow ${toneClass(metric.tone)}`}
            >
              {metric.metaLabel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
