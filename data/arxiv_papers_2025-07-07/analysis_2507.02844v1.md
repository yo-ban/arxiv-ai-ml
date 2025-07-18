# Visual Contextual Attack: Jailbreaking MLLMs with Image-Driven Context Injection

## 基本情報
- arXiv ID: 2507.02844v1 (https://arxiv.org/abs/2507.02844)
- 著者: Ziqi Miao, Yi Ding, Lijun Li, Jing Shao
- 所属: Shanghai Artificial Intelligence Laboratory, Purdue University
- 投稿日: 2025年07月03日
- カテゴリ: cs.CV, cs.AI, cs.CR

## 簡単に説明すると
この論文は、マルチモーダル大規模言語モデル（MLLM）のセキュリティ脆弱性を研究したものです。具体的には、画像を使って悪意のある文脈を作り出し、MLLMから有害な応答を引き出す新しい攻撃手法「VisCo Attack」を提案しています。従来の攻撃では画像は単なるトリガーでしたが、この研究では画像が攻撃シナリオの必須要素となる「視覚中心型ジェイルブレイク」という新しい設定を定義しています。実験では、GPT-4oやGemini-2.0-Flashなどの最新モデルに対して高い攻撃成功率を達成しました。コードはGitHubで公開されています。https://github.com/Dtc7w3PQ/Visco-Attack

## 1. 研究概要
### 1.1 背景と動機
マルチモーダル大規模言語モデル（MLLM）は、視覚エンコーダーを組み込むことで、視覚と言語の理解を必要とするタスクで顕著な進歩を示しています。しかし、視覚エンコーダーの導入は「両刃の剣」であることが研究で明らかになっています。視覚認識能力を向上させる一方で、言語モデルの基盤に新たな安全性の脆弱性をもたらしています。

従来の攻撃手法では、有害なテキストの意味を視覚入力に直接エンコードするアプローチが取られていました。例えば、FigStepでは画像にタイポグラフィで有害なテキストを埋め込み、MM-SafetyBenchではテキストから画像を生成するモデルを使用して有害な画像を作成していました。しかし、これらの手法では視覚情報は主にトリガーとして機能し、ジェイルブレイクシナリオを定義する本質的な内容を提供していませんでした。

この研究では、より現実的なシナリオで効果的なジェイルブレイクを可能にするため、視覚情報が完全で現実的なジェイルブレイクコンテキストを構築する上で必要不可欠な要素となる新しい設定を提案しています。

### 1.2 主要な貢献
この研究の主な貢献は以下の3点です。

- 視覚中心型ジェイルブレイク設定の提案：視覚情報が完全で現実的なジェイルブレイクシナリオを構築する上で必要不可欠な要素となる新しい設定を初めて提案した。この定式化により、既存のジェイルブレイク攻撃の実世界環境における限界が明らかになった。
- VisCo Attack手法の開発：視覚中心型ジェイルブレイク設定に対応する新しい攻撃手法を提案した。4つの視覚重視戦略を活用して欺瞞的な視覚コンテキストを構築する。さらに、自動的な毒性の隠蔽と意味的洗練プロセスを経て最終的な攻撃シーケンスを生成する。
- 広範な実証評価：複数のベンチマークでの実験により、VisCo Attackの有効性を検証した。GPT-4oとGemini-2.0-Flashに対してそれぞれ4.78と4.88の毒性スコア、85.00%と91.07%の攻撃成功率を達成した。ベースラインと比較して、60ポイント以上の改善を示した。

## 2. 提案手法
### 2.1 手法の概要
VisCo Attack（Visual Contextual Attack）は、画像駆動型のコンテキスト注入戦略を用いた新しい攻撃手法です。この手法は2つの主要な段階から構成されています。第1段階では、強化された視覚情報を活用し、4つの事前定義された視覚重視戦略のいずれかを使用して、欺瞞的なマルチターン会話履歴を構築します。第2段階では、初期攻撃プロンプトを自動的に最適化し、元の有害な意図との意味的整合性を確保しつつ、安全メカニズムを回避するための毒性の難読化を行います。

### 2.2 技術的詳細
攻撃手法は以下の要素で構成されています。

1. 視覚コンテキスト抽出：補助的な視覚言語モデルを使用して、ターゲット画像から有害なクエリに関連する詳細な説明を生成。
2. マルチ戦略コンテキスト生成：4つの視覚重視戦略（画像ベースシナリオシミュレーション、多視点での画像分析、画像反復尋問、画像幻覚の悪用）を用いて欺瞞的なコンテキストを生成。
3. 反復的プロンプト洗練：意味的評価と洗練を通じて、攻撃プロンプトを最適化。検閲されていない言語モデルを使用して意味的逸脱を評価し、意味的逸脱が確認された場合にプロンプトを調整。

### 2.3 新規性
既存手法との主な違いは、視覚情報を単なるトリガーではなく、攻撃シナリオの本質的な構成要素として扱う点にあります。従来の手法では、画像は有害なテキストを隠すためのカモフラージュでした。VisCo Attackでは、画像に含まれる視覚的文脈の活用が攻撃の成功に不可欠です。自動的な毒性難読化と意味的洗練プロセスにより、ブラックボックス設定でも高い成功率を達成します。

## 3. 実験結果
### 3.1 実験設定
評価には複数のMLLMが使用されました。オープンソースモデルとAPIベースのブラックボックスモデルが含まれます。前者にはLLaVA-OV-7B-Chat、InternVL2.5-78B、Qwen2.5-VL-72B-Instructが含まれます。後者にはGPT-4o、GPT-4o-mini、Gemini-2.0-Flashが含まれます。評価は3つの安全性関連ベンチマークで実施されました。MM-SafetyBench、FigStep、HarmBenchが使用されました。

### 3.2 主要な結果
MM-SafetyBenchでの実験では、VisCo Attackは既存のQR Attackを上回る性能を示しました。GPT-4oに対して85.00%の攻撃成功率（ASR）と4.78の毒性スコアを達成し、ベースライン（ASR: 22.20%、毒性スコア: 2.48）と比較して62.80%の改善を示しました。Gemini-2.0-Flashに対しては91.07%のASRと4.88の毒性スコアを達成しました。

### 3.3 既存手法との比較
FigStepベンチマークでの比較では、VisCo Attackは全てのモデルで元のFigStep攻撃を上回りました。特にGPT-4oでは、ASRが12%から76%に向上しました（64ポイントの改善）。これは、VisCo Attackがより洗練された視覚的文脈を構築し、モデルの安全メカニズムを効果的に回避できることを示しています。

## 4. 実用性評価
### 4.1 実装の容易性
実装は比較的容易です。補助モデルとして既存のオープンソースモデルを使用でき、攻撃パイプラインは自動化されています。ただし、4つの戦略テンプレートは手動で設計されており、この点が柔軟性を制限する要因となっています。

### 4.2 計算効率
攻撃生成には複数のモデル呼び出しが必要ですが、各クエリに対して最大5回の試行で高い成功率を達成できます。反復的洗練の最大回数は3回に設定されており、計算コストと効果のバランスが取られています。

### 4.3 応用可能性
この研究は、MLLMの安全性評価とロバスト性テストに重要な知見を提供します。視覚中心型の攻撃は、実世界のアプリケーションにおける潜在的な脆弱性を明らかにし、より強力な防御メカニズムの開発を促進します。

## 5. まとめと所感
### 5.1 論文の意義
この研究は、MLLMのセキュリティ評価において重要な貢献をしています。視覚中心型ジェイルブレイクという新しい脅威モデルを定義し、既存の安全メカニズムの限界を明らかにしました。特に、視覚情報が攻撃の本質的な要素となる現実的なシナリオを考慮することで、より実践的な脆弱性評価が可能になります。

### 5.2 今後の展望
著者らは、手動設計されたテンプレートへの依存を減らし、より動的で適応的なコンテキスト生成技術の開発を今後の課題として挙げています。また、この研究で明らかになった脆弱性に対する防御手法の開発も重要な研究方向です。
