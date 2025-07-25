# PhysX: Physical-Grounded 3D Asset Generation

## 基本情報
- **arXiv ID**: 2507.12465v1 (https://arxiv.org/abs/2507.12465)
- **著者**: Ziang Cao, Zhaoxi Chen, Liang Pan, Ziwei Liu
- **所属**: Nanyang Technological University, Shanghai AI Lab
- **投稿日**: 2025年07月17日
- **カテゴリ**: cs.CV, cs.AI

## 簡単に説明すると
この論文は、物理的特性を考慮した3Dアセット生成のためのエンドツーエンドパラダイム「PhysX」を提案しています。既存の3D生成技術は主に幾何学的形状とテクスチャに焦点を当てており、物理的特性を軽視してきました。これにより、生成された3Dアセットは、シミュレーションやロボティクスなどの物理的領域での実用性が制限されていました。

PhysXは2つの主要コンポーネントから構成されています。第一に、物理特性を体系的にアノテーションした初の3Dデータセット「PhysXNet」です。このデータセットには26,000以上の3Dオブジェクトが含まれ、絶対スケール、材質、アフォーダンス、キネマティクス、機能記述という5つの基本的な次元でアノテーションされています。第二に、事前学習済みの3D構造空間に物理的知識を注入する「PhysXGen」というフィードフォワードフレームワークです。

特に注目すべきは、人間参加型のアノテーションパイプラインです。このパイプラインは、GPT-4oなどの視覚言語モデルを活用し、既存の幾何学的3Dデータセットを効率的に物理アノテーション付きリソースに変換します。また、PhysXGenは二分岐アーキテクチャを採用し、3D構造と物理特性間の潜在的相関を明示的にモデル化します。これにより、生成される3Dアセットは物理的に妥当な予測を持ちながら、元の幾何学的品質を保持できます。さらに、手続き的に生成された600万以上の3Dオブジェクトを含む拡張版「PhysXNet-XL」も提供されています。プロジェクトページ（https://physx-3d.github.io/）でより詳細な情報が公開されています。

## 1. 研究概要
### 1.1 背景と動機
3Dアセットの作成は、ゲーム、ロボティクス、具現化シミュレータなどの応用拡大により、近年大きな注目を集めています。しかし、既存の研究の多くは外観と幾何学のみに焦点を当てており、実世界のオブジェクトに固有の物理的特性を見過ごしています。ShapeNet、Objaverse、OmniObject3Dなどの高品質な3Dデータセットから効率的な3D表現、生成モデリングまで、構造的特性に重点が置かれてきました。

実世界のオブジェクトは、幾何学と外観という純粋に構造的な属性を超えて、豊かな物理的・意味的特性を本質的に持っています。これらの基本的な特性と古典的な物理原理を統合することで、重力効果、摩擦力、接触領域、運動軌跡、相互作用などの重要な動的メトリクスを導出できます。しかし、既存のデータセットやアノテーションパイプラインは、3Dオブジェクトの物理的に根拠のある知識の全範囲をカバーする部分的な解決策しか提供していません。

PartNet-Mobilityのような関節式オブジェクトアプリケーションをサポートする最近の取り組みは、2,700の人間がアノテーションした関節式3Dモデルを提供しています。しかし、このコレクションには、物理的に正確なシミュレーションやロボティクスアプリケーションに不可欠な寸法仕様、材料組成、機能的アフォーダンスなどの重要な物理的記述子が欠けています。

### 1.2 主要な貢献
この論文の主要な貢献は以下の3点にまとめられます。

第一に、物理的に根拠のある3Dアセット生成のための初のエンドツーエンドパラダイムを開拓しました。これにより、物理的に根拠のあるコンテンツ作成の研究フロンティアを前進させ、シミュレーションにおける下流アプリケーションの新しい可能性を解き放ちます。

第二に、初の物理的に根拠のある3Dデータセット「PhysXNet」を構築し、既存の幾何学中心のデータセットを効率的かつ堅牢に細粒度の物理アノテーション付き3Dデータセットに変換する人間参加型アノテーションパイプラインを提案しました。さらに、手続き的方法で生成された600万以上のアノテーション付き3Dオブジェクトを含む拡張版「PhysXNet-XL」も提示しています。

第三に、二分岐フィードフォワードフレームワーク「PhysXGen」を設計しました。これは構造的特徴と物理的特徴間の潜在的相互依存性をモデル化し、元の幾何学的品質を維持しながら妥当な物理的予測を達成できます。

- 物理的に根拠のある3Dアセット生成の新パラダイムの確立
- 効率的な人間参加型アノテーションパイプラインと大規模データセットの構築
- 構造と物理の相関をモデル化する革新的な生成フレームワーク

## 2. 提案手法
### 2.1 手法の概要
PhysXは、物理的に根拠のある3Dアセット生成のためのエンドツーエンドソリューションです。これは2つの主要コンポーネントから構成されています。

第一のコンポーネントは「PhysXNet」データセットです。これは26,000以上の豊富にアノテーションされた3Dオブジェクトを含む、初の包括的な物理3Dデータセットです。各オブジェクトは5つの基本的な次元でアノテーションされています。
1. 絶対スケール（オブジェクトレベル）
2. 材質（パートレベル：材料名、ヤング率、ポアソン比、密度）
3. アフォーダンス（全パートのアフォーダンスランク）
4. キネマティクス（運動範囲、運動方向、子パート、親パートを含む詳細パラメータ）
5. 機能記述（基本、機能、運動学的記述）

第二のコンポーネントは「PhysXGen」生成モデルです。これは物理的3Dアセットのためのフィードフォワード生成モデルで、事前学習済みの3D生成プライアを再利用して物理的3Dアセットを生成します。物理的特性が幾何学と外観に空間的に関連しているという事実を利用し、効率的な訓練と合理的な汎化性を実現します。

### 2.2 技術的詳細
PhysXNetの構築では、効率的で堅牢かつスケーラブルなラベリングパイプラインを導入しています。人間参加型アノテーションパイプラインは3段階で進行します。

第一段階は「ターゲット視覚的分離」です。アルファ合成を介して各コンポーネントをレンダリングし、視覚的干渉を最小限に抑えた最適な視覚プロンプトを取得します。

第二段階は「自動VLMラベリング」です。大規模視覚言語モデル（VLM）を使用して、ほとんどの特性をアノテーションします。

第三段階は「専門家による改良」です。体系的なスポットチェックと複雑な運動学的動作の焦点を絞った人間のアノテーションを組み合わせます。

PhysXGenフレームワークは、物理的3D VAEエンコーディング・デコーディングと物理的潜在生成の2つの主要部分から構成されます。

物理的3D VAEでは、物理的特性間の相互依存性を考慮し、統一された潜在空間にエンコードします。4つの物理的特性を採用しています。
- 物理的スケーリング（物理的次元から変換）
- アフォーダンス優先度
- 密度
- 運動学的パラメータ（子・親グループインデックス、運動方向、運動位置、運動範囲、運動学的タイプを含む）

機能記述については、CLIPモデルを採用してテキスト埋め込みを取得します。構造ブランチはDINOv2を採用して特徴を抽出します。物理的潜在表現と構造的潜在表現は、それぞれのエンコーダによって計算されます。

物理的潜在生成では、圧縮された物理的潜在表現を取得した後、トランスフォーマーアーキテクチャの拡散モデルを構築して、物理的属性と構造的属性を共同で生成します。事前学習済みコンポーネントとの互換性を維持しながら、物理的特性と構造的特徴間の固有の相関を効果的に活用するため、残差接続を介して構造的ガイダンスを統合する二分岐アーキテクチャを実装します。

### 2.3 新規性
PhysXの新規性は、以下の点にあります。

第一に、物理的に根拠のある3Dアセット生成という新しいタスクを定義し、そのためのエンドツーエンドパラダイムを初めて提案している点です。これは、従来の幾何学と外観のみに焦点を当てた3D生成とは根本的に異なるアプローチです。

第二に、スケーラブルな人間参加型アノテーションパイプラインの設計です。このパイプラインは、視覚言語モデルを活用して自動化と人間の専門知識を効果的に組み合わせ、既存の3Dデータセットを物理アノテーション付きリソースに効率的に変換できます。

第三に、二分岐アーキテクチャによる構造と物理の相関モデリングです。PhysXGenは、事前学習済みの3D構造空間を活用しながら、物理的特性を同時に生成できる革新的なフレームワークを提供します。これにより、物理的に妥当な予測を行いながら、高品質な幾何学的構造を維持できます。

## 3. 実験結果
### 3.1 実験設定
実験では、PhysXNetデータセットを24,000の訓練サンプル、1,000の検証サンプル、1,000のテストケースに分割しました。テストケースのパフォーマンスを分析することで、手法の汎化能力を評価できます。

VAEと拡散モデルの訓練中は、初期学習率1×10^-4のAdamWを採用してモデルを最適化しました。手法における幾何学的構成と物理的特性間の固有の相関により、3D表現の構造的忠実性が最終的な生成パフォーマンスに影響を与える重要な依存関係が生まれます。この論文では、TRELLISの幾何学と外観に富んだ構造空間を再利用しています。PhysXGenは8つのNVIDIA A100 GPUで訓練されました。

評価メトリクスは、物理的特性評価と幾何学評価の2種類を使用しています。物理的特性評価では、5つのコア属性（絶対スケール、材質、アフォーダンス、キネマティクス、機能記述子）を対象とし、ユークリッド距離ベースの評価パラダイムを実装しています。幾何学評価では、外観評価のためにランダムに30視点をサンプリングして平均PSNRを計算し、幾何学の品質評価のためにChamfer Distance（CD）とF-scoreを計算しています。

### 3.2 主要な結果
定量的評価の結果、PhysXGenは複数の評価指標でベースライン手法を上回る性能を示しました。

TRELLISのみの場合と比較して、PhysXGenは以下の改善を達成しました。
- PSNR：24.31から24.53に向上
- Chamfer Distance：13.2から12.7に減少（改善）
- F-Score：76.9から77.3に向上

物理的特性の生成においても、独立した物理特性予測器（TRELLIS + PhysPre）と比較して大幅な改善を示しました。
- 絶対スケール誤差：12.46から6.63に減少（47%改善）
- 材質誤差：0.262から0.141に減少（46%改善）
- アフォーダンス誤差：0.435から0.372に減少（14%改善）
- キネマティクスパラメータ誤差：0.589から0.479に減少（19%改善）
- 機能記述誤差：1.01から0.71に減少（30%改善）

これらの結果は、PhysXGenが物理的特性と事前定義された3D構造空間間の相関を活用することで、物理的特性生成において大幅な改善をもたらしながら、美的品質も向上させることを示しています。

### 3.3 既存手法との比較
アブレーション研究では、フレームワークのコア設計である幾何学と物理の3Dモデリングにおける統合の有効性を検証しました。

依存VAE（Dep-VAE）と依存拡散（Dep-Diff）の効果を分析した結果、以下のことが明らかになりました。
- 拡散モデルに幾何学と外観の特徴を導入することで、独立モデル（PhysPre）と比較して物理生成の改善が得られます
- VAEにおける幾何学と物理の相関が、生成されたアセットの幾何学を向上させます
- 二重アーキテクチャと共同訓練に依存することで、PhysXGenはすべての物理的特性生成において印象的なパフォーマンスを達成します

定性的評価では、PhysXGenが異なるパートの特性を区別でき、隣接構造の物理的特性生成においてより安定で堅牢なパフォーマンスを達成することが示されました。特に機能記述とアフォーダンスにおいて顕著な改善が見られました。

## 4. 実用性評価
### 4.1 実装の容易性
PhysXの実装は比較的簡単で、既存の3D生成フレームワークに容易に統合できます。人間参加型アノテーションパイプラインは、GPT-4oなどの既存の視覚言語モデルを活用し、特別なハードウェアや高価な外部APIへのアクセスを必要としません。

PhysXGenフレームワークは、事前学習済みの3D生成モデル（TRELLIS）を基盤として使用し、物理的特性のための追加ブランチを追加する設計となっています。これにより、ゼロから訓練する必要がなく、既存の高品質な3D生成能力を活用できます。

### 4.2 計算効率
PhysXNetデータセットの構築において、人間参加型アノテーションパイプラインは効率性を重視して設計されています。視覚言語モデルによる自動アノテーションと人間の専門家による検証を組み合わせることで、大規模なデータセットを効率的に構築できます。

PhysXGenの訓練は8つのNVIDIA A100 GPUで実行され、26,000のデータセットでも効果的な学習が可能です。推論時には、物理的特性と幾何学的構造を同時に生成できるため、別々のモデルを使用する場合と比較して効率的です。

### 4.3 応用可能性
PhysXは、様々な分野での応用が期待されます。

第一に、ロボティクスとシミュレーションにおいて、物理的に正確な3Dアセットは、より現実的なシミュレーション環境の構築を可能にします。生成されたアセットは、絶対スケール、材質特性、キネマティクスなどの物理的特性を持つため、物理シミュレータで直接使用できます。

第二に、具現化AIにおいて、アフォーダンスや機能記述などの情報は、エージェントがオブジェクトとどのように相互作用すべきかを理解するのに役立ちます。

第三に、ゲーム開発やバーチャルリアリティにおいて、物理的に妥当な3Dアセットは、より没入感のある体験を提供できます。

さらに、PhysXNet-XLのような手続き的生成による拡張は、大規模なデータセットが必要なアプリケーションに対応できることを示しています。

## 5. まとめと所感
### 5.1 論文の意義
この論文は、3D生成研究において重要なパラダイムシフトを提示しています。従来の研究が幾何学と外観のみに焦点を当てていたのに対し、PhysXは物理的特性を考慮した3Dアセット生成という新しい方向性を開拓しました。

特に重要なのは、この研究が単なる理論的提案に留まらず、実用的なデータセットとフレームワークを提供している点です。26,000以上のアノテーション付き3Dオブジェクトを含むPhysXNetデータセットは、今後の研究の基盤となる貴重なリソースです。

また、人間参加型アノテーションパイプラインの設計は、既存の3Dデータセットを物理アノテーション付きリソースに変換する実用的な方法を提供しています。これにより、他の研究者も同様のアプローチで独自のデータセットを構築できる可能性があります。

### 5.2 今後の展望
論文では、現在のフレームワークが細粒度の特性学習において限界があり、アーティファクトに苦しんでいることが述べられています。今後の研究では、これらの問題に対処することが重要です。

具体的な将来の方向性として、合成データから実データまでより多くの3Dデータを含めてデータセットの多様性を向上させること、材料の挙動と動きをより良くシミュレートするために追加の物理的特性と運動学的タイプを統合することが挙げられています。

また、この研究は、具現化AI、ロボティクス、3Dビジョンなど、さまざまなコミュニティからの研究注目を集めることが期待されます。物理的に根拠のある3Dアセット生成は、これらの分野における新しい応用と研究方向を開く可能性があります。