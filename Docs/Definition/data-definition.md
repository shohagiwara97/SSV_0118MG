# データ定義書（SSV 1Day PWA）

- 作成日: 2026-01-11
- 版数: v0.1
- 参照: Docs/ScreenImage/ScreenImage.png, Docs/ScreenImage/CoachData.png

---

## 1. 対象スコープ
- 画面定義書で定義した SCR-01（レポート概略）/ SCR-02（レポート詳細）/ SCR-03（監督用ダッシュボード）で必要となるデータ項目
- MVP第一弾は **CSV/JSONインポート → 画面表示** を最優先

---

## 2. データソース
- Photon Sports（加速/方向転換/減速/ジャンプ/左右差）
- Hawkin Dynamics（ジャンプ/ストレングス/疲労度）
- NTT Sportict（映像分析）※SCR-02では非表示（将来拡張）
- PlayerData（試合の走行・GPS系指標）
- Upmind（メンタル系）
- 参加者プロフィール（運営入力/事前登録）

---

## 3. 共通データモデル（MVP）

### 3.1 Report
- report_id: string
- event_id: string
- participant_id: string
- generated_at: datetime
- period_current: date | datetime
- period_previous: date | datetime | null

### 3.2 Participant
- participant_id: string
- name: string
- team: string | null
- position: string | null
- grade: string | null

### 3.3 MetricValue
- metric_id: string
- category_id: string
- value_current: number | string
- value_previous: number | string | null
- unit: string | null
- vendor: string
- measured_at: datetime | null
- source_file_id: string | null

### 3.4 CategoryScore（SCR-01 レーダー用）
- category_id: string
- score: number (0-100)
- rank: number | null
- vendor: string

### 3.5 HighlightVideo
- video_id: string
- participant_id: string
- thumbnail_url: string
- playback_url: string

### 3.6 CoachFilterState（SCR-03）
- sort_key: string（name/grade/position/number/growthRate/fatigueFlag）
- grade_filter: string | null（all/高3/高2/高1）
- term_filter: string | null（all=通期/上半期/下半期）

### 3.7 CoachPlayerListItem（SCR-03）
- id: string
- number: number
- name: string
- position: string
- grade: string | null
- term: string | null（上半期/下半期）
- growthRate: number
- fatigueFlag: boolean
- statusBadge: string | null（上位/急伸/要注意）
- measuredAt: datetime | null

### 3.8 CoachRadarMetric（SCR-03）
- id: string（accel_speed/change_dir/decel/jump/strength/balance_lr/fatigue/mental）
- label: string
- score: number
- metaLabel: string（例: ▲ +4 / ▼ 3 / ± 0）
- tone: string | null（up/down/flat）

### 3.9 CoachSummaryMetric（SCR-03）
- id: string
- label: string
- score: number
- delta: number | null

---

## 4. KPIカテゴリ定義（SCR-01）

| category_id | 表示名 | ベンダー想定 | 備考 |
| --- | --- | --- | --- |
| accel_speed | 加速・スピード | Photon | 5m/10m/20m/30m/Forced Velocity/最大速度 からスコア化 |
| change_dir | 方向転換 | Photon | 5-10-5/T-test/Curved Sprint/Cut 45°/Cut 75° からスコア化 |
| decel | 減速 | Photon | ADA/5-0-5 からスコア化 |
| jump | ジャンプ | Hawkin | CMJ/スクワットジャンプ/片脚ジャンプ |
| strength | ストレングス | Hawkin | Jump Power/RFD/Acceleration Potential |
| balance_lr | バランス・左右差 | Hawkin | 左右差・片脚差・着地安定性指数 |
| fatigue | 疲労度 | Hawkin | CMJ低下率/RFD低下率/着地衝撃増加 |
| mental | メンタル | Upmind | 集中度/HRV/睡眠スコア |

補足:
- SCR-03 は 8軸（加速・スピード/方向転換/減速/ジャンプ/ストレングス/バランス・左右差/疲労度/メンタル）を表示し、スコアに差分ラベルを併記する。

---

## 5. KPI明細定義（SCR-02）

### 5.1 加速とスピード（Photon）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| sprint_5m | 5m | s | number |
| sprint_10m | 10m | s | number |
| sprint_20m | 20m | s | number |
| sprint_30m | 30m | s | number |
| forced_velocity | Forced Velocity | km/h | number |
| max_speed | 最大速度 | km/h | number |

表示数値例（前回→今回）
- 5m: 1.12 s → 1.05 s
- 10m: 1.89 s → 1.78 s
- 20m: 3.12 s → 2.98 s
- 30m: 4.35 s → 4.12 s
- Forced Velocity: 28.4 km/h → 30.1 km/h
- 最大速度: 31.2 km/h → 33.0 km/h

### 5.2 方向転換（Photon）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| change_5_10_5 | 5-10-5 | s | number |
| change_t_test | T-test | s | number |
| change_curved_sprint | Curved Sprint | s | number |
| change_cut_45 | Cut 45° | s | number |
| change_cut_75 | Cut 75° | s | number |

表示数値例（前回→今回）
- 5-10-5: 4.62 s → 4.41 s
- T-test: 9.88 s → 9.52 s
- Curved Sprint: 6.21 s → 5.94 s
- Cut 45°: 2.41 s → 2.28 s
- Cut 75°: 2.68 s → 2.51 s

### 5.3 減速（Photon）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| decel_ada_distance | ADA減速距離 | m | number |
| decel_5_0_5 | 5-0-5 | s | number |

表示数値例（前回→今回）
- ADA減速距離: 3.8 m → 3.1 m
- 5-0-5: 2.41 s → 2.26 s

### 5.4 ジャンプ（Hawkin）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| jump_cmj | CMJ | cm | number |
| jump_squat | スクワットジャンプ | cm | number |
| jump_single_leg | 片脚ジャンプ（R/L） | cm | pair (R/L) |

表示数値例（前回→今回）
- CMJ: 38.2 cm → 42.6 cm
- スクワットジャンプ: 34.1 cm → 37.8 cm
- 片脚ジャンプ（R/L）: 31.2 / 28.4 cm → 33.5 / 32.9 cm

### 5.5 ストレングス（Hawkin）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| strength_jump_power | ジャンプ力 | N/kg | number |
| strength_rfd | RFD | N/s | number |
| strength_accel_potential | 加速ポテンシャル | - | number |

表示数値例（前回→今回）
- ジャンプ力: 42.1 N/kg → 47.8 N/kg
- RFD: 6,200 N/s → 7,450 N/s
- 加速ポテンシャル: 0.82 → 0.91

### 5.6 バランス・左右差（Hawkin）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| balance_lr | 左右差 | % | number |
| balance_single_leg_gap | 片脚ジャンプ差 | % | number |
| balance_landing_stability | 着地安定性指数 | score | number |

表示数値例（前回→今回）
- 左右差: 12.4 % → 5.8 %
- 片脚ジャンプ差: 9.1 % → 3.2 %
- 着地安定性指数: 68 → 82

### 5.7 疲労度（Hawkin）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| fatigue_cmj_drop | CMJ低下率 | % | number |
| fatigue_rfd_drop | RFD低下率 | % | number |
| fatigue_landing_impact | 着地衝撃増加 | % | number |

表示数値例（前回→今回）
- CMJ低下率: -9.2 % → -3.1 %
- RFD低下率: -11.4 % → -4.6 %
- 着地衝撃増加: +14.2 % → +5.3 %

### 5.8 メンタル（Upmind）
| metric_id | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| mental_focus | 集中度 | score | number |
| mental_hrv | HRV | ms | number |
| mental_sleep_score | 睡眠スコア | score | number |

表示数値例（前回→今回）
- 集中度: 62 → 78
- HRV: 48 ms → 61 ms
- 睡眠スコア: 71 → 84

---

## 6. 監督用ダッシュボード（SCR-03）

### 6.1 フィルタ/ソート
- ソート: 選手名/学年/ポジション/背番号/伸長率/疲労フラグ
- 学年フィルタ（例: 全学年/高3/高2/高1）
- 期間フィルタ（例: 通期/上半期/下半期）
- デフォルト: 背番号昇順

### 6.2 選手リスト
| field | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| number | 背番号 | - | number |
| name | 選手名 | - | string |
| position | ポジション | - | string |
| grade | 学年 | - | string |
| term | 半期 | - | string |
| growthRate | 直近伸長率 | % | number |
| fatigueFlag | 疲労フラグ | - | boolean |
| statusBadge | 状態バッジ | - | enum |
| measuredAt | 測定日 | - | datetime |

### 6.3 レーダー/差分表示
| field | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| score | スコア | - | number |
| metaLabel | 増減表示 | - | string |
| tone | 改善/悪化 | - | enum |

### 6.4 選手サマリー
| field | 表示名 | 単位 | 形式 |
| --- | --- | --- | --- |
| label | 指標名 | - | string |
| score | スコア | - | number |
| delta | 差分 | - | number |

補足:
- SCR-03 の選手サマリーは Home画面の8カテゴリを表示する。

## 7. CSV/JSONインポート（MVP）

### 7.1 必須項目
- participant_id
- event_id
- metric_id
- value_current
- unit
- measured_at
- vendor

### 7.2 任意項目
- value_previous
- source_file_id
- notes

---

## 8. 不整合事項（ベンダー資料との差分、Upmind除く）
- Hawkin: ベンダー資料に **Jump Power/RFD/Acceleration Potential/疲労度** が明記されていない（フォースプレート由来の派生KPIとして扱う想定）。
- PlayerData: ベンダー資料に **走行距離/最高時速/スプリント/加減速/ワークロード/ヒートマップ** 等があるが、SCR-01/02には未反映（PlayerDataロゴは表示）。
