# arXiv論文解説サイト

arXivのAI・機械学習分野の論文を日本語で解説するWebサイトシステム

## 🚀 クイックスタート

### 1. セットアップ

```bash
# リポジトリの初期化
git init
git add .
git commit -m "Initial commit"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/[username]/arxiv-paper-site.git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. Settings → Pages → Source: "GitHub Actions"を選択

### 3. 初回テスト

```bash
# プッシュして自動デプロイ
git push
```

## 📁 プロジェクト構成

```
/                           # リポジトリルート
├── .github/workflows/      # GitHub Actions（自動デプロイ）
├── data/                   # arXiv論文解説データ
│   └── arxiv_papers_YYYY-MM-DD/
│       ├── analysis_*.md   # 論文解説ファイル
│       └── papers_to_analyze.json  # 論文メタデータ
├── src/                    # Webサイトソース
│   ├── _data/             # グローバルデータ
│   ├── _includes/         # テンプレート
│   ├── assets/            # CSS/JS
│   └── *.njk              # ページファイル
├── scripts/               # ビルドスクリプト
├── dist/                  # ビルド出力（自動生成）
└── package.json
```

## 🔄 データ連携

### 論文解説データを追加

```bash
# サイトリポジトリをクローン
git clone https://github.com/[username]/arxiv-paper-site.git
cd arxiv-paper-site

# 解析結果をコピー
cp -r /path/to/arxiv_papers_2025-07-02 data/

# プッシュ（自動でサイトがビルドされます）
git add data/arxiv_papers_2025-07-02
git commit -m "Add arXiv paper analysis for 2025-07-02"
git push
```

### データ形式

#### papers_to_analyze.json
```json
[
  {
    "id": "2506.24119v2",
    "base_id": "2506.24119",
    "title": "論文タイトル",
    "categories": ["cs.AI", "cs.LG"],
    "selection_reason": "選定理由（現在は非表示）"
  }
]
```

#### analysis_*.md
```markdown
# 論文タイトル

## 基本情報
- arXiv ID: 2506.24119v2 (https://arxiv.org/abs/2506.24119v2)
- 著者: 著者名
- 所属: 所属機関
- 投稿日: 2025年6月29日
- カテゴリ: cs.LG, cs.AI

## 簡単に説明すると
論文の概要説明...
```

## 💻 ローカル開発

```bash
# 依存関係インストール
npm install

# データ生成
npm run generate-data

# 開発サーバー起動
npm run serve
# → http://localhost:8080

# 本番ビルド
npm run build
```

## 🎨 カスタマイズ

- **デザイン**: `/src/assets/css/main.css`（アカデミックな配色）
- **テンプレート**: `/src/_includes/layouts/`
- **データ処理**: `/scripts/generate-site-data.js`

## 📋 技術仕様

- **静的サイトジェネレーター**: 11ty (Eleventy)
- **ホスティング**: GitHub Pages  
- **CI/CD**: GitHub Actions
- **スタイル**: アカデミックデザイン（深い青と緑のアクセント）
- **機能**: 
  - 最新論文解説の表示
  - アーカイブ（ページネーション付き）
  - カテゴリ別統計

## 🔧 トラブルシューティング

### ビルドが失敗する
- Actions タブでエラーログを確認
- ローカルで `npm run build` を実行してエラーを確認

### ページが表示されない
- Settings → Pages で GitHub Actions が選択されているか確認
- URLが正しいか確認: `https://[username].github.io/[repository-name]/`

## ⚠️ 免責事項

このサイトのコンテンツは大規模言語モデルによって生成されており、正確性は保証されません。

## 📝 開発者向け情報

詳細な技術情報は [DEVELOPMENT.md](DEVELOPMENT.md) を参照してください。