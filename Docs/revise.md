- 1月18日に実際に測定会を実施しました。

- その際のデータを追加します。
- スプリント（Photonで測定）：Data/Meiji Gakuin_sprint_0118.csv
- アジリティ(Photonで測定)：Data/Meiji Gakuin_505_0118.csv
- ジャンプ力とストレングス（Hawkinで測定）：Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csv

- こちらを元にまずは設計書を更新したい。
- 元あった項目は今後追加測定される可能性があるため、非表示にしておいてください。

- スプリント：Data/Meiji Gakuin_sprint_0118.csvでの使用項目
* Total time (s):テスト全体の合計タイム（30m等の総合指標）
* Split time 5 m (s):5m到達までの累積タイム（加速局面の分解評価に使用）
* Split time 10 m (s):10m到達までの累積タイム（加速局面の分解評価に使用）
* Split time 15 m (s):15m到達までの累積タイム（加速局面の分解評価に使用）
* Split time 20 m (s):20m到達までの累積タイム（加速局面の分解評価に使用）
* Max speed (km/h):最大速度（トップスピード到達能力の指標）
* Acceleration (m/s²):加速度指標（Photon算出。加速能力の比較に使用）
- このテストでは「スピード(主な項目:Max speed (km/h))」を測定

- アジリティ：Data/Meiji Gakuin_505_0118.csvでの使用項目
* Max speed (km/h):最大速度（トップスピード到達能力の指標）
* Average acceleration (m/s²):平均加速度（進入/再加速の能力）
* Average deceleration (m/s²):平均減速度（ブレーキ能力）
* Average re-acceleration (m/s²):平均再加速度（切り返し後の立ち上がり）
* 5-0 time (s):進入5mのタイム（ターン前）
* 0-5 time (s):切り返し後5mのタイム（再加速局面）
- このテストでは「加速(主な項目:Average acceleration (m/s²))」と「減速（主な項目:Average deceleration (m/s²)）」と「再加速（主な項目:Average re-acceleration (m/s²)）」を測定

- ジャンプ力：Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csvでの使用項目
* Jump Height:垂直方向の跳躍能力（パワー/バネの総合結果）
* Jump Momentum:体重を含めた出力（空中戦/コンタクトでの強さの示唆）
* Countermovement Depth:沈み込み量（SSCの使い方・動作戦略の違い）
* Flight Time:滞空時間（ジャンプ高と強く関連）
* Time To Takeoff:離地までの素早さ（キレ/動作スピード）
- このテストでは「ジャンプ力（主な項目:Jump Height）」を測定

- ストレングス：Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csvでの使用項目
* Peak Relative Braking Power:制動局面の最大パワー（体重比）
* Peak Braking Power:制動局面の最大パワー（強いブレーキと切り返し）
* Peak Relative Propulsive Power:推進局面の最大パワー（体重比）
* Peak Propulsive Power:推進局面の最大パワー
* Relative Peak Landing Force:安定性（力を足首にかけれているか）（体重比）
* Peak Landing Force:安定性（力を足首にかけれているか）
- このテストでは「パワー(主な項目:Peak Propulsive Power)」と「安定性（主な項目:Peak Landing Force）」を測定

- バランス・左右差：Data/Meiji_Gakuin-01_18_26-01_18_26-_Countermovement_Jump.csvでの使用項目
- 以下項目では、左の方が数値が大きいとプラスの値に、右の方が数値が大きいとマイナスの値となり、左右の絶対値で表示されている。
* L|R Peak Braking Force:左右の制動最大力の差（左右差/弱い側の特定）
* L|R Peak Propulsive Force:左右の推進最大力の差（左右差/弱い側の特定）
* L|R Peak Landing Force:左右の着地衝撃ピーク差（左右差/弱い側の特定）
- このテストでは「バランス・左右差(主な項目:L|R Peak Braking Force)」を測定

- 「スピード」「加速」「減速」「再加速」「ジャンプ」「パワー」「安定性」「バランス・左右差」の8角形をダッシュボードのグラフで表現したい

- データについて
- 「スピード」「加速」「減速」「再加速」「ジャンプ」「パワー」「安定性」「バランス・左右差」それぞれを相対評価し、70~95のスコアをつけてください。
- 「スピード」「加速」「減速」「再加速」「ジャンプ」「パワー」「安定性」「バランス・左右差」それぞれでチーム内順位をつけてください。

-　また、トップ画面で選手名（測定結果のCSVから抽出）のドロップダウンを選択し、表示を切り替えるようなUIを追加してください。