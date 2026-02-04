"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CoachRadarChart from "../components/CoachRadarChart";
import {
  coachDefaultPlayerId,
  coachPlayerList,
  coachPlayerReports
} from "../lib/coachData";

type CoachSortKey = "name" | "grade" | "position" | "number" | "growthRate" | "fatigueFlag";

type SortDirection = "asc" | "desc";

const sortOptions: { id: CoachSortKey; label: string }[] = [
  { id: "name", label: "選手名" },
  { id: "grade", label: "学年" },
  { id: "position", label: "ポジション" },
  { id: "number", label: "背番号" },
  { id: "growthRate", label: "伸長率" },
  { id: "fatigueFlag", label: "疲労フラグ" }
];

const sortDirections: Record<CoachSortKey, SortDirection> = {
  name: "asc",
  grade: "asc",
  position: "asc",
  number: "asc",
  growthRate: "desc",
  fatigueFlag: "desc"
};

const gradeOptions = [
  { value: "all", label: "全学年" },
  { value: "高3", label: "高3" },
  { value: "高2", label: "高2" },
  { value: "高1", label: "高1" }
];

const termOptions = [
  { value: "all", label: "通期" },
  { value: "上半期", label: "上半期" },
  { value: "下半期", label: "下半期" }
];

const gradeValue = (grade: string) => {
  const match = grade.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const positionOrder: Record<string, number> = {
  GK: 0,
  DF: 1,
  MF: 2,
  FW: 3
};

const comparePlayers = (
  a: (typeof coachPlayerList)[number],
  b: (typeof coachPlayerList)[number],
  key: CoachSortKey
) => {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name, "ja");
    case "grade":
      return gradeValue(a.grade) - gradeValue(b.grade);
    case "position":
      return (positionOrder[a.position] ?? 9) - (positionOrder[b.position] ?? 9);
    case "number":
      return a.number - b.number;
    case "growthRate":
      return a.growthRate - b.growthRate;
    case "fatigueFlag":
      return Number(a.fatigueFlag) - Number(b.fatigueFlag);
    default:
      return 0;
  }
};

const statusBadgeStyles: Record<string, string> = {
  上位: "border-accent/30 text-accent bg-accent/10",
  急伸: "border-success/30 text-success bg-success/10",
  要注意: "border-warning/40 text-warning bg-warning/10"
};

const formatGrowthRate = (value: number) => {
  if (value > 0) return `+${value}%`;
  if (value < 0) return `▼${Math.abs(value)}%`;
  return "0%";
};

const growthRateTone = (value: number) => {
  if (value > 0) return "text-success";
  if (value < 0) return "text-danger";
  return "text-muted";
};

const formatDelta = (value: number) => {
  if (value > 0) return { label: `▲ +${value}`, tone: "text-success" };
  if (value < 0) return { label: `▼ ${Math.abs(value)}`, tone: "text-danger" };
  return { label: "± 0", tone: "text-muted" };
};

export default function CoachPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(coachDefaultPlayerId);
  const [sortKey, setSortKey] = useState<CoachSortKey>("number");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");

  const sortedPlayerList = useMemo(() => {
    const direction = sortDirections[sortKey] === "asc" ? 1 : -1;
    return coachPlayerList
      .filter((player) => {
        const gradeMatches = gradeFilter === "all" || player.grade === gradeFilter;
        const termMatches = termFilter === "all" || player.term === termFilter;
        return gradeMatches && termMatches;
      })
      .sort((a, b) => {
        const primary = comparePlayers(a, b, sortKey);
        if (primary !== 0) {
          return primary * direction;
        }
        return a.number - b.number;
      });
  }, [gradeFilter, sortKey, termFilter]);

  const activePlayerId =
    sortedPlayerList.find((player) => player.id === selectedPlayerId)?.id ??
    sortedPlayerList[0]?.id ??
    coachDefaultPlayerId;

  const selectedReport = useMemo(
    () => coachPlayerReports[activePlayerId] ?? coachPlayerReports[coachDefaultPlayerId],
    [activePlayerId]
  );

  const selectedPlayer = selectedReport.player;

  useEffect(() => {
    if (activePlayerId !== selectedPlayerId) {
      setSelectedPlayerId(activePlayerId);
    }
  }, [activePlayerId, selectedPlayerId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-full border border-accent/30 bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:border-accent hover:bg-accent hover:text-white sm:py-2 sm:text-xs sm:tracking-[0.22em]"
        >
          ← ダッシュボード
        </Link>
        <div className="w-full text-left sm:w-auto sm:text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-muted sm:text-[10px] sm:tracking-[0.4em]">
            Coach View
          </p>
          <h1 className="font-display text-2xl leading-tight tracking-[0.12em] sm:text-3xl">
            監督用ダッシュボード
          </h1>
        </div>
      </header>

      <p className="text-base leading-relaxed text-muted sm:text-sm sm:leading-normal">
        選手の伸長率とKPI差分を一覧し、改善・注意ポイントを素早く把握します。
      </p>

      <section className="neon-card rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-3 md:w-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                ソート
              </span>
              <label className="relative">
                <span className="sr-only">ソート</span>
                <select
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as CoachSortKey)}
                  className="min-w-[120px] appearance-none rounded-2xl border border-line bg-white px-4 py-2 pr-8 text-[13px] text-ink shadow-cardSoft transition hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 sm:text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                  ▾
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                絞り込み
              </span>
              <label className="relative">
                <span className="sr-only">学年</span>
                <select
                  value={gradeFilter}
                  onChange={(event) => setGradeFilter(event.target.value)}
                  className="min-w-[96px] appearance-none rounded-2xl border border-line bg-white px-4 py-2 pr-8 text-[13px] text-ink shadow-cardSoft transition hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 sm:text-sm"
                >
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                  ▾
                </span>
              </label>
              <label className="relative">
                <span className="sr-only">半期</span>
                <select
                  value={termFilter}
                  onChange={(event) => setTermFilter(event.target.value)}
                  className="min-w-[96px] appearance-none rounded-2xl border border-line bg-white px-4 py-2 pr-8 text-[13px] text-ink shadow-cardSoft transition hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 sm:text-sm"
                >
                  {termOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                  ▾
                </span>
              </label>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-line bg-surfaceAlt px-4 py-3 text-xs text-muted md:w-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">選手セレクタ</p>
            <p className="mt-1 text-sm text-ink">
              <span className="text-accent">#{selectedPlayer.number}</span> {selectedPlayer.name}{" "}
              / {selectedPlayer.position}
            </p>
            <p className="text-[11px] text-muted">
              {selectedPlayer.grade}・測定日{" "}
              <span className="text-accent2">{selectedPlayer.measuredAt}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1.05fr] md:gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="hidden grid-cols-[1.4fr_0.7fr_1fr] gap-3 border-b border-line px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-muted sm:grid">
              <span>選手</span>
              <span>ポジション</span>
              <span className="text-right">伸長率</span>
            </div>
            <div className="divide-y divide-line">
              {sortedPlayerList.map((player) => {
                const statusClass = player.statusBadge
                  ? statusBadgeStyles[player.statusBadge]
                  : "";
                const isSelected = player.id === activePlayerId;
                const badge = player.statusBadge ? (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${statusClass}`}
                  >
                    {player.statusBadge}
                  </span>
                ) : player.fatigueFlag ? (
                  <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-warning">
                    要注意
                  </span>
                ) : null;

                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    aria-pressed={isSelected}
                    className={`grid w-full gap-3 px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:grid-cols-[1.4fr_0.7fr_1fr] sm:items-center sm:text-[13px] ${isSelected ? "bg-accent/10" : "hover:bg-surfaceAlt"}`}
                  >
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg text-accent">
                            {player.number}
                          </span>
                          <div>
                            <p className="text-sm text-ink">{player.name}</p>
                            <p className="text-[11px] text-muted">{player.grade}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`font-semibold ${growthRateTone(player.growthRate)}`}>
                            {formatGrowthRate(player.growthRate)}
                          </span>
                          {badge}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        ポジション: {player.position}
                      </p>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                      <span className="font-display text-lg text-accent">{player.number}</span>
                      <div>
                        <p className="text-sm text-ink">{player.name}</p>
                        <p className="text-[11px] text-muted">{player.grade}</p>
                      </div>
                    </div>
                    <span className="hidden text-muted sm:block">{player.position}</span>
                    <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                      <span className={`font-semibold ${growthRateTone(player.growthRate)}`}>
                        {formatGrowthRate(player.growthRate)}
                      </span>
                      {badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-center rounded-2xl border border-line bg-white p-4 sm:p-5">
              <CoachRadarChart metrics={selectedReport.radarMetrics} />
            </div>

            <div className="rounded-2xl border border-line bg-surfaceAlt px-4 py-3">
              <div className="divide-y divide-line">
                {selectedReport.summaryMetrics.map((metric) => {
                  const delta = formatDelta(metric.delta);
                  return (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between gap-4 py-3 text-[13px] sm:text-sm"
                    >
                      <span className="text-muted">{metric.label}</span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-base font-semibold metric-score sm:text-lg">
                          {metric.score}
                        </span>
                        <span className="text-[11px] text-muted">|</span>
                        <span className={`text-[12px] sm:text-[13px] numeric-glow ${delta.tone}`}>
                          {delta.label}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
