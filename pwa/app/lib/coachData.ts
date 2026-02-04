import { type ReportData } from "./sampleData";

export type CoachFilterControl = {
  id: string;
  label: string;
  helperText?: string;
};

export type CoachPlayerListItem = {
  id: string;
  number: number | null;
  name: string;
  position: string | null;
  grade: string | null;
  term: string | null;
};

export type CoachPlayerProfile = CoachPlayerListItem & {
  measuredAt: string | null;
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
  score: number | null;
  delta: number;
};

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
    helperText: "通期/上半期/下半期"
  }
];

const buildRadarMetrics = (report?: ReportData["players"][number]) =>
  (report?.categories ?? []).map((category) => ({
    id: category.id,
    label: category.label,
    score: category.score ?? 0,
    metaLabel: "± 0",
    tone: "flat" as const
  }));

const buildSummaryMetrics = (report?: ReportData["players"][number]) =>
  (report?.categories ?? []).map((category) => ({
    id: category.id,
    label: category.label,
    score: category.score ?? null,
    delta: 0
  }));

export const buildCoachPlayerList = (data: ReportData | null): CoachPlayerProfile[] =>
  (data?.players ?? []).map((player) => ({
    id: player.id,
    number: player.number ?? null,
    name: player.name,
    position: player.position ?? null,
    grade: player.grade ?? null,
    term: player.term ?? "通期",
    measuredAt: player.measuredAt ?? null
  }));

export const getCoachDefaultPlayerId = (data: ReportData | null) =>
  buildCoachPlayerList(data)[0]?.id ?? "";

export const buildCoachPlayerReports = (data: ReportData | null) => {
  const reports: Record<string, CoachPlayerReport> = {};
  const list = buildCoachPlayerList(data);
  const reportMap = new Map((data?.players ?? []).map((player) => [player.id, player]));

  list.forEach((player) => {
    const report = reportMap.get(player.id);
    reports[player.id] = {
      player,
      radarMetrics: buildRadarMetrics(report),
      summaryMetrics: buildSummaryMetrics(report)
    };
  });

  return reports;
};
