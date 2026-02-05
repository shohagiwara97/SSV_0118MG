export type MetricDetail = {
  id: string;
  label: string;
  description: string;
  logic: string;
  evaluation:
    | "positive"
    | "negative"
    | "absolute"
    | "reference";
  note?: string;
};

export const metricDetailsMap: Record<string, MetricDetail> = {
  sprint_total_time: {
    id: "sprint_total_time",
    label: "総合タイム",
    description: "テスト全体の合計タイム（30m等の総合指標）",
    logic: "Photon Sprint CSV の `Total time (s)` を使用（選手の最新1件）。",
    evaluation: "negative"
  },
  sprint_split_5m: {
    id: "sprint_split_5m",
    label: "5m 到達タイム",
    description: "5m到達までの累積タイム（加速局面の分解評価に使用）",
    logic: "Photon Sprint CSV の `Split time 5 m (s)` を使用（最新1件）。",
    evaluation: "negative"
  },
  sprint_split_10m: {
    id: "sprint_split_10m",
    label: "10m 到達タイム",
    description: "10m到達までの累積タイム（加速局面の分解評価に使用）",
    logic: "Photon Sprint CSV の `Split time 10 m (s)` を使用（最新1件）。",
    evaluation: "negative"
  },
  sprint_split_15m: {
    id: "sprint_split_15m",
    label: "15m 到達タイム",
    description: "15m到達までの累積タイム（加速局面の分解評価に使用）",
    logic: "Photon Sprint CSV の `Split time 15 m (s)` を使用（最新1件）。",
    evaluation: "negative"
  },
  sprint_split_20m: {
    id: "sprint_split_20m",
    label: "20m 到達タイム",
    description: "20m到達までの累積タイム（加速局面の分解評価に使用）",
    logic: "Photon Sprint CSV の `Split time 20 m (s)` を使用（最新1件）。",
    evaluation: "negative"
  },
  sprint_max_speed: {
    id: "sprint_max_speed",
    label: "最大速度",
    description: "最大速度（トップスピード到達能力の指標）",
    logic: "Photon Sprint CSV の `Max speed (km/h)` を使用（最新1件）。",
    evaluation: "positive"
  },
  sprint_accel: {
    id: "sprint_accel",
    label: "加速度",
    description: "加速度指標（Photon算出。加速能力の比較に使用）",
    logic: "Photon Sprint CSV の `Acceleration (m/s²)` を使用（最新1件）。",
    evaluation: "positive"
  },
  agility_max_speed: {
    id: "agility_max_speed",
    label: "最大速度",
    description: "最大速度（トップスピード到達能力の指標）",
    logic: "Photon 5-0-5 CSV の `Max speed (km/h)` を左右平均。",
    evaluation: "positive"
  },
  agility_avg_accel: {
    id: "agility_avg_accel",
    label: "平均加速度",
    description: "平均加速度（進入/再加速の能力）",
    logic: "Photon 5-0-5 CSV の `Average acceleration (m/s²)` を左右平均。",
    evaluation: "positive"
  },
  agility_avg_decel: {
    id: "agility_avg_decel",
    label: "平均減速度",
    description: "平均減速度（ブレーキ能力）",
    logic: "Photon 5-0-5 CSV の `Average deceleration (m/s²)` を左右平均。",
    evaluation: "positive"
  },
  agility_avg_reaccel: {
    id: "agility_avg_reaccel",
    label: "平均再加速度",
    description: "平均再加速度（切り返し後の立ち上がり）",
    logic: "Photon 5-0-5 CSV の `Average re-acceleration (m/s²)` を左右平均。",
    evaluation: "positive"
  },
  agility_5_0_time: {
    id: "agility_5_0_time",
    label: "進入5mタイム",
    description: "進入5mのタイム（ターン前）",
    logic: "Photon 5-0-5 CSV の `5-0 time (s)` を左右平均。",
    evaluation: "negative"
  },
  agility_0_5_time: {
    id: "agility_0_5_time",
    label: "再加速5mタイム",
    description: "切り返し後5mのタイム（再加速局面）",
    logic: "Photon 5-0-5 CSV の `0-5 time (s)` を左右平均。",
    evaluation: "negative"
  },
  jump_height: {
    id: "jump_height",
    label: "跳躍高",
    description: "垂直方向の跳躍能力（パワー/バネの総合結果）",
    logic: "Hawkin CMJ CSV の `Jump Height` を使用（最新1件）。",
    evaluation: "positive"
  },
  jump_momentum: {
    id: "jump_momentum",
    label: "ジャンプモメンタム",
    description: "体重を含めた出力（空中戦/コンタクトでの強さの示唆）",
    logic: "Hawkin CMJ CSV の `Jump Momentum` を使用（最新1件）。",
    evaluation: "positive"
  },
  countermovement_depth: {
    id: "countermovement_depth",
    label: "沈み込み量",
    description: "沈み込み量（SSCの使い方・動作戦略の違い）",
    logic: "Hawkin CMJ CSV の `Countermovement Depth` を使用（最新1件）。",
    evaluation: "reference"
  },
  flight_time: {
    id: "flight_time",
    label: "滞空時間",
    description: "滞空時間（ジャンプ高と強く関連）",
    logic: "Hawkin CMJ CSV の `Flight Time` を使用（最新1件）。",
    evaluation: "positive"
  },
  time_to_takeoff: {
    id: "time_to_takeoff",
    label: "離地時間",
    description: "離地までの素早さ（キレ/動作スピード）",
    logic: "Hawkin CMJ CSV の `Time To Takeoff` を使用（最新1件）。",
    evaluation: "reference"
  },
  peak_propulsive_power: {
    id: "peak_propulsive_power",
    label: "推進最大パワー",
    description: "推進局面の最大パワー",
    logic: "Hawkin CMJ CSV の `Peak Propulsive Power` を使用（最新1件）。",
    evaluation: "positive"
  },
  peak_relative_propulsive_power: {
    id: "peak_relative_propulsive_power",
    label: "推進最大パワー (体重比)",
    description: "推進局面の最大パワー（体重比）",
    logic: "Hawkin CMJ CSV の `Peak Relative Propulsive Power` を使用（最新1件）。",
    evaluation: "positive"
  },
  peak_braking_power: {
    id: "peak_braking_power",
    label: "制動最大パワー",
    description: "制動局面の最大パワー（強いブレーキと切り返し）",
    logic: "Hawkin CMJ CSV の `Peak Braking Power` を使用（最新1件）。",
    evaluation: "absolute",
    note: "制動系の値は負値になる場合があります。"
  },
  peak_relative_braking_power: {
    id: "peak_relative_braking_power",
    label: "制動最大パワー (体重比)",
    description: "制動局面の最大パワー（体重比）",
    logic: "Hawkin CMJ CSV の `Peak Relative Braking Power` を使用（最新1件）。",
    evaluation: "absolute",
    note: "制動系の値は負値になる場合があります。"
  },
  peak_landing_force: {
    id: "peak_landing_force",
    label: "着地最大力",
    description: "安定性（力を足首にかけれているか）",
    logic: "Hawkin CMJ CSV の `Peak Landing Force` を使用（最新1件）。",
    evaluation: "positive"
  },
  relative_peak_landing_force: {
    id: "relative_peak_landing_force",
    label: "着地最大力 (体重比)",
    description: "安定性（力を足首にかけれているか）（体重比）",
    logic: "Hawkin CMJ CSV の `Relative Peak Landing Force` を使用（最新1件）。",
    evaluation: "positive"
  },
  lr_peak_braking_force: {
    id: "lr_peak_braking_force",
    label: "左右差: 制動最大力",
    description: "左右の制動最大力の差（左右差/弱い側の特定）",
    logic: "Hawkin CMJ CSV の `L|R Peak Braking Force` を絶対値化して使用。",
    evaluation: "negative"
  },
  lr_peak_propulsive_force: {
    id: "lr_peak_propulsive_force",
    label: "左右差: 推進最大力",
    description: "左右の推進最大力の差（左右差/弱い側の特定）",
    logic: "Hawkin CMJ CSV の `L|R Peak Propulsive Force` を絶対値化して使用。",
    evaluation: "negative"
  },
  lr_peak_landing_force: {
    id: "lr_peak_landing_force",
    label: "左右差: 着地最大力",
    description: "左右の着地衝撃ピーク差（左右差/弱い側の特定）",
    logic: "Hawkin CMJ CSV の `L|R Peak Landing Force` を絶対値化して使用。",
    evaluation: "negative"
  }
};
