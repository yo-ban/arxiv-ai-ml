# DenseWorld-1M: Towards Detailed Dense Grounded Caption in the Real World

## 基本情報
- arXiv ID: 2506.24102v1 ([https://arxiv.org/abs/2506.24102](https://arxiv.org/abs/2506.24102))
- 著者: Xiangtai Li, Tao Zhang, Yanwei Li 他13名
- 所属: ByteDance Seed, Wuhan University, Peking University
- 投稿日: 2025年6月
- カテゴリ: cs.CV

## 簡単に説明すると
この論文は、現実世界の複雑なシーンに対して詳細かつ高密度なグラウンディングされたキャプション（物体の位置情報付き説明文）を提供する初の大規模データセット「DenseWorld-1M」を提案しています。
100万枚の高解像度画像に対して、各物体の詳細な説明と精密なセグメンテーションマスクを含むデータセットを構築しました。
3段階の自動アノテーションパイプラインと、効率化のための2つの専用モデル（DRCとSCM）を開発し、人手によるアノテーションなしに高品質なデータセットを実現しています。

## 1. 研究概要
### 1.1 背景と動機
マルチモーダル大規模言語モデル（MLLM）は、大規模で高品質なデータセットから恩恵を受けて、シーン理解において複雑な能力を示しています。
しかし、既存のキャプションデータセットには重要な課題があります。

まず、多くのデータセットでは視覚的エンティティの位置情報や関係性が欠けています。
DenseFusion-1Mのような密なテキストを含むデータセットでも、空間的にグラウンディングされた位置情報（マスクやボックス）が含まれていないため、領域レベルの理解が困難です。

一方で、領域レベルのデータセットは常に詳細なキャプションアノテーションを欠いています。
特に、参照データセットと領域キャプションデータセットには、短い説明、背景コンテキストアノテーションの欠如、不完全な細粒度オブジェクト記述などの問題があります。

また、高解像度な画像上での詳細な説明、関係性、大量のオブジェクト記述が欠けているという問題もあります。
GPT-4やGeminiのようなプライベートモデルでさえ、ピクセルレベルのタグを視覚的プロンプトとして提供されても、このようなキャプションを生成できません。

### 1.2 主要な貢献
本研究の主要な貢献は以下の4点です。
- MLLMコミュニティのための初の大規模、詳細、密にグラウンディングされたキャプションデータセット「DenseWorld-1M」の提供
- 既存の最先端認識モデルとMLLMを活用して、密でグラウンディングされたキャプション、マスク、ラベルを自動生成する、ボトムアップ型3段階データセット生成パイプラインの開発
- ラベリングプロセスを高速化するための2つのファインチューニングされたMLLM（DRCとSCM）の提案
- 10以上の異なるデータセットでDenseWorld-1Mの有効性を示す広範な実験結果

## 2. 提案手法
### 2.1 手法の概要
DenseWorld-1Mの構築には、3段階の自動アノテーションパイプラインを採用しています。

第1段階（ピクセルレベルラベリング）では、各画像で精密なエンティティレベルのセグメンテーションマスクを生成します。
これにより複雑なシーンを複数のオブジェクトに分解します。
前景と背景の両方のオブジェクトマスクが取得されます。

第2段階（オブジェクトレベルラベリング）では、高性能なMLLMに単一のオブジェクトにのみ焦点を当てさせます。
これにより各オブジェクトに対して正確で可能な限り網羅的な説明を生成します。

第3段階（シーンレベルラベリング）では、視覚的プロンプトとテキストプロンプトの両方を通じてモデルを制約します。
視覚的プロンプトは画像上に表示されたハイライトされたエッジとオブジェクトIDです。
テキストプロンプトは第2段階で生成された各オブジェクトの詳細な説明です。
これにより、テキストとグラウンディングマスク間の高い一貫性を持つ詳細なキャプションを生成します。

### 2.2 技術的詳細
第1段階では、視覚基盤モデルのSAMとAPEを統合し、高品質なセグメンテーション結果を生成するためのフィルタリングと洗練の後処理ワークフローを慎重に設計しています。
RAM++を使用してオブジェクトタグを生成し、APEがパノプティックセグメンテーションマスクを生成するのを支援します。
同時に、SAMのsegment anythingモードを使用して、APEによる潜在的な欠落を補完する多粒度マスクを生成します。

第2段階では、ステージ1でセグメント化された各オブジェクトに対して詳細な説明を生成するために、InternVL-2.5 78Bのような高性能MLLMにプロンプトを与えます。
複雑なシーンでは、視覚的プロンプトだけでは参照されたオブジェクトを正確に識別することが困難なため、まずマスクを使用してオブジェクトをクロップします。
その後、元の画像に重ねた視覚的プロンプトと生成された簡潔なオブジェクトキャプションの両方を使用して、詳細なオブジェクト説明を生成します。

第3段階では、複雑なシーン（15個以上のオブジェクト）の場合、MLLMは主要なオブジェクトのみを保持する傾向があるため、複雑なシーン画像を複数のサブ画像に分割してシーンの複雑さを軽減します。
各サブ画像に対して詳細なグラウンディングされたキャプションを生成し、これらのサブ画像キャプションを使用して全体画像の最終的な詳細グラウンディングキャプションを生成します。

### 2.3 新規性
既存の手法との主な違いは、以下の点にあります。

まず、詳細な説明、密なオブジェクトキャプション、グラウンディングされたキャプション、オブジェクト位置情報を同時に含む初の大規模データセットである点です。
既存のデータセットは、これらの要素のいずれかが欠けていました。

次に、3段階のボトムアップアプローチを採用することで、複雑なシーンを段階的に理解し、詳細かつ正確なアノテーションを生成できる点です。
この方法により、GPT-4やGeminiのような大規模モデルでも生成できないレベルの詳細なキャプションを実現しています。

さらに、計算コストを削減するために、詳細領域キャプションモデル（DRC）と空間キャプションマージングモデル（SCM）という2つの専用モデルを開発しました。
DRCは新しいトークン注入設計を採用し、SCMは複数の詳細なオブジェクトキャプションを1つの流暢で密にグラウンディングされたキャプションにマージします。

## 3. 実験結果
### 3.1 実験設定
実験では、標準的なMLLMベンチマークとピクセルレベルMLLMベンチマークで評価しました。
前者にはMMBench、MMEシリーズ、MMStar、SEEDBench、AI2D、MMVP、MMMUが含まれます。
後者にはRefCOCO、RefCOCOg、RefCOCO+、Grounded Conversation Generationが含まれます。

ベースラインモデルとして、Sa2VA、Qwen-2.5 VL、LLaVA-1.5を採用しました。
Sa2VAは参照セグメンテーションとグラウンディングキャプション生成用です。
Qwen-2.5 VLはポストトレーニング用、LLaVA-1.5はスクラッチからのトレーニング検証用です。

データソースは、SAM-1B（高解像度画像）、Object-365（一般的なシーンのオブジェクト）、V3Det（大語彙クラスのデータセット）の3つから構成されています。

### 3.2 主要な結果
ピクセルレベルMLLMの結果では、参照セグメンテーションタスクにおいて、強力なベースラインであるSa2VAに対して約0.5%〜1%の改善が見られました。
例えば、RefCOCOでは83.6（Val）、85.2（TestA）、81.6（TestB）の性能を達成しました。

グラウンディングキャプション生成タスクでは、キャプション、グラウンディングキャプションリコール、マスクを含む複数の指標で改善が見られました。
特に、グラウンディングキャプション（AP50、Recall）でより顕著な改善が見られ、大きなドメインギャップにもかかわらず、データの有効性を示しています。

画像レベルMLLMの結果では、Qwen2.5-VLでポストトレーニングした結果、8つの異なるデータセットで一貫した改善が見られました。
これは、提案データセットがMLLMコミュニティでより強力なベースラインを構築するのに役立つことを示しています。

### 3.3 既存手法との比較
DRCモデルは、3Bモデルで少ないトレーニングデータと少ないトレーニングステージを使用しながら、Osprey-7Bを8.3 CIDErと0.3 METEORで上回りました。

効率性の面では、80GB A100 GPUでステージ2のラベリングプロセスを実行した場合、パイプラインは平均3.2分必要です。
一方、DRCは1.1分で処理できます。
ステージ3では、パイプラインが平均2.6分必要なのに対し、SCMは31秒しか必要としません。

視覚的な比較では、DenseWorld-1Mでファインチューニングすることで、Sa2VAは元のベースラインと比較して、シーンを説明するより詳細な単語を含む密なマスクを生成できるようになりました。

## 4. 実用性評価
### 4.1 実装の容易性
提案されたパイプラインは、既存の最先端モデル（SAM、APE、InternVL-2.5など）を活用しているため、実装が比較的容易です。
人手によるアノテーションが不要で、ほぼ自動化されたプロセスとなっています。

また、DRCとSCMモデルは、大規模モデルよりもはるかに小さく（3B〜8B）、実用的な展開が可能です。
LMDeployを使用した推論の高速化により、処理効率が向上しています。

### 4.2 計算効率
DRCモデルは、78Bモデルと比較して3倍の高速化を実現し、複数のオブジェクトを同時にラベリングできます。
SCMモデルは、ステージ3のプロセスを約5倍高速化します。

全体のパイプラインで、40%のデータは高速化された2つのモデルによって取得されており、大規模なデータセット構築において実用的な効率性を示しています。

### 4.3 応用可能性
DenseWorld-1Mは、様々な下流タスクに適用可能です。
VLM事前学習、テキスト駆動グラウンディング、詳細を自動的にチェックするO3のようなエージェントなど、幅広い応用が期待されます。

データセットは、画像レベルとピクセルレベルの両方のMLLMに対して一貫した改善をもたらすことが実証されており、MLLMコミュニティ全体に貢献することが期待されます。

## 5. まとめと所感
### 5.1 論文の意義
本研究は、MLLMの詳細な現実世界理解という重要な課題に取り組んだ意義深い論文です。
人手によるアノテーションなしに、100万枚規模の詳細で密にグラウンディングされたキャプションデータセットを構築したことは大きな貢献です。
技術と実用の両面で価値があります。

3段階のアプローチは論理的で効果的であり、複雑なタスクを分解して解決する良い例となっています。
また、計算効率を考慮してDRCとSCMモデルを開発した点も、実用性を重視した優れた設計です。

一方で、データソースが3つのデータセットに限定されている点や、生成されたキャプションの品質評価がやや限定的である点は改善の余地があります。
また、エラーの蓄積や伝播についての詳細な分析があれば、より説得力のある研究となったでしょう。

### 5.2 今後の展望
著者らも述べているように、データソースの多様化が重要な方向性です。
ビデオデータ、合成データ、テキストから画像へのデータセットなど、より多様なデータ形式を含めることで、データセットの価値がさらに高まるでしょう。

データスケールを1000万規模に拡大することも計画されており、これによりMLLMの性能向上がさらに期待できます。

また、ステップバイステップの視覚的推論などのより高度なタスクへの応用も興味深い方向性です。
DenseWorld-1Mの詳細な物体記述と位置情報は、このような複雑なタスクの基盤となる可能性があります。