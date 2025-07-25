# Beyond Binary Rewards: Training LMs to Reason about Their Uncertainty

## 基本情報
- arXiv ID: 2507.16806v1 (https://arxiv.org/abs/2507.16806)
- 著者: Mehul Damani, Isha Puri, Stewart Slocum, Idan Shenfeld他
- 所属: Massachusetts Institute of Technology
- 投稿日: 2025年07月24日
- カテゴリ: cs.LG, cs.AI

## 簡単に説明すると
この論文は、言語モデルの推論能力を向上させる際に、単なる正誤の二値報酬ではなく、不確実性を考慮した報酬を使用する新しい強化学習手法を提案しています。
この手法はRLCR（Reinforcement Learning with Calibration Rewards）と呼ばれます。
従来の強化学習では、モデルが過度に自信を持ちすぎたり、根拠のない推測をしたりする問題がありました。
RLCRは、モデルに答えだけでなく、その確信度も出力させ、ブライアスコアを使って精度と較正の両方を最適化します。
これにより、正確でありながら、自身の不確実性を適切に表現できるモデルを訓練できます。

関連リンクは以下の通りです。
- GitHub: https://github.com/huggingface/Math-Verify（数学的検証システム）

## 1. 研究概要
### 1.1 背景と動機
大規模言語モデルに推論能力を持たせるための強化学習は、様々な困難な質問応答タスクで高い性能を示してきました。
しかし、従来の手法では正解かどうかだけを評価する二値報酬を使用しており、これには重要な問題があります。

まず、二値報酬は推測や低確信度の出力を罰しないため、モデルが過度に自信を持つようになります。
これにより、キャリブレーション（確信度と実際の正解率の一致）が悪化し、他の問題領域で誤った応答を生成する率が増加します。
特に医療や法律などの高リスク領域では、モデルが自身の不確実性を適切に伝えることが重要ですが、従来の手法ではこれが困難でした。

本研究は、推論モデルが正確性と較正された確信度推定の両方を同時に改善できるかという問いに答えることを目的としています。

### 1.2 主要な貢献
本研究の主要な貢献は以下の通りです。
- 正確性と較正を同時に最適化する新しい強化学習手法（RLCR）の提案と理論的基盤の確立
- ブライアスコアを含む正式なスコアリングルールを使用した報酬関数が、理論的に正確かつ較正されたモデルを生成することの証明。
- 多様なデータセットでの実験により、RLCRが精度を維持しながら較正をECEで0.37から0.03に改善することを実証。
- 言語化された確信度を活用したテスト時のスケーリング手法の提案と検証。

## 2. 提案手法
### 2.1 手法の概要
RLCRは、モデルが推論の連鎖（思考過程）、最終的な答え、不確実性の分析、そして数値的な確信度（0から1の値）を生成するように訓練します。

従来のRLVF（Reinforcement Learning with Verifiable Rewards）では、単に答えが正しいかどうかだけを評価していました。
これに対して、RLCRは正確性と較正の両方を考慮した報酬関数を使用します。

モデルの出力は以下の構造化された形式になります。
- `<think>`: 推論の連鎖（思考過程）。
- `<answer>`: 最終的な答え。
- `<analysis>`: 不確実性についての推論。
- `<confidence>`: 数値的な確信度（0-1）。

### 2.2 技術的詳細
RLCRの中核となる報酬関数は以下の通りです。
```
R_RLCR(y, q, y*) = 1_{y≡y*} - (q - 1_{y≡y*})²
```

ここで各変数の意味は以下の通りです。
- y：モデルの出力。
- q：言語化された確信度（0-1）。
- y*：正解。
- 1_{y≡y*}：y が y* と等しい場合1、そうでない場合0。

この報酬関数は、正確性報酬（第1項）とブライアスコア（第2項）の組み合わせです。
ブライアスコアは、確信度と実際の正解率の差の二乗を計算し、較正の良さを評価します。

理論的には、有界な適切スコアリングルール（bounded proper scoring rule）であれば、ブライアスコアの代わりに使用できることが証明されています。
ただし、対数損失のような非有界なスコアリングルールは使用できません。

### 2.3 新規性
本研究の新規性は以下の点にあります。

第一に、推論モデルの訓練において、正確性と較正を同時に最適化する初めての手法です。
従来の研究では、事後的に確信度を割り当てる分類器を訓練していましたが、推論過程自体に不確実性の推論を組み込む点が革新的です。

第二に、理論的な基盤が確立されており、提案する報酬関数が望ましい性質を持つことが証明されています。
特に、定理1では、この報酬関数を最大化するモデルが正確かつ較正されることを示しています。

第三に、言語化された確信度を使用することで、外部の報酬モデルや分類器を必要とせずに、テスト時のスケーリング手法を適用できる点も新しい貢献です。

## 3. 実験結果
### 3.1 実験設定
実験では以下の設定を使用しました。
- 基礎モデル：Qwen2.5-7B
- RLアルゴリズム：修正版GRPO（Group Relative Policy Optimization）
- 訓練データセット：HotpotQA-Modified（20,000例）、Big-Math Digits（15,000問題）
- 評価指標：精度、AUROC、ブライアスコア、期待較正誤差（ECE）

評価は以下のデータセットで実施しました。
- ドメイン内：HotpotQA、Math-500、GSM8K、Big-Math
- ドメイン外：TriviaQA、SimpleQA、CommonsenseQA、GPQA

### 3.2 主要な結果
**ドメイン内性能（HotpotQA）**：
RLCRは62.1%の精度を達成し、RLVF（63.0%）とほぼ同等の性能を示しました。
しかし、較正面では劇的な改善が見られ、ECEは0.03（RLCR）対0.37（RLVF）と92%削減しました。
ブライアスコアも0.21（RLCR）対0.37（RLVF）と、優れた結果を示しています。

**ドメイン内性能（数学）**：
数学タスクでも、RLCRは72.7%の精度でRLVF（72.9%）と競争力のある性能を維持しました。
較正面では、ECEが0.10対0.26と、やはり大きな改善が見られました。
特にSFT+RLCRバリアントは、ECE 0.08という最良の較正を達成しました。

**ドメイン外への汎化**：
興味深いことに、RLVFは基礎モデルと比較して較正を悪化させる一方、RLCRは精度と較正の両方を改善しました。
ドメイン外の平均では、RLCRは56.2%の精度とECE 0.21を達成し、RLVF（53.9%精度、ECE 0.46）を上回りました。

### 3.3 既存手法との比較
事後的に確信度を割り当てる分類器ベースの手法と比較して、RLCRは以下の利点を示しました。

**推論の一貫性**：RLCRで訓練されたモデルは、推論連鎖の内容と確信度の一貫性が高く、自己矛盾も少ないことが示されました。

**テスト時スケーリング**：確信度重み付き多数決投票により、通常の多数決投票よりも優れた性能を示しました。
また、アンサンブルサイズが増加するにつれて、較正も改善されることが確認されました。

**外部モデル不要**：言語化された確信度が、外部の報酬モデルなしで効果的な代理報酬として機能することが示されました。

## 4. 実用性評価
### 4.1 実装の容易性
RLCRの実装は非常に簡単で、既存のRL訓練パイプラインに最小限の変更で適用できます。
必要な変更は、出力フォーマットに確信度を追加し、報酬関数を修正するだけです。
コードの変更は数十行程度で済み、追加の計算コストもほとんどありません。

### 4.2 計算効率
RLCRは、通常のRLVF訓練とほぼ同じ計算リソースで実行できます。
確信度の計算と不確実性分析の生成により、推論時間が約5%増加します。
しかし、これは実用上問題になるレベルではありません。
むしろ、較正された確信度により、確信度の低い出力をフィルタリングできるため、下流タスクの効率向上が期待できます。

### 4.3 応用可能性
RLCRは以下のような幅広い応用が期待されます。
- 医療診断支援：不確実な診断について適切に警告を発することができる
- 法律相談システム：確信度の低い助言を識別し、専門家への相談を促すことができる
- 教育支援システム：学生の質問に対して、確実な知識と不確実な推測を区別して提示できる
- 科学研究支援：仮説生成時に、その確からしさを適切に評価できる

## 5. まとめと所感
### 5.1 論文の意義
この論文は、AIシステムの信頼性向上において重要な貢献をしています。
特に注目すべき点は以下の通りです。

**理論と実践の融合**：正式なスコアリングルールの理論に基づいた手法でありながら、実装が簡単で実用的である点は高く評価されます。
多くの理論的研究が実装の複雑さに悩まされる中、この研究は両立を実現しています。

**汎用性の高さ**：提案手法は特定のタスクに依存せず、様々な推論タスクに適用可能です。
実験でも、質問応答と数学の両方で有効性が示されており、他の領域への拡張も期待できます。

**実世界への影響**：AIシステムが自身の限界を認識し、適切に伝えることは、安全で信頼できるAIの実現に不可欠です。
この研究は、その実現に向けた重要な一歩となっています。

### 5.2 今後の展望
著者らが示唆する今後の研究方向は以下の通りです。
- ドメイン外タスクでの絶対的な較正レベルの改善
- 解答間の一貫性問題への対処
- 分類器の能力と思考連鎖の忠実性の関係の探求
- 他の推論タスクやモダリティへの拡張

さらに、以下の発展も期待されます。
- より大規模なモデルへの適用と、スケーリング法則の解明
- 人間の不確実性表現との比較研究
- マルチモーダル推論への拡張