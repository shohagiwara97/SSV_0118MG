export type ReportCategory = {
  id: string;
  label: string;
  score: number | null;
  rank: number | null;
  vendor: string;
};

export type ReportMetric = {
  id: string;
  label: string;
  previous: string;
  current: string;
  raw?: number | null;
};

export type ReportSection = {
  id: string;
  title: string;
  vendor: string;
  metrics: ReportMetric[];
};

export type ReportPlayerOption = {
  id: string;
  name: string;
  position: string | null;
};

export type ReportData = {
  event: {
    id: string;
    date: string;
  };
  generatedAt: string;
  scoreRange: {
    min: number;
    max: number;
  };
  players: PlayerReport[];
};

type SourceMetric = {
  value: number | null;
  unit: string | null;
  raw?: number | null;
};

type PlayerCategory = {
  id: string;
  label: string;
  score: number | null;
  rank: number | null;
  vendor: string;
};

type PlayerMetric = {
  id: string;
  label: string;
  value: number | null;
  unit: string | null;
  display: string | null;
  raw?: number | null;
};

type PlayerSection = {
  id: string;
  title: string;
  vendor: string;
  metrics: PlayerMetric[];
};

type PlayerReport = {
  id: string;
  name: string;
  number?: number | null;
  grade?: string | null;
  term?: string | null;
  position?: string | null;
  measuredAt?: string | null;
  categories: PlayerCategory[];
  sections: PlayerSection[];
  metrics: Record<string, Record<string, SourceMetric>>;
};

export const reportDataUrl = "/data/report_latest.json";

export const reportMeta = {
  title: "ダッシュボード",
  subtitle: "SSV 1Day Power & Movement Camp"
};

export const highlightVideo = {
  title: "ハイライト動画",
  detail: "試合ハイライト (1:42)"
};

export const getReportEvent = (data?: ReportData | null) =>
  data?.event ?? { id: "", date: "--" };

export const getReportPlayers = (data?: ReportData | null): ReportPlayerOption[] =>
  data?.players.map((player) => ({
    id: player.id,
    name: player.name,
    position: player.position ?? null
  })) ?? [];

export const getDefaultPlayerId = (data?: ReportData | null) =>
  getReportPlayers(data)[0]?.id ?? "";

const getPlayerReport = (data: ReportData | null, playerId?: string) => {
  if (!data || !data.players.length) {
    return null;
  }
  const selected = data.players.find((player) => player.id === playerId);
  return selected ?? data.players[0];
};

const formatMetricValue = (metric: PlayerMetric) => {
  if (metric.display) {
    return metric.display;
  }
  if (metric.value == null) {
    return "--";
  }
  if (metric.unit && metric.unit !== "vendor") {
    return `${metric.value} ${metric.unit}`;
  }
  return `${metric.value}`;
};

export const getReportCategories = (
  data: ReportData | null,
  playerId?: string
): ReportCategory[] =>
  (getPlayerReport(data, playerId)?.categories ?? []).map((category) => ({
    id: category.id,
    label: category.label,
    score: category.score ?? null,
    rank: category.rank ?? null,
    vendor: category.vendor
  }));

export const getDetailSections = (
  data: ReportData | null,
  playerId?: string
): ReportSection[] =>
  (getPlayerReport(data, playerId)?.sections ?? []).map((section) => ({
    id: section.id,
    title: section.title,
    vendor: section.vendor,
    metrics: section.metrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      previous: "--",
      current: formatMetricValue(metric),
      raw: metric.raw ?? null
    }))
  }));
