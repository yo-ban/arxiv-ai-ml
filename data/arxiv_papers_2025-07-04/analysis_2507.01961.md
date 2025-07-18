# AC-DiT: Adaptive Coordination Diffusion Transformer for Mobile Manipulation

## 基本情報
- arXiv ID: 2507.01961v1 (https://arxiv.org/abs/2507.01961)
- 著者: Sixiang Chen、Jiaming Liu、Siyuan Qian、Han Jiang、Lily Li、Renrui Zhang、Zhuoyang Liu、Chenyang Gu、Chengkai Hou、Pengwei Wang、Zhongyuan Wang、Shanghang Zhang
- 所属: Peking University, Nanjing University, CUHK,
  Beijing Academy of Artificial Intelligence (BAAI)
- 投稿日: 2025年7月2日
- カテゴリ: cs.RO

## 簡単に説明すると
この論文は、移動ロボットが物を掴んだり運んだりする作業（モバイルマニピュレーション）を改善する新しいAIシステム「AC-DiT」を提案しています。
このシステムの特徴は、ロボットの移動台（ベース）とロボットアーム（マニピュレータ）の動きをより良く連携させる仕組みです。
さらに、作業の各段階で必要な視覚情報（2D画像と3D点群）を自動的に切り替える仕組みも持っています。

例えば、ロボットがテーブルの上のリンゴを取る作業では、段階に応じて使用する情報が異なります。
部屋の中を移動してテーブルに近づく段階では2D画像（カメラ映像）を重視して物体を見つけます。
実際にリンゴを掴む段階では3D情報（奥行き情報）を重視して正確な位置を把握します。
また、移動台が動くことによってアームの位置も変わるため、その影響を事前に予測してより正確な動作を実現しています。

## 1. 研究概要
### 1.1 背景と動機
モバイルマニピュレーションは、移動可能なロボットプラットフォームに操作能力を統合する技術です。
自然言語による指示の下で複雑な家庭内タスクを実行する技術として注目を集めています。
この分野では、タスクプランナー（VLMsやLLMs）を使用して長期的なタスクをサブタスクに分解する2段階アプローチが存在します。
また、模倣学習や強化学習を用いて移動ベースとマニピュレータの制御を共同で最適化するエンドツーエンドの手法も提案されています。

しかし、既存の手法は2つの主要な課題に直面しています。
第一に、移動ベースがマニピュレータ制御に与える影響を明示的にモデル化できていません。
そのため、高自由度のシステムでエラーが蓄積しやすいという問題があります。
第二に、モバイルマニピュレーションプロセス全体で同じ視覚観測モダリティ（2Dまたは3D）を使用しています。
これにより、異なる段階での異なるマルチモーダル知覚要件を見落としています。

### 1.2 主要な貢献
本研究では、以下の3つの主要な貢献をしています。
- Adaptive Coordination Diffusion Transformer (AC-DiT)という新しいエンドツーエンドフレームワークを提案する。
  このフレームワークは移動ベースとマニピュレータ間の関係を明示的にモデル化し、異なる段階での視覚知覚要件に適応する
- mobility-to-body conditioning mechanismを導入する。
  これは潜在的な移動性表現に基づいて全身の動作を条件付けることで、協調性を向上させ累積エラーを削減する
- perception-aware multimodal adaptation mechanismを設計する。
  これは各段階の知覚要件を満たすため、異なる視覚入力へ適応的に重要度の重みを割り当てる

## 2. 提案手法
### 2.1 手法の概要
AC-DiTは、2D画像、3D点群、言語入力から特徴を抽出するための画像エンコーダ、3Dエンコーダ、テキストエンコーダで構成されています。
システムは、過去の観測履歴と言語条件から将来のアクション系列を予測する時系列の予測問題として定式化されています。

観測データには以下が含まれます。
3つのカメラビュー（外部カメラ、左手首カメラ、右手首カメラ）からの2D画像、点群データ、ロボットの状態、制御周波数です。
ロボットの状態には移動ベースの線速度・角速度、マニピュレータの関節位置が含まれます。
予測されるアクションは、移動ベースの制御（線速度・角速度）とマニピュレータの制御（関節位置）から成ります。

### 2.2 技術的詳細
AC-DiTの核心となる技術は2つのメカニズムにあります。

Mobility-to-Body Conditioning機構では、まず軽量なmobility policy head（1.7億パラメータのDiTブロック）を事前学習します。
これにより、移動ベースの動作表現を抽出する潜在的な移動性特徴を学習します。
この特徴は、その後の全身動作予測のための条件付き入力として使用されます。
具体的には、最終的なDiTブロックから出力されるアクショントークンを5つのデノイジングタイムステップで収集します。
それらを連結して潜在的な移動性特徴を形成します。

Perception-Aware Multimodal Adaptation機構では、言語特徴と各視覚モダリティ（2D画像と3D点群）間のコサイン類似度を計算します。
これにより、現在の段階での各モダリティの重要度を動的に決定します。
MLPプロジェクタを使用して各モダリティの特徴を共有潜在空間に投影し、言語特徴との類似度に基づいて重み付けします。

### 2.3 新規性
既存手法との主な違いは、移動ベースとマニピュレータ間の協調関係を明示的にモデル化している点と、タスクの各段階で必要とされる知覚モダリティを動的に選択できる点にあります。

従来の手法は単一モダリティ（2Dまたは3D）に依存し、移動と操作の運動学的・動的な相互依存性を見落としていました。
AC-DiTは、移動ベースの動きがマニピュレータへ与える影響を事前に考慮します。
さらに、各段階で最も効果的な視覚情報を選択することで、より正確で協調的な制御を実現しています。

## 3. 実験結果
### 3.1 実験設定
実験は、シミュレーション環境（ManiSkill-HABとRoboTwin）と実世界環境の両方で実施されました。

ManiSkill-HABでは、Set-Tableシナリオの7つのタスクを評価しました。
タスクには以下が含まれます。
リンゴを取る・置く、ボウルを取る・置く、冷蔵庫を開ける、キッチンカウンターを開ける・閉める。
各タスクについて1000の成功デモンストレーションを生成しました。
これらは強化学習アルゴリズム（PPOとSAC）で訓練されたエージェントから収集しました。

実世界実験では、Agilex Cobot Magicプラットフォーム（4つのAgilex Piperアームと移動ベース）を使用し、4つの長期的なモバイルマニピュレーションタスクを実施しました。

### 3.2 主要な結果
ManiSkill-HABでの実験結果では、AC-DiTは平均成功率48.7%を達成し、すべてのベースラインを上回りました。
特に「冷蔵庫に行ってドアを開ける」タスク（90.7%）と「カウンターに行って引き出しを閉める」タスク（97.3%）で高い性能を示しました。

比較対象のDiffusion Policy（DP）と3D Diffusion Policy（3DP）は、ほとんどのタスクで相対的に低い性能を示しました。
特に3DPは、ナビゲーション中の大規模なシーンレベルの点群処理に苦労しました。
その結果、目標領域への正確な接近と対象物体との相互作用が困難でした。

RoboTwinでの両腕操作実験でも、AC-DiTはすべてのタスクで最も良い結果を達成しました。
これにより、提案手法が両腕タスクにも効果的に拡張できることを示しました。

### 3.3 既存手法との比較
実世界実験では、ACT（bimanual mobile manipulation用）とπ0（vision-language-actionモデル）と比較しました。
AC-DiTは、すべてのタスクで最も高い成功率を達成し、実世界でのモバイル両腕操作能力を実証しました。

アブレーション研究では、各コンポーネントの効果を検証しました。
2D入力のみを使用したベースライン（37.5%）から始まり、2Dと3Dの両方を使用すると44.8%に向上しました。
Mobility-to-Body Conditioningを追加すると47.0%になりました。
さらにPerception-Aware Multimodal Adaptationを追加した完全なモデルでは49.0%を達成しました。
これにより、各コンポーネントが段階的に性能を向上させることを確認しました。

## 4. 実用性評価
### 4.1 実装の容易性
AC-DiTは、既存のSigLIPモデルをバックボーンとして使用し、標準的なDiffusion Transformerアーキテクチャに基づいているため、実装は比較的容易です。提案されたメカニズムは軽量なモジュールとして追加されており、既存のロボティクスフレームワークに統合しやすい設計となっています。

ただし、3D点群処理のためのLift3D手法の実装や、複数のカメラビューの統合など、一定の技術的な複雑さは存在します。

### 4.2 計算効率
軽量なmobility policy head（1.7億パラメータ）の使用により、計算コストを抑えながら効果的な協調制御を実現しています。事前学習されたSigLIPエンコーダを活用することで、学習時間も短縮されています。

ただし、複数のモダリティ（2D画像3ビュー、3D点群、言語）を処理する必要があるため、推論時には一定の計算リソースが必要です。
リアルタイム制御（30fps）を達成するためには、GPUなどのハードウェアアクセラレーションが推奨されます。

### 4.3 応用可能性
提案手法は、家庭内タスクだけでなく、倉庫自動化、介護ロボット、サービスロボットなど、移動と操作の協調が必要な幅広い応用分野に適用可能です。

特に、perception-aware multimodal adaptation機構は自動的に知覚モダリティを調整できます。
これにより、環境や作業内容に応じた頑健な動作が期待できます。また、両腕操作への拡張も実証されており、より複雑なタスクへの適用も可能です。

## 5. まとめと所感
### 5.1 論文の意義
この研究は、モバイルマニピュレーションにおける2つの重要な課題に対して革新的な解決策を提示しています。
移動ベースとマニピュレータの協調関係を明示的にモデル化する能力は重要な進歩です。
さらに、タスクの各段階で最も効果的な知覚モダリティを選択する能力も、実用的なロボットシステムの開発において重要です。

実験結果は、提案手法が既存手法を上回る性能を達成できることを示しています。
特に長期的で複雑なタスクにおいて顕著な改善が見られます。
実世界での成功も、この技術の実用性を裏付けています。

### 5.2 今後の展望
今後の改善点として、以下が考えられます。
まず、模倣学習に基づく手法であるため、データの質と量に依存します。
また、最適でないデモンストレーションの影響を受けやすいという制限があります。
この問題に対しては、強化学習との組み合わせが有効です。
さらに、少数サンプルで高品質な学習が可能なデータ収集方法の開発も期待されます。

現在の実装では特定のロボットプラットフォームに最適化されています。
そのため、異なるロボット構成への汎化性を向上させる研究も重要です。
さらに、より複雑な環境での動作や人間との協調作業への拡張も、興味深い研究方向となるでしょう。