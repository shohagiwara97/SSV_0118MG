# Daichi Takamatsu：カテゴリスコア算出例（1/18データ）

- 対象データ: `pwa/public/data/report_latest.json`（2026-01-18）
- 対象選手: Daichi Takamatsu
- スコア範囲: 70〜95

## 計算式

**高いほど良い**

`score = 70 + (value - min) / (max - min) * 25`

**低いほど良い**

`score = 70 + (max - value) / (max - min) * 25`

端数処理: 四捨五入

## 各カテゴリの実数値と計算

| カテゴリ | 指標(metric_id) | 単位 | Daichi値 | チーム最小 | チーム最大 | 方向 | 比率 | スコア |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| スピード | `sprint_max_speed` | km/h | 31.6 | 29.7 | 32.2 | 高いほど良い | 0.7600 | 89 |
| 加速 | `agility_avg_accel` | m/s² | 4.15 | 4.15 | 4.95 | 高いほど良い | 0.0000 | 70 |
| 減速 | `agility_avg_decel` | m/s² | 5.2 | 5.2 | 6 | 高いほど良い | 0.0000 | 70 |
| 再加速 | `agility_avg_reaccel` | m/s² | 3.95 | 3.15 | 4.35 | 高いほど良い | 0.6667 | 87 |
| ジャンプ | `jump_height` | vendor | 0.4153 | 0.316 | 0.4768 | 高いほど良い | 0.6175 | 85 |
| パワー | `peak_propulsive_power` | vendor | 4984.09 | 2951.07 | 4984.09 | 高いほど良い | 1.0000 | 95 |
| 安定性 | `peak_landing_force` | vendor | 6697 | 2621 | 6996 | 高いほど良い | 0.9317 | 93 |
| バランス・左右差 | `lr_peak_braking_force` | vendor | 0.0926 | 0.0926 | 16.523 | 低いほど良い | 1.0000 | 95 |
