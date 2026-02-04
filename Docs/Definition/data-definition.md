# データ定義書（SSV 1Day PWA）

- 作成日: 2026-01-11
- 更新日: 2026-02-04
- 版数: v0.2
- 参照: Docs/ScreenImage/ScreenImage.png, Docs/ScreenImage/CoachData.png, Docs/revise.md, Docs/Definition/calculation-logic.md

---

## 1. 対象スコープ
- 画面定義書で定義した SCR-01（レポート概略）/ SCR-02（レポート詳細）/ SCR-03（監督用ダッシュボード）で必要となるデータ項目
- 2026-01-18 測定会の実データ（Photon/Hawkin）を対象に、**CSV/JSONインポート → 画面表示** を最優先
- 方向転換/疲労度/メンタル等の既存項目は、今後追加測定の可能性があるため **非表示（将来拡張）**

---

## 2. データソース
- Photon Sports（スプリント/5-0-5）
  - `Data/Meiji Gakuin_sprint_0118.csv`
  - `Data/Meiji Gakuin_505_0118.csv`
- Hawkin Dynamics（Countermovement Jump）
  - `Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csv`
- 参加者プロフィール（運営入力/事前登録）
- NTT Sportict / PlayerData / Upmind は将来拡張（現時点は非表示）

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
- score: number (70-95)
- rank: number (1..N)
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
- id: string（speed/accel/decel/re_accel/jump/power/stability/balance_lr）
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

| category_id | 表示名 | データソース | 備考 |
| --- | --- | --- | --- |
| speed | スピード | Photon Sprint | 主指標: Max speed (km/h) |
| accel | 加速 | Photon 5-0-5 | 主指標: Average acceleration (m/s²) |
| decel | 減速 | Photon 5-0-5 | 主指標: Average deceleration (m/s²) |
| re_accel | 再加速 | Photon 5-0-5 | 主指標: Average re-acceleration (m/s²) |
| jump | ジャンプ | Hawkin CMJ | 主指標: Jump Height |
| power | パワー | Hawkin CMJ | 主指標: Peak Propulsive Power |
| stability | 安定性 | Hawkin CMJ | 主指標: Peak Landing Force |
| balance_lr | バランス・左右差 | Hawkin CMJ | 主指標: L\|R Peak Braking Force（左右差は小さいほど良い） |

補足:
- スコアは同一イベント内の相対評価で 70〜95 に正規化する。
- 順位はチーム内順位（1..N）を付与する。
- 方向転換/疲労度/メンタル等は将来追加測定のため非表示とする。
- SCR-03 も同じ 8カテゴリを表示し、スコアに差分ラベルを併記する。
- 計算ロジックは `Docs/Definition/calculation-logic.md` を参照する。

---

## 5. KPI明細定義（SCR-02）

### 5.1 スプリント（Photon）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| sprint_total_time | 総合タイム | s | number | `Total time (s)` |
| sprint_split_5m | 5m 到達タイム | s | number | `Split time 5 m (s)` |
| sprint_split_10m | 10m 到達タイム | s | number | `Split time 10 m (s)` |
| sprint_split_15m | 15m 到達タイム | s | number | `Split time 15 m (s)` |
| sprint_split_20m | 20m 到達タイム | s | number | `Split time 20 m (s)` |
| sprint_max_speed | 最大速度 | km/h | number | `Max speed (km/h)` |
| sprint_accel | 加速度 | m/s² | number | `Acceleration (m/s²)` |

- このテストでは「スピード（主指標: Max speed (km/h)）」を測定する。

### 5.2 アジリティ 5-0-5（Photon）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| agility_max_speed | 最大速度 | km/h | number | `Max speed (km/h)` |
| agility_avg_accel | 平均加速度 | m/s² | number | `Average acceleration (m/s²)` |
| agility_avg_decel | 平均減速度 | m/s² | number | `Average deceleration (m/s²)` |
| agility_avg_reaccel | 平均再加速度 | m/s² | number | `Average re-acceleration (m/s²)` |
| agility_5_0_time | 進入5mタイム | s | number | `5-0 time (s)` |
| agility_0_5_time | 再加速5mタイム | s | number | `0-5 time (s)` |

- このテストでは「加速/減速/再加速」を測定する（主指標: Average acceleration / Average deceleration / Average re-acceleration）。
- 詳細画面では同一カード内で「加速/減速/再加速」の小見出しで区分表示する。

### 5.3 ジャンプ（Hawkin CMJ）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| jump_height | 跳躍高 | vendor | number | `Jump Height` |
| jump_momentum | ジャンプモメンタム | vendor | number | `Jump Momentum` |
| countermovement_depth | 沈み込み量 | vendor | number | `Countermovement Depth` |
| flight_time | 滞空時間 | vendor | number | `Flight Time` |
| time_to_takeoff | 離地時間 | vendor | number | `Time To Takeoff` |

- このテストでは「ジャンプ（主指標: Jump Height）」を測定する。

### 5.4 パワー（Hawkin CMJ）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| peak_propulsive_power | 推進最大パワー | vendor | number | `Peak Propulsive Power` |
| peak_relative_propulsive_power | 推進最大パワー（体重比） | vendor | number | `Peak Relative Propulsive Power` |
| peak_braking_power | 制動最大パワー | vendor | number | `Peak Braking Power` |
| peak_relative_braking_power | 制動最大パワー（体重比） | vendor | number | `Peak Relative Braking Power` |

### 5.5 安定性（Hawkin CMJ）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| peak_landing_force | 着地最大力 | vendor | number | `Peak Landing Force` |
| relative_peak_landing_force | 着地最大力（体重比） | vendor | number | `Relative Peak Landing Force` |

### 5.6 バランス・左右差（Hawkin CMJ）
| metric_id | 表示名 | 単位 | 形式 | 参照カラム |
| --- | --- | --- | --- | --- |
| lr_peak_braking_force | 左右差: 制動最大力 | vendor | number | `L|R Peak Braking Force` |
| lr_peak_propulsive_force | 左右差: 推進最大力 | vendor | number | `L|R Peak Propulsive Force` |
| lr_peak_landing_force | 左右差: 着地最大力 | vendor | number | `L|R Peak Landing Force` |

- このテストでは「パワー（主指標: Peak Propulsive Power）」「安定性（主指標: Peak Landing Force）」「バランス・左右差（主指標: L|R Peak Braking Force）」を測定する。
- L|R 指標は左右の差分で、左が大きいとプラス、右が大きいとマイナスとなる。UIでは左右差の絶対値として扱う。

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

## 8. 留意事項（CSV仕様/将来拡張）
- Photon CSV は 1行目がタイトル、2行目が空行、3行目がヘッダーで、区切りは `;`。
- Hawkin CSV はカンマ区切りで、1行目がヘッダー。
- 5-0-5 の `Direction ()` は Left/Right を示す。表示/集計ルールは別途決定。
- 方向転換/疲労度/メンタル/PlayerData/NTT/Upmind は将来拡張のため現時点は非表示。
