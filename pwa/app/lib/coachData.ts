export type CoachFilterControl = {
  id: string;
  label: string;
  helperText?: string;
};

export type CoachPlayerListItem = {
  id: string;
  number: number;
  name: string;
  position: string;
  grade: string;
  term: "上半期" | "下半期";
  growthRate: number;
  fatigueFlag: boolean;
  statusBadge?: "上位" | "急伸" | "要注意";
};

export type CoachPlayerProfile = CoachPlayerListItem & {
  measuredAt: string;
};

export type CoachRadarMetric = {
  id: string;
  label: string;
  score: number;
  metaLabel: string;
  tone?: "up" | "down" | "flat";
};

export type CoachSummaryMetric = {
  id: string;
  label: string;
  score: number;
  delta: number;
};

export type CoachCategory = {
  id: string;
  label: string;
};

type CoachSeedMetric = {
  score: number;
  delta: number;
};

type CoachSeedMetrics = Record<
  | "accel_speed"
  | "change_dir"
  | "decel"
  | "jump"
  | "strength"
  | "balance_lr"
  | "fatigue"
  | "mental",
  CoachSeedMetric
>;

export type CoachPlayerReport = {
  player: CoachPlayerProfile;
  radarMetrics: CoachRadarMetric[];
  summaryMetrics: CoachSummaryMetric[];
};

export const coachFilterControls: CoachFilterControl[] = [
  {
    id: "sort",
    label: "選手",
    helperText: "選手名/学年/ポジション/背番号"
  },
  {
    id: "grade",
    label: "学年",
    helperText: "全学年/高3/高2/高1"
  },
  {
    id: "term",
    label: "半期",
    helperText: "上半期/下半期"
  }
];

const categoryMappings: Array<{
  id: CoachCategory["id"];
  label: CoachCategory["label"];
  sourceId: keyof CoachSeedMetrics;
  scoreOffset?: number;
}> = [
  { id: "speed", label: "スピード", sourceId: "accel_speed", scoreOffset: 2 },
  { id: "accel", label: "加速", sourceId: "accel_speed", scoreOffset: -1 },
  { id: "decel", label: "減速", sourceId: "decel", scoreOffset: 0 },
  { id: "re_accel", label: "再加速", sourceId: "change_dir", scoreOffset: 1 },
  { id: "jump", label: "ジャンプ", sourceId: "jump", scoreOffset: 0 },
  { id: "power", label: "パワー", sourceId: "strength", scoreOffset: 1 },
  { id: "stability", label: "安定性", sourceId: "balance_lr", scoreOffset: 2 },
  { id: "balance_lr", label: "バランス・左右差", sourceId: "balance_lr", scoreOffset: -1 }
];

export const coachCategories: CoachCategory[] = categoryMappings.map(({ id, label }) => ({
  id,
  label
}));

export const coachPlayerList: CoachPlayerProfile[] = [
  {
    id: "player-01",
    number: 1,
    name: "佐々木 守",
    position: "GK",
    grade: "高3",
    term: "下半期",
    growthRate: 4,
    fatigueFlag: false,
    measuredAt: "2026.01.17"
  },
  {
    id: "player-05",
    number: 5,
    name: "佐藤 海斗",
    position: "DF",
    grade: "高2",
    term: "下半期",
    growthRate: 15,
    fatigueFlag: false,
    statusBadge: "急伸",
    measuredAt: "2026.01.18"
  },
  {
    id: "player-10",
    number: 10,
    name: "中村 颯",
    position: "FW",
    grade: "高3",
    term: "上半期",
    growthRate: 5,
    fatigueFlag: false,
    statusBadge: "上位",
    measuredAt: "2026.01.18"
  },
  {
    id: "player-08",
    number: 8,
    name: "高橋 優",
    position: "MF",
    grade: "高2",
    term: "上半期",
    growthRate: 7,
    fatigueFlag: false,
    measuredAt: "2026.01.15"
  },
  {
    id: "player-07",
    number: 7,
    name: "加藤 陽",
    position: "MF",
    grade: "高1",
    term: "上半期",
    growthRate: 7,
    fatigueFlag: false,
    measuredAt: "2026.01.15"
  },
  {
    id: "player-11",
    number: 11,
    name: "山田 凛",
    position: "FW",
    grade: "高2",
    term: "下半期",
    growthRate: 2,
    fatigueFlag: false,
    measuredAt: "2026.01.16"
  },
  {
    id: "player-04",
    number: 4,
    name: "藤井 蓮",
    position: "DF",
    grade: "高3",
    term: "下半期",
    growthRate: 10,
    fatigueFlag: false,
    statusBadge: "急伸",
    measuredAt: "2026.01.14"
  },
  {
    id: "player-09",
    number: 9,
    name: "伊藤 颯太",
    position: "FW",
    grade: "高1",
    term: "下半期",
    growthRate: 3,
    fatigueFlag: false,
    measuredAt: "2026.01.13"
  },
  {
    id: "player-03",
    number: 3,
    name: "石井 湊",
    position: "DF",
    grade: "高2",
    term: "上半期",
    growthRate: -6,
    fatigueFlag: true,
    statusBadge: "要注意",
    measuredAt: "2026.01.12"
  },
  {
    id: "player-06",
    number: 6,
    name: "松本 慧",
    position: "MF",
    grade: "高1",
    term: "上半期",
    growthRate: 0,
    fatigueFlag: false,
    measuredAt: "2026.01.11"
  },
  {
    id: "player-02",
    number: 2,
    name: "岡田 直樹",
    position: "DF",
    grade: "高3",
    term: "上半期",
    growthRate: -1,
    fatigueFlag: true,
    statusBadge: "要注意",
    measuredAt: "2026.01.10"
  }
];

export const coachDefaultPlayerId = "player-05";

const coachPlayerSeedMetricsMap: Record<string, CoachSeedMetrics> = {
  "player-01": {
    accel_speed: { score: 72, delta: 2 },
    change_dir: { score: 68, delta: 1 },
    decel: { score: 70, delta: 3 },
    jump: { score: 74, delta: 4 },
    strength: { score: 78, delta: 5 },
    balance_lr: { score: 62, delta: 2 },
    fatigue: { score: 60, delta: -2 },
    mental: { score: 70, delta: 1 }
  },
  "player-05": {
    accel_speed: { score: 83, delta: 4 },
    change_dir: { score: 95, delta: 22 },
    decel: { score: 72, delta: 6 },
    jump: { score: 65, delta: -3 },
    strength: { score: 70, delta: 0 },
    balance_lr: { score: 58, delta: 3 },
    fatigue: { score: 67, delta: 8 },
    mental: { score: 67, delta: 3 }
  },
  "player-10": {
    accel_speed: { score: 79, delta: 3 },
    change_dir: { score: 88, delta: 10 },
    decel: { score: 74, delta: 4 },
    jump: { score: 69, delta: 2 },
    strength: { score: 73, delta: 1 },
    balance_lr: { score: 60, delta: 1 },
    fatigue: { score: 64, delta: 5 },
    mental: { score: 72, delta: 4 }
  },
  "player-08": {
    accel_speed: { score: 70, delta: 1 },
    change_dir: { score: 76, delta: 4 },
    decel: { score: 80, delta: 6 },
    jump: { score: 62, delta: -2 },
    strength: { score: 75, delta: 3 },
    balance_lr: { score: 66, delta: 2 },
    fatigue: { score: 63, delta: 1 },
    mental: { score: 68, delta: 2 }
  },
  "player-07": {
    accel_speed: { score: 77, delta: 5 },
    change_dir: { score: 82, delta: 6 },
    decel: { score: 71, delta: 3 },
    jump: { score: 68, delta: 4 },
    strength: { score: 69, delta: 2 },
    balance_lr: { score: 57, delta: 0 },
    fatigue: { score: 61, delta: 2 },
    mental: { score: 65, delta: 1 }
  },
  "player-11": {
    accel_speed: { score: 75, delta: 2 },
    change_dir: { score: 80, delta: 5 },
    decel: { score: 69, delta: 2 },
    jump: { score: 66, delta: 1 },
    strength: { score: 68, delta: 2 },
    balance_lr: { score: 55, delta: -1 },
    fatigue: { score: 60, delta: 1 },
    mental: { score: 66, delta: 2 }
  },
  "player-04": {
    accel_speed: { score: 81, delta: 6 },
    change_dir: { score: 86, delta: 8 },
    decel: { score: 78, delta: 7 },
    jump: { score: 63, delta: 2 },
    strength: { score: 77, delta: 5 },
    balance_lr: { score: 64, delta: 4 },
    fatigue: { score: 65, delta: 3 },
    mental: { score: 70, delta: 4 }
  },
  "player-09": {
    accel_speed: { score: 73, delta: 1 },
    change_dir: { score: 79, delta: 3 },
    decel: { score: 68, delta: 2 },
    jump: { score: 64, delta: 1 },
    strength: { score: 66, delta: 0 },
    balance_lr: { score: 56, delta: -1 },
    fatigue: { score: 59, delta: 1 },
    mental: { score: 63, delta: 2 }
  },
  "player-03": {
    accel_speed: { score: 66, delta: -4 },
    change_dir: { score: 70, delta: -3 },
    decel: { score: 64, delta: -2 },
    jump: { score: 60, delta: -4 },
    strength: { score: 62, delta: -2 },
    balance_lr: { score: 52, delta: -3 },
    fatigue: { score: 55, delta: -5 },
    mental: { score: 58, delta: -2 }
  },
  "player-06": {
    accel_speed: { score: 71, delta: 0 },
    change_dir: { score: 74, delta: 1 },
    decel: { score: 73, delta: 2 },
    jump: { score: 61, delta: -1 },
    strength: { score: 72, delta: 1 },
    balance_lr: { score: 59, delta: 0 },
    fatigue: { score: 62, delta: 1 },
    mental: { score: 67, delta: 2 }
  },
  "player-02": {
    accel_speed: { score: 68, delta: -2 },
    change_dir: { score: 72, delta: -1 },
    decel: { score: 66, delta: -2 },
    jump: { score: 59, delta: -3 },
    strength: { score: 64, delta: -1 },
    balance_lr: { score: 53, delta: -2 },
    fatigue: { score: 57, delta: -4 },
    mental: { score: 60, delta: -1 }
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const seedScoreRange = { min: 55, max: 95 };
const displayScoreRange = { min: 70, max: 95 };

const normalizeScore = (value: number) => {
  const ratio =
    seedScoreRange.max === seedScoreRange.min
      ? 0.5
      : (value - seedScoreRange.min) / (seedScoreRange.max - seedScoreRange.min);
  const scaled =
    displayScoreRange.min + ratio * (displayScoreRange.max - displayScoreRange.min);
  return Math.round(clamp(scaled, displayScoreRange.min, displayScoreRange.max));
};

const formatDeltaLabel = (value: number) => {
  if (value > 0) return `▲ +${value}`;
  if (value < 0) return `▼ ${Math.abs(value)}`;
  return "± 0";
};

const deltaTone = (value: number): CoachRadarMetric["tone"] => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
};

const buildRadarMetrics = (playerId: string): CoachRadarMetric[] =>
  categoryMappings.map((category) => {
    const base = coachPlayerSeedMetricsMap[playerId][category.sourceId];
    const adjustedScore = (base.score ?? 0) + (category.scoreOffset ?? 0);
    return {
      id: category.id,
      label: category.label,
      score: normalizeScore(adjustedScore),
      metaLabel: formatDeltaLabel(base.delta),
      tone: deltaTone(base.delta)
    };
  });

const buildSummaryMetrics = (playerId: string): CoachSummaryMetric[] =>
  categoryMappings.map((category) => {
    const base = coachPlayerSeedMetricsMap[playerId][category.sourceId];
    const adjustedScore = (base.score ?? 0) + (category.scoreOffset ?? 0);
    return {
      id: category.id,
      label: category.label,
      score: normalizeScore(adjustedScore),
      delta: base.delta
    };
  });

export const coachPlayerReports = coachPlayerList.reduce(
  (acc, player) => {
    acc[player.id] = {
      player,
      radarMetrics: buildRadarMetrics(player.id),
      summaryMetrics: buildSummaryMetrics(player.id)
    };
    return acc;
  },
  {} as Record<string, CoachPlayerReport>
);
