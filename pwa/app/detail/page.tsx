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

export default function DetailPage() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player") ?? "";
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(reportDataUrl);
        if (!response.ok) {
          throw new Error(`Failed to load report data: ${response.status}`);
        }
        const data = (await response.json()) as ReportData;
        setReportData(data);
        setSelectedPlayerId((current) => current || playerParam || getDefaultPlayerId(data));
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
        {detailSections.map((section, index) => (
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
            <div className="mt-3 space-y-3">
              {section.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="grid gap-3 rounded-2xl border border-line bg-surfaceAlt px-4 py-3 text-base sm:grid-cols-[1fr_0.7fr_0.7fr] sm:text-sm"
                >
                  <span className="font-medium text-accent">{metric.label}</span>
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
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
