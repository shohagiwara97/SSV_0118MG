export type ReportCategory = {
  id: string;
  label: string;
  score: number;
  rank: number | null;
  vendor: string;
};

export type ReportMetric = {
  label: string;
  previous: string;
  current: string;
};

export type ReportSection = {
  id: string;
  title: string;
  vendor: string;
  metrics: ReportMetric[];
};

export const reportCategories: ReportCategory[] = [
  { id: "accel_speed", label: "加速・スピード", score: 83, rank: 2, vendor: "Photon" },
  { id: "change_dir", label: "方向転換", score: 91, rank: 3, vendor: "Photon" },
  { id: "decel", label: "減速", score: 90, rank: 1, vendor: "Photon" },
  { id: "jump", label: "ジャンプ", score: 77, rank: 3, vendor: "Hawkin" },
  { id: "strength", label: "ストレングス", score: 84, rank: 2, vendor: "Hawkin" },
  { id: "balance_lr", label: "バランス・左右差", score: 74, rank: 4, vendor: "Photon" },
  { id: "fatigue", label: "疲労度", score: 91, rank: 3, vendor: "Hawkin" },
  { id: "mental", label: "メンタル", score: 74, rank: 3, vendor: "Upmind" }
];

export const detailSections: ReportSection[] = [
  {
    id: "accel_speed",
    title: "加速とスピード",
    vendor: "PHOTON",
    metrics: [
      { label: "5m", previous: "1.12 s", current: "1.05 s" },
      { label: "10m", previous: "1.89 s", current: "1.78 s" },
      { label: "20m", previous: "3.12 s", current: "2.98 s" },
      { label: "30m", previous: "4.35 s", current: "4.12 s" },
      { label: "Forced Velocity", previous: "28.4 km/h", current: "30.1 km/h" },
      { label: "最大速度", previous: "31.2 km/h", current: "33.0 km/h" }
    ]
  },
  {
    id: "change_dir",
    title: "方向転換",
    vendor: "PHOTON",
    metrics: [
      { label: "5-10-5", previous: "4.62 s", current: "4.41 s" },
      { label: "T-test", previous: "9.88 s", current: "9.52 s" },
      { label: "Curved Sprint", previous: "6.21 s", current: "5.94 s" },
      { label: "Cut 45°", previous: "2.41 s", current: "2.28 s" },
      { label: "Cut 75°", previous: "2.68 s", current: "2.51 s" }
    ]
  },
  {
    id: "decel",
    title: "減速",
    vendor: "PHOTON",
    metrics: [
      { label: "ADA減速距離", previous: "3.8 m", current: "3.1 m" },
      { label: "5-0-5", previous: "2.41 s", current: "2.26 s" }
    ]
  },
  {
    id: "jump",
    title: "ジャンプ",
    vendor: "HAWKIN",
    metrics: [
      { label: "CMJ", previous: "38.2 cm", current: "42.6 cm" },
      { label: "スクワットジャンプ", previous: "34.1 cm", current: "37.8 cm" },
      { label: "片脚ジャンプ (R/L)", previous: "31.2 / 28.4 cm", current: "33.5 / 32.9 cm" }
    ]
  },
  {
    id: "strength",
    title: "ストレングス",
    vendor: "HAWKIN",
    metrics: [
      { label: "ジャンプ力", previous: "42.1 N/kg", current: "47.8 N/kg" },
      { label: "RFD", previous: "6,200 N/s", current: "7,450 N/s" },
      { label: "加速ポテンシャル", previous: "0.82", current: "0.91" }
    ]
  },
  {
    id: "balance_lr",
    title: "バランス・左右差",
    vendor: "HAWKIN",
    metrics: [
      { label: "左右差", previous: "12.4 %", current: "5.8 %" },
      { label: "片脚ジャンプ差", previous: "9.1 %", current: "3.2 %" },
      { label: "着地安定性指数", previous: "68", current: "82" }
    ]
  },
  {
    id: "fatigue",
    title: "疲労度",
    vendor: "HAWKIN",
    metrics: [
      { label: "CMJ 低下率", previous: "-9.2 %", current: "-3.1 %" },
      { label: "RFD 低下率", previous: "-11.4 %", current: "-4.6 %" },
      { label: "着地衝撃増加", previous: "+14.2 %", current: "+5.3 %" }
    ]
  },
  {
    id: "mental",
    title: "メンタル",
    vendor: "UPMIND",
    metrics: [
      { label: "集中度", previous: "62", current: "78" },
      { label: "HRV", previous: "48 ms", current: "61 ms" },
      { label: "睡眠スコア", previous: "71", current: "84" }
    ]
  }
];

export const highlightVideo = {
  title: "ハイライト動画",
  detail: "試合ハイライト (1:42)"
};

export const reportMeta = {
  title: "ダッシュボード",
  subtitle: "SSV 1Day Power & Movement Camp"
};
