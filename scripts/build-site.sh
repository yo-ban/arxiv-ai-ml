#!/bin/bash

# GitHub Daily Trends サイトビルドスクリプト

set -e

echo "======================================"
echo "GitHub Daily Trends サイトビルド開始"
echo "======================================"

# スクリプトのディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SITE_DIR="$(dirname "$SCRIPT_DIR")"

cd "$SITE_DIR"

# 1. 依存関係のインストール
echo "1. 依存関係をインストール中..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 2. データ生成
echo "2. サイトデータを生成中..."
node scripts/generate-site-data.js

# 3. ビルド前のクリーンアップ
echo "3. 古いビルドファイルを削除中..."
rm -rf dist

# 4. 11tyでビルド
echo "4. 11tyでサイトをビルド中..."
npm run build

# 5. ビルド結果の確認
if [ -d "dist" ]; then
    echo "✅ ビルド成功！"
    echo "ビルドファイル: $SITE_DIR/dist"
    
    # ファイル数を表示
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "生成されたファイル数: $FILE_COUNT"
else
    echo "❌ ビルド失敗！"
    exit 1
fi

echo "======================================"
echo "ビルド完了"
echo "======================================"