# Megrez2 Technical Report

## 基本情報
- **arXiv ID**: 2507.17728v1 (https://arxiv.org/abs/2507.17728)
- **著者**: Boxun Li, Yadong Li, Zhiyuan Li, Congyi Liu, Weilin Liu, Guowei Niu, Zheyue Tan, Haiyang Xu, Zhuyu Yao, Tao Yuan, Dong Zhou, Yueqing Zhuang, Bo Zhao, Guohao Dai, Yu Wang
- **所属**: Infinigence-AI, Aalto University, Shanghai Jiao Tong University, Tsinghua University
- **投稿日**: 2025年07月25日
- **カテゴリ**: cs.CL, cs.AI

## 簡単に説明すると
Megrez2は、デバイスネイティブな展開に最適化された軽量で高性能な言語モデルアーキテクチャです。隣接するトランスフォーマー層間でエキスパートモジュールを再利用する新しいクロスレイヤーエキスパート共有メカニズムを導入し、モデルの容量の大部分を維持しながら総パラメータ数を大幅に削減します。また、メモリ効率的なエキスパートローディングと高速推論を可能にするpre-gatedルーティングも組み込んでいます。Megrez2-Previewモデルは、5兆トークンのコーパスで事前学習され、教師あり学習と検証可能な報酬による強化学習でさらに強化されています。3Bの活性化パラメータと7.5Bの保存パラメータのみで、言語理解、指示追従、数学的推論、コード生成など幅広いタスクで、より大きなモデルと比較して競争力のある、あるいは優れた性能を示しています。GitHubリポジトリ（https://github.com/infinigence/Infini-Megrez）で公開されています。

## 1. 研究概要
### 1.1 背景と動機
大規模言語モデル（LLM）は前例のないペースで進歩し、数千億のパラメータにスケールアップして、人工汎用知能（AGI）に向けた顕著な進歩を示しています。GPT-4、GPT-o3、Gemini、Llama 4、DeepSeekR1、Kimi-K2、Qwen3シリーズなどの最近の基盤モデルは、複数のドメインにわたる複雑なタスクで強力な性能を示しています。

しかし、この進歩はデータと計算への大規模な投資によって推進されており、モデル容量と展開の実用性の間の緊張を激化させています。特に、厳密な遅延、メモリ、電力制約を持つデバイスでの展開において問題となります。

デバイスAIシステムの設計は、しばしば「不可能の三角形」に直面します：速度、精度、コストの3つの間のトレードオフで、一つの側面を強化すると通常は他の側面が損なわれます。制約のあるハードウェアで推論を加速するには通常、積極的なプルーニングまたは量子化が必要で、これによりモデル容量が減少し、精度が低下します。一方、精度を高めるためにモデルサイズを増やすと、遅延が増加し、ハードウェア要求が高まります。

### 1.2 主要な貢献
本研究の主要な貢献は以下の通りです：
- デバイスネイティブな展開専用に設計された新しい言語モデルアーキテクチャ「Megrez2」を提案
- 複数の隣接層間で同じエキスパートセットを再利用することで、活性化パラメータ数を維持しながら総パラメータ数を大幅に削減するクロスレイヤーエキスパート共有メカニズムを導入
- バランスの取れたエキスパート利用を促進する新しいルーティング戦略と組み合わせたpre-gatedルーティングにより、厳しい計算制約下でも強力な性能を達成
- Megrez2アーキテクチャの最初のインスタンスとしてMegrez2-Previewを提示し、その有効性を実証

## 2. 提案手法
### 2.1 手法の概要
Megrez2アーキテクチャは、Mixture-of-Experts（MoE）フレームワーク内で新しいクロスレイヤーエキスパート共有戦略とpre-gatedルーティングを組み込んでいます。標準的なMoEでは、各層が独自のエキスパートプールを持ちますが、Megrez2では連続するn層間でエキスパートパラメータを共有し、総パラメータ数を約n分の1に削減します。

### 2.2 技術的詳細
**クロスレイヤーエキスパート共有**：
Megrez2は、L層のトランスフォーマーをG = L/n個の連続するグループ（長さn）に分割します。グループg = ⌊i/n⌋内の各層iは、同じエキスパートプール{E_{g,1}, ..., E_{g,M}}を共有しながら、独自のゲーティングネットワークG_iと投影重みを保持します。層iの隠れ状態は次のように更新されます：

h'_i = Σ_{j=1}^{M} [top-k(s_i)]_j E_{g,j}(h_i), g = ⌊i/n⌋

ここで、s_i = G_i(h_i)はルーティングスコアを表します。

**Pre-gatedルーティング**：
限られたメモリを持つデバイスでの展開をサポートするため、Megrez2はPre-gated Routingを採用します。ゲーティング計算を前の層にシフトすることで、モデルは選択されたエキスパートのパラメータを事前にロードでき、スパース活性化のメモリコストを削減します。前の層のルータG_{i-1}が層iのルーティング決定を生成します。

**アーキテクチャの詳細**：
Megrez2-Previewは、DeepSeekV2と同様のdense-layer-firstアーキテクチャを採用しています：
- 総層数：31層（最初の層は密な層）
- 3層ごとにMoEモジュールのエキスパートパラメータを共有するグループを形成
- グループあたり64エキスパート、top-6エキスパートがルーティングで選択
- 各層に4つの共有エキスパートを組み込み
- 密な層の隠れサイズ：10,944
- 各エキスパートの隠れ次元：1,408
- トークナイザー：Megrez-3Bシリーズのものを使用

### 2.3 新規性
本研究の主な新規性は以下の通りです：

1. **クロスレイヤーエキスパート共有**: 隣接層間でエキスパートを共有することで、活性化パラメータ数を維持しながら総パラメータ数を大幅に削減する革新的なアプローチ。

2. **Pre-gatedルーティングとの組み合わせ**: クロスレイヤー共有とpre-gatedルーティングの組み合わせにより、メモリ制約のある環境でも効率的な推論を実現。

3. **デバイスネイティブ設計**: リソース制約のあるデバイスでの展開を明確に意識した設計により、実用的な応用を可能にする。

## 3. 実験結果
### 3.1 実験設定
**事前学習**：
- データセット：5兆トークン（ウェブテキスト、クリーンなGitHubコード、STEM コンテンツ、書籍、合成推論データを含む）
- 3段階の訓練パラダイム：
  - 基礎段階：1.5兆トークン、シーケンス長4,096
  - 知識・推論強化段階：約3兆トークン、学習率を1桁減少
  - 長コンテキスト拡張段階：600億トークン以上、コンテキスト長を32Kトークンに拡張

**ポスト訓練**：
- 教師あり微調整（SFT）：数百万の高品質サンプルで2エポック訓練
- 強化学習：修正版GRPO アルゴリズムを使用し、約60,000サンプルのデータセットで訓練

### 3.2 主要な結果
評価は一般的な言語理解、指示追従、数学的推論、コーディングタスクを含む多様なドメインで実施されました。比較対象には、Qwen2.5-3B/7B、Qwen3-4B/8B、Gemma-3-4B、GPT-4o-miniなどが含まれます。

**主要な結果**：
- **一般タスク**: C-EVALで91.7%（他のモデルを大幅に上回る）、MMLU-Proで67.6%を達成
- **指示タスク**: IFEvalで80.2%を達成し、より大きなモデルと競争力のある結果
- **数学タスク**: MATH-500で81.6%、GSM8Kで83.6%を達成
- **コーディングタスク**: HumanEvalで74.4%、MBPPで88.0%（全モデル中最高）を達成

### 3.3 既存手法との比較
Megrez2-Previewは、3Bの活性化パラメータと7.5Bの総パラメータのみで、はるかに大きなモデルと同等またはそれ以上の性能を示しています：

- Qwen2.5-7B（7.6Bパラメータ）やQwen3-8B（8.2Bパラメータ）よりも少ないパラメータで、複数のベンチマークでこれらを上回る
- 特にMBPPコーディングタスクでは、全評価モデル中最高のスコアを達成
- 一般的な言語理解タスク（C-EVAL、MMLU-Pro）で顕著に優れた性能を示す

## 4. 実用性評価
### 4.1 実装の容易性
Megrez2の実装は、既存のMoEフレームワークに基づいており、主な変更点はエキスパート共有メカニズムとルーティング戦略に限定されます。GitHubで公開されているコードベースにより、研究者や開発者が容易に実装・実験できます。また、Megrez-3Bシリーズの既存のトークナイザーを使用することで、既存のインフラストラクチャとの互換性も確保されています。

### 4.2 計算効率
Megrez2の計算効率における主な利点：
- **メモリ効率**: クロスレイヤー共有により、総パラメータ数を約n分の1に削減
- **推論速度**: Pre-gatedルーティングにより、エキスパートの事前ロードが可能となり、遅延を削減
- **キャッシュ効率**: 共有エキスパートプール内で既に選択されたエキスパートの再ロードが不要
- **パイプライン化**: 計算と重みのロードをオーバーラップさせることで、遅延をさらに削減

### 4.3 応用可能性
Megrez2は以下のような幅広い応用シナリオに適しています：

1. **エッジデバイス**: スマートフォン、タブレット、IoTデバイスなど、限られたメモリと計算能力を持つデバイスでの展開
2. **リアルタイムアプリケーション**: 低遅延が要求されるチャットボット、音声アシスタント、リアルタイム翻訳
3. **バッテリー駆動デバイス**: 電力効率が重要なモバイルデバイスやウェアラブルデバイス
4. **プライバシー重視のアプリケーション**: オンデバイス処理によりデータがデバイスを離れない必要がある用途

## 5. まとめと所感
### 5.1 論文の意義
Megrez2は、デバイスAIの「不可能の三角形」（速度、精度、コスト）に対する実用的な解決策を提示しています。クロスレイヤーエキスパート共有という革新的なアプローチにより、モデルサイズと性能の間の優れたトレードオフを実現し、リソース制約のある環境でも高性能なLLMの展開を可能にしています。

特に重要なのは、この研究が理論的な提案に留まらず、実際に動作するモデル（Megrez2-Preview）を提示し、その有効性を包括的なベンチマークで実証している点です。3Bの活性化パラメータで、7B-8Bクラスのモデルと同等以上の性能を達成したことは、エッジAIの実用化に向けた重要な一歩と言えます。

### 5.2 今後の展望
著者らは明示的に述べていませんが、以下のような発展が期待されます：

1. **更なる最適化**: ハードウェア固有の最適化（量子化、プルーニングなど）との組み合わせによる更なる効率化
2. **スケーリング**: より大規模なモデルへのアーキテクチャの適用と、その効果の検証
3. **専門化**: 特定のドメインやタスクに特化したMegrez2バリアントの開発
4. **ハードウェア協調設計**: Megrez2アーキテクチャに最適化された専用ハードウェアの開発

Megrez2は、高性能なAIをより多くのデバイスで利用可能にする重要な技術的進歩であり、エッジAIの民主化に貢献する可能性を秘めています。