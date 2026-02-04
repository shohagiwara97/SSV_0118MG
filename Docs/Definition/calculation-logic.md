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
