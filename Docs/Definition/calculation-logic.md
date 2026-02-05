# 計算ロジック定義（CSV → JSON）

作成日: 2026-02-04  
対象: `scripts/convert_csv_to_json.py` と `scripts/mapping.json` に基づく変換・スコア計算

---

**目的**  
測定CSVからアプリ表示用JSONを生成し、カテゴリスコアと順位を算出するロジックを明文化する。

**対象データ**  
Photon Sprint / Photon 5-0-5 / Hawkin CMJ のCSV。

---

**1. 入力データと前処理**

1. Photon Sprint  
ファイル: `Data/Meiji Gakuin_sprint_0118.csv`  
区切り: `;`  
ヘッダー行: 3行目（先頭2行はスキップ）  
選手単位で最新1件を採用（`Date`の新しい行）

2. Photon 5-0-5  
ファイル: `Data/Meiji Gakuin_505_0118.csv`  
区切り: `;`  
ヘッダー行: 3行目（先頭2行はスキップ）  
選手単位で複数行（Left/Right）を集計  
集計方法: 各指標の平均値（avg）

3. Hawkin CMJ  
ファイル: `Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csv`  
区切り: `,`  
ヘッダー行: 1行目  
選手単位で最新1件を採用（`Date` + `Time` の新しい行）

4. 参加者ロスター（任意）  
ファイル: `Data/Meiji_Gakuin_roster_0118.csv`  
目的: 学年/背番号/ポジション/半期などの補完  
ロスターが存在する場合のみマージする（同名キーで上書き）
想定カラム例: `Name`, `Number`, `Grade`, `Position`, `Term`

5. 名前の揺れ  
`mapping.json` の `name_aliases` で統一する。

6. 左右差指標の扱い  
`L|R` 指標は **絶対値に変換** して扱う（左右差の大小のみを評価するため）。
符号は「左右どちらが優位か」の表示に利用する（正=左優位、負=右優位）。

---

**2. JSON生成ルール**

1. 選手ごとに以下を生成する。  
`players[].categories`: レーダー用のカテゴリスコアと順位  
`players[].sections`: 詳細画面のセクションと指標一覧  
`players[].metrics`: 生値（ソース別のメトリクス辞書）
`players[].number/grade/position/term`: ロスターCSVが存在する場合に補完

2. 詳細画面の「前回」は現時点では `--` 固定。

---

**3. スコア算出（カテゴリ）**

1. 対象指標  
`mapping.json` の `categories` に定義された `metric_id` を使用。

2. スコア範囲  
70〜95 に正規化（`score_range.min` / `score_range.max`）。

3. 正規化式  
`higher_is_better` の場合:  
`score = min + (value - minValue) / (maxValue - minValue) * (max - min)`  
`lower_is_better` の場合:  
`score = min + (maxValue - value) / (maxValue - minValue) * (max - min)`

4. 例外処理  
全員同値（maxValue == minValue）の場合は中央値（(min+max)/2）を採用。

5. 端数処理  
`round` により四捨五入。

6. 欠損  
値が欠損の選手は `score = null`。

---

**4. 順位算出**

1. `higher_is_better` は値の降順、`lower_is_better` は値の昇順で並べる。  
2. 並べた順に 1..N を付与する（同値は同順位にはしない）。

---

**5. 現在のカテゴリ定義（主指標）**

1. スピード: `sprint_max_speed`（higher_is_better）  
2. 加速: `agility_avg_accel`（higher_is_better）  
3. 減速: `agility_avg_decel`（higher_is_better）  
4. 再加速: `agility_avg_reaccel`（higher_is_better）  
5. ジャンプ: `jump_height`（higher_is_better）  
6. パワー: `peak_propulsive_power`（higher_is_better）  
7. 安定性: `peak_landing_force`（higher_is_better）  
8. バランス・左右差: `lr_peak_braking_force`（lower_is_better）

---

**6. 指標の評価方向（＋値がプラス評価 / －評価）**

**A. ＋値がプラス評価（値が大きいほど良い）**
- スプリント: `sprint_max_speed` / `sprint_accel`
- アジリティ: `agility_max_speed` / `agility_avg_accel` / `agility_avg_decel` / `agility_avg_reaccel`
- ジャンプ: `jump_height` / `jump_momentum` / `flight_time`
- パワー: `peak_propulsive_power` / `peak_relative_propulsive_power`
- 安定性: `peak_landing_force` / `relative_peak_landing_force`

**B. ＋値がマイナス評価（値が小さいほど良い）**
- スプリント: `sprint_total_time` / `sprint_split_5m` / `sprint_split_10m` / `sprint_split_15m` / `sprint_split_20m`
- アジリティ: `agility_5_0_time` / `agility_0_5_time`
- バランス・左右差: `lr_peak_braking_force` / `lr_peak_propulsive_force` / `lr_peak_landing_force`（左右差は小さいほど良い）

**C. 絶対値で評価（符号は評価に使わない）**
- パワー: `peak_braking_power` / `peak_relative_braking_power`
  - 制動系パワーは負値が出るため、評価は絶対値の大きさを重視する。

**D. 評価方向を固定しない（参考値）**
- `countermovement_depth` / `time_to_takeoff`
  - 動作戦略の違いが出るため、良否は文脈で判断する。

---

**7. 画面表示名（日本語表記）**

**カテゴリ表示名**
| category_id | 表示名 |
| --- | --- |
| speed | スピード |
| accel | 加速 |
| decel | 減速 |
| re_accel | 再加速 |
| jump | ジャンプ |
| power | パワー |
| stability | 安定性 |
| balance_lr | バランス・左右差 |

**指標表示名**
| metric_id | 表示名 |
| --- | --- |
| sprint_total_time | 総合タイム |
| sprint_split_5m | 5m 到達タイム |
| sprint_split_10m | 10m 到達タイム |
| sprint_split_15m | 15m 到達タイム |
| sprint_split_20m | 20m 到達タイム |
| sprint_max_speed | 最大速度 |
| sprint_accel | 加速度 |
| agility_max_speed | 最大速度 |
| agility_avg_accel | 平均加速度 |
| agility_avg_decel | 平均減速度 |
| agility_avg_reaccel | 平均再加速度 |
| agility_5_0_time | 進入5mタイム |
| agility_0_5_time | 再加速5mタイム |
| jump_height | 跳躍高 |
| jump_momentum | ジャンプモメンタム |
| countermovement_depth | 沈み込み量 |
| flight_time | 滞空時間 |
| time_to_takeoff | 離地時間 |
| peak_propulsive_power | 推進最大パワー |
| peak_relative_propulsive_power | 推進最大パワー (体重比) |
| peak_braking_power | 制動最大パワー |
| peak_relative_braking_power | 制動最大パワー (体重比) |
| peak_landing_force | 着地最大力 |
| relative_peak_landing_force | 着地最大力 (体重比) |
| lr_peak_braking_force | 左右差: 制動最大力 |
| lr_peak_propulsive_force | 左右差: 推進最大力 |
| lr_peak_landing_force | 左右差: 着地最大力 |

---

**8. 詳細画面モーダル（説明/指標の評価方法）**

詳細画面では、各項目をタップ/クリックすると以下を表示する。  
- 項目の説明（意味/用途）  
- 指標の評価方法（どのCSVカラムを使い、どう集計したか）
