"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CoachRadarChart from "../components/CoachRadarChart";
import { reportDataUrl, type ReportData } from "../lib/sampleData";
import {
  buildCoachPlayerList,
  buildCoachPlayerReports,
  getCoachDefaultPlayerId
} from "../lib/coachData";

type CoachSortKey = "name" | "grade" | "position" | "number";

type SortDirection = "asc" | "desc";

const sortOptions: { id: CoachSortKey; label: string }[] = [
  { id: "name", label: "選手名" },
  { id: "grade", label: "学年" },
  { id: "position", label: "ポジション" },
  { id: "number", label: "背番号" }
];

const sortDirections: Record<CoachSortKey, SortDirection> = {
  name: "asc",
  grade: "asc",
  position: "asc",
  number: "asc"
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

const gradeValue = (grade: string | null) => {
  if (!grade) return Number.MAX_SAFE_INTEGER;
  const match = grade.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const positionOrder: Record<string, number> = {
  GK: 0,
  DF: 1,
  MF: 2,
  FW: 3
};

const comparePlayers = (
  a: ReturnType<typeof buildCoachPlayerList>[number],
  b: ReturnType<typeof buildCoachPlayerList>[number],
  key: CoachSortKey
) => {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name, "ja");
    case "grade":
      return gradeValue(a.grade) - gradeValue(b.grade);
    case "position":
      return (positionOrder[a.position ?? ""] ?? 9) - (positionOrder[b.position ?? ""] ?? 9);
    case "number":
      return (a.number ?? Number.MAX_SAFE_INTEGER) - (b.number ?? Number.MAX_SAFE_INTEGER);
    default:
      return 0;
  }
};

const formatDelta = (value: number) => {
  if (value > 0) return { label: `▲ +${value}`, tone: "text-success" };
  if (value < 0) return { label: `▼ ${Math.abs(value)}`, tone: "text-danger" };
  return { label: "± 0", tone: "text-muted" };
};

export default function CoachPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [sortKey, setSortKey] = useState<CoachSortKey>("number");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");

  const coachPlayerList = useMemo(
    () => buildCoachPlayerList(reportData),
    [reportData]
  );
  const coachPlayerReports = useMemo(
    () => buildCoachPlayerReports(reportData),
    [reportData]
  );
  const coachDefaultPlayerId = useMemo(
    () => getCoachDefaultPlayerId(reportData),
    [reportData]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(reportDataUrl);
        if (!response.ok) {
          throw new Error(`Failed to load report data: ${response.status}`);
        }
        const data = (await response.json()) as ReportData;
        setReportData(data);
        setSelectedPlayerId((current) => current || getCoachDefaultPlayerId(data));
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const sortedPlayerList = useMemo(() => {
    const direction = sortDirections[sortKey] === "asc" ? 1 : -1;
    const hasGradeData = coachPlayerList.some((player) => !!player.grade);
    const hasTermData = coachPlayerList.some((player) => !!player.term);
    return coachPlayerList
      .filter((player) => {
        const gradeMatches =
          gradeFilter === "all" ||
          (!hasGradeData ? true : (player.grade ?? "--") === gradeFilter);
        const termMatches =
          termFilter === "all" ||
          (!hasTermData ? true : (player.term ?? "通期") === termFilter);
        return gradeMatches && termMatches;
      })
      .sort((a, b) => {
        const primary = comparePlayers(a, b, sortKey);
        if (primary !== 0) {
          return primary * direction;
        }
        return (a.number ?? Number.MAX_SAFE_INTEGER) - (b.number ?? Number.MAX_SAFE_INTEGER);
      });
  }, [gradeFilter, sortKey, termFilter]);

  const activePlayerId =
    sortedPlayerList.find((player) => player.id === selectedPlayerId)?.id ??
    sortedPlayerList[0]?.id ??
    coachDefaultPlayerId;

  const fallbackReport = useMemo(
    () => ({
      player: {
        id: "",
        number: null,
        name: "--",
        position: "--",
        grade: "--",
        term: "通期",
        measuredAt: null
      },
      radarMetrics: [],
      summaryMetrics: []
    }),
    []
  );

  const selectedReport = useMemo(
    () => coachPlayerReports[activePlayerId] ?? coachPlayerReports[coachDefaultPlayerId] ?? fallbackReport,
    [activePlayerId, coachDefaultPlayerId, coachPlayerReports, fallbackReport]
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
        選手のKPI差分を一覧し、改善ポイントを素早く把握します。
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
              <span className="text-accent">
                #{selectedPlayer.number ?? "--"}
              </span>{" "}
              {selectedPlayer.name} / {selectedPlayer.position ?? "--"}
            </p>
            <p className="text-[11px] text-muted">
              {selectedPlayer.grade ?? "--"}・測定日{" "}
              <span className="text-accent2">{selectedPlayer.measuredAt ?? "--"}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1.05fr] md:gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="hidden grid-cols-[1.4fr_0.7fr] gap-3 border-b border-line px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-muted sm:grid">
              <span>選手</span>
              <span>ポジション</span>
            </div>
            <div className="divide-y divide-line">
              {sortedPlayerList.map((player) => {
                const isSelected = player.id === activePlayerId;

                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    aria-pressed={isSelected}
                    className={`grid w-full gap-3 px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:grid-cols-[1.4fr_0.7fr] sm:items-center sm:text-[13px] ${isSelected ? "bg-accent/10" : "hover:bg-surfaceAlt"}`}
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
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-center rounded-2xl border border-line bg-white p-4 sm:p-5">
              {selectedReport.radarMetrics.length ? (
                <CoachRadarChart metrics={selectedReport.radarMetrics} />
              ) : (
                <div className="py-10 text-sm text-muted">データなし</div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-surfaceAlt px-4 py-3">
              <div className="divide-y divide-line">
                {selectedReport.summaryMetrics.length ? (
                  selectedReport.summaryMetrics.map((metric) => {
                  const delta = formatDelta(metric.delta);
                  return (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between gap-4 py-3 text-[13px] sm:text-sm"
                    >
                      <span className="text-muted">{metric.label}</span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-base font-semibold metric-score sm:text-lg">
                          {metric.score ?? "--"}
                        </span>
                        <span className="text-[11px] text-muted">|</span>
                        <span className={`text-[12px] sm:text-[13px] numeric-glow ${delta.tone}`}>
                          {delta.label}
                        </span>
                      </span>
                    </div>
                  );
                })
                ) : (
                  <div className="py-6 text-center text-sm text-muted">データなし</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
