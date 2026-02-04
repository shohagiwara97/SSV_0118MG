import Link from "next/link";
import RadarChart from "./components/RadarChart";
import { highlightVideo, reportCategories, reportMeta } from "./lib/sampleData";

export default function Home() {
  const brandLogos = [
    { label: "Photon Sports", src: "/icons/photon.svg" },
    { label: "Hawkin Dynamics", src: "/icons/hawkin.svg" },
    { label: "NTT Sportict", src: "/icons/ntt-sportict.svg" },
    { label: "Upmind", src: "/icons/upmind.svg" }
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <header className="flex flex-col items-start gap-3 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center justify-start gap-3">
          <div className="logo-ring">
            <span className="text-[10px] font-semibold text-white sm:text-xs">SSV</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[10px] sm:tracking-[0.38em]">
              PlayerData
            </p>
            <h1 className="font-display text-xl leading-tight tracking-[0.06em] sm:text-3xl sm:tracking-[0.12em]">
              {reportMeta.title}
            </h1>
          </div>
        </div>
        <div className="w-full text-left text-xs text-muted sm:w-auto sm:text-xs">
          <p>{reportMeta.subtitle}</p>
          <p>Event v0.1</p>
        </div>
      </header>

      <section className="grid gap-5 sm:gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="neon-card rounded-2xl p-4 sm:rounded-3xl sm:p-6">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-left">
            <p className="text-xs text-muted sm:text-sm">KPI Overview</p>
            <Link
              href="/detail"
              className="rounded-full border border-accent/30 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent transition hover:border-accent hover:bg-accent hover:text-white sm:px-4 sm:py-1 sm:text-xs sm:tracking-[0.24em]"
            >
              レポート詳細
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center pb-24 sm:mt-4 sm:pb-20 lg:mt-20 lg:pb-24">
            <Link href="/detail" aria-label="レポート詳細へ" className="block">
              <RadarChart categories={reportCategories} />
            </Link>
          </div>
          <div className="neon-divider mt-5 sm:mt-6" />
          <div className="mt-3 flex flex-col items-center gap-2 text-center text-[11px] text-muted sm:mt-4 sm:flex-row sm:justify-between sm:text-left sm:text-[11px]">
            <span>測定機器: Photon / Hawkin</span>
            <span>更新: 2026.01.18</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="neon-card rounded-2xl p-4 sm:rounded-3xl sm:p-6">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-xs text-muted sm:text-sm">Score Snapshot</p>
              <span className="label-chip text-accent">Today</span>
            </div>
            <div className="summary-grid mt-4">
              {reportCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-line bg-surfaceAlt p-2 sm:p-3"
                >
                  <p className="text-xs text-muted sm:text-[11px]">{category.label}</p>
                  <p className="font-display text-lg text-accent numeric-glow sm:text-xl">
                    {category.score}
                  </p>
                  <p className="text-xs text-muted sm:text-[10px]">
                    {category.rank ? `${category.rank}位` : "--"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="neon-card rounded-2xl p-4 sm:rounded-3xl sm:p-6">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-xs text-muted sm:text-sm">{highlightVideo.title}</p>
              <span className="text-xs text-muted sm:text-[11px]">{highlightVideo.detail}</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#d1daff] via-white to-[#eef4ff]">
              <div className="relative aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-white/80 text-accent shadow-cardSoft">
                    <span className="text-2xl">▶</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(23,70,255,0.25),_transparent_60%)]" />
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted sm:text-[11px]">
              タップでプレイヤーを起動（モック）
            </p>
          </div>
        </div>
      </section>

      <footer className="rounded-2xl border border-line bg-white px-3 py-2 shadow-cardSoft sm:px-4 sm:py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between sm:gap-6">
          {brandLogos.map((brand) => (
            <img
              key={brand.label}
              src={brand.src}
              alt={brand.label}
              className="brand-logo opacity-80"
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
