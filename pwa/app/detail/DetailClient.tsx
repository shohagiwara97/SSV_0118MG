"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getDefaultPlayerId,
  getDetailSections,
  reportDataUrl,
  type ReportData
} from "../lib/sampleData";
import { metricDetailsMap } from "../lib/metricDetails";

export default function DetailClient() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player") ?? "";
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [activeMetric, setActiveMetric] = useState<{ id: string; label: string } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(reportDataUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load report data: ${response.status}`);
        }
        const data = (await response.json()) as ReportData;
        setReportData(data);
        const validIds = new Set(data.players.map((player) => player.id));
        const resolvedId = validIds.has(playerParam)
          ? playerParam
          : getDefaultPlayerId(data);
        setSelectedPlayerId((current) => current || resolvedId);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [playerParam]);

  const detailSections = useMemo(
    () => getDetailSections(reportData, selectedPlayerId),
    [reportData, selectedPlayerId]
  );
  const vendorIcons: Record<string, { src: string; alt: string }> = {
    PHOTON: { src: "/icons/photon.svg", alt: "Photon Sports" },
    HAWKIN: { src: "/icons/hawkin.svg", alt: "Hawkin Dynamics" }
  };

  const openMetric = (metric: { id: string; label: string }) => {
    setActiveMetric({ id: metric.id, label: metric.label });
  };

  const closeMetric = () => setActiveMetric(null);

  const evaluationLabels: Record<string, string> = {
    positive: "正の値がプラス評価（値が大きいほど良い）",
    negative: "正の値がマイナス評価（値が小さいほど良い）",
    absolute: "絶対値で評価（符号は評価に使わない）",
    reference: "評価方向を固定しない（参考値）"
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMetric();
      }
    };
    if (activeMetric) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [activeMetric]);

  const getBalanceSideIndicator = (metric: { id: string; raw?: number | null }) => {
    if (!metric.id.startsWith("lr_")) {
      return null;
    }
    if (metric.raw == null) {
      return { label: "左右差不明", className: "text-muted" };
    }
    if (metric.raw > 0) {
      return { label: "左が優位", className: "text-accent" };
    }
    if (metric.raw < 0) {
      return { label: "右が優位", className: "text-danger" };
    }
    return { label: "同等", className: "text-muted" };
  };

  const renderMetrics = (metrics: typeof detailSections[number]["metrics"]) => (
    <div className="mt-3 space-y-3">
      {metrics.map((metric) => {
        const sideIndicator = getBalanceSideIndicator(metric);
        return (
          <button
            key={metric.label}
            type="button"
            onClick={() => openMetric(metric)}
            className="grid w-full gap-3 rounded-2xl border border-line bg-surfaceAlt px-4 py-3 text-left text-base transition hover:border-accent/40 hover:bg-white sm:grid-cols-[1fr_0.7fr_0.7fr] sm:text-sm"
          >
            <div className="flex flex-col">
              <span className="font-medium text-accent">{metric.label}</span>
              {sideIndicator && (
                <span className={`mt-1 text-[11px] ${sideIndicator.className}`}>
                  {sideIndicator.label}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <span className="flex flex-col gap-1 text-muted sm:block">
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted sm:hidden">
                  前回
                </span>
                {metric.previous}
              </span>
              <span className="flex flex-col gap-1 text-accent sm:block">
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted sm:hidden">
                  今回
                </span>
                {metric.current}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderAgilityGroups = (metrics: typeof detailSections[number]["metrics"]) => {
    const metricsById = new Map(metrics.map((metric) => [metric.id, metric]));
    const groupDefs = [
      {
        id: "accel",
        label: "加速",
        metricIds: ["agility_avg_accel", "agility_5_0_time", "agility_max_speed"]
      },
      {
        id: "decel",
        label: "減速",
        metricIds: ["agility_avg_decel"]
      },
      {
        id: "re_accel",
        label: "再加速",
        metricIds: ["agility_avg_reaccel", "agility_0_5_time"]
      }
    ];

    return (
      <div className="mt-3 space-y-4">
        {groupDefs.map((group) => {
          const groupMetrics = group.metricIds
            .map((id) => metricsById.get(id))
            .filter(
              (metric): metric is typeof metrics[number] => metric !== undefined
            );
          if (!groupMetrics.length) {
            return null;
          }
          return (
            <div key={group.id} className="rounded-2xl border border-line bg-white/70 p-3">
              <div className="flex items-center gap-2">
                <span className="label-chip text-[10px] uppercase tracking-[0.14em] text-accent">
                  {group.label}
                </span>
                <span className="text-[11px] text-muted">アジリティ</span>
              </div>
              {renderMetrics(groupMetrics)}
            </div>
          );
        })}
      </div>
    );
  };

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
            Report Detail
          </p>
          <h1 className="font-display text-2xl leading-tight tracking-[0.12em] sm:text-3xl">
            レポート詳細
          </h1>
        </div>
      </header>

      <p className="text-base leading-relaxed text-muted sm:text-sm sm:leading-normal">
        前回 / 今回の比較で、弱点と改善ポイントを可視化します。
      </p>

      <div className="space-y-4">
        {detailSections.length ? (
          detailSections.map((section, index) => (
            <details
              key={section.id}
              open
              className="neon-card rounded-3xl p-5 motion-safe:animate-reveal sm:p-6"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <summary className="grid grid-cols-[1fr_auto] items-center gap-3 text-accent sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                <span className="inline-flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className="font-display text-base font-semibold sm:text-xl"
                    style={{ color: "#1746FF" }}
                  >
                    {section.title}
                  </span>
                  {vendorIcons[section.vendor] && (
                    <span className="label-chip flex items-center justify-center">
                      <img
                        src={vendorIcons[section.vendor].src}
                        alt={vendorIcons[section.vendor].alt}
                        className="h-4 w-auto max-w-[90px] opacity-90 sm:h-6 sm:max-w-[110px]"
                      />
                    </span>
                  )}
                </span>
                <span className="justify-self-end whitespace-nowrap text-xs text-muted sm:ml-auto sm:text-[11px]">
                  タップで折りたたみ
                </span>
              </summary>

              <div className="mt-4 hidden grid-cols-[1fr_0.7fr_0.7fr] text-xs uppercase tracking-[0.2em] text-accent sm:grid sm:text-[11px] sm:tracking-[0.28em]">
                <span>項目</span>
                <span>前回</span>
                <span>今回</span>
              </div>
              {section.id === "agility_505"
                ? renderAgilityGroups(section.metrics)
                : renderMetrics(section.metrics)}
            </details>
          ))
        ) : (
          <div className="rounded-3xl border border-line bg-white/70 px-4 py-6 text-center text-sm text-muted">
            データがありません。
          </div>
        )}
      </div>
      {activeMetric && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeMetric.label}の詳細`}
          onClick={closeMetric}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Metric</p>
                <h2 className="mt-1 font-display text-xl text-accent">
                  {metricDetailsMap[activeMetric.id]?.label ?? activeMetric.label}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-accent/40 hover:text-accent"
                onClick={closeMetric}
              >
                閉じる
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-ink">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">説明</p>
                <p className="mt-2 leading-relaxed">
                  {metricDetailsMap[activeMetric.id]?.description ??
                    "説明が未設定です。"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">指標の評価方法</p>
                <p className="mt-2 leading-relaxed">
                  {metricDetailsMap[activeMetric.id]?.evaluation
                    ? evaluationLabels[metricDetailsMap[activeMetric.id]?.evaluation]
                    : "評価方法が未設定です。"}
                </p>
                <p className="mt-2 leading-relaxed text-muted">
                  {metricDetailsMap[activeMetric.id]?.logic ?? "算出方法が未設定です。"}
                </p>
                {metricDetailsMap[activeMetric.id]?.note && (
                  <p className="mt-2 text-xs text-muted">
                    {metricDetailsMap[activeMetric.id]?.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
