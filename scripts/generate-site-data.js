const fs = require('fs').promises;
const path = require('path');

/**
 * arXiv論文の解析結果から11ty用のデータを生成
 */
async function generateSiteData() {
    const siteRoot = path.join(__dirname, '..');
    const dataDir = path.join(siteRoot, 'data');
    
    // data/arxiv_papers_YYYY-MM-DD ディレクトリを検索
    const dirs = await fs.readdir(dataDir);
    const paperDirs = dirs.filter(d => d.startsWith('arxiv_papers_')).sort().reverse();
    
    if (paperDirs.length === 0) {
        console.log('論文データが見つかりません');
        return;
    }
    
    const allPapers = [];
    
    // 各ディレクトリのデータを処理
    for (const dir of paperDirs) {
        const date = dir.replace('arxiv_papers_', '');
        const papersPath = path.join(dataDir, dir);
        
        try {
            // papers_to_analyze.jsonを読み込む
            const metadataPath = path.join(papersPath, 'papers_to_analyze.json');
            let metadata = [];
            try {
                const metadataContent = await fs.readFile(metadataPath, 'utf-8');
                metadata = JSON.parse(metadataContent);
            } catch (e) {
                console.log(`${dir}にメタデータファイルがありません`);
            }
            
            // その日の論文解析ファイルを読み込み
            const files = await fs.readdir(papersPath);
            const analysisFiles = files.filter(f => f.startsWith('analysis_') && f.endsWith('.md'));
            
            for (const file of analysisFiles) {
                const content = await fs.readFile(path.join(papersPath, file), 'utf-8');
                const paperData = parsePaperMarkdown(content, file, metadata, date);
                if (paperData) {
                    allPapers.push(paperData);
                    // 各論文の詳細ページを生成
                    try {
                        await generatePaperPage(paperData, siteRoot);
                    } catch (genError) {
                        console.error(`ページ生成エラー (${file}):`, genError.message);
                        console.error('Paper data:', JSON.stringify(paperData, null, 2));
                    }
                }
            }
            
        } catch (error) {
            console.error(`${dir} の処理中にエラー: ${error.message}`);
        }
    }
    
    // グローバルデータファイルを生成
    await generateGlobalData(allPapers, siteRoot);
}

/**
 * 論文のMarkdownを解析
 */
function parsePaperMarkdown(content, filename, metadata, date) {
    const paper = {
        id: filename.replace('analysis_', '').replace('.md', ''),
        date: date,
        content: content
    };
    
    // タイトルを抽出
    const titleMatch = content.match(/^# (.+)$/m);
    if (titleMatch) {
        paper.title = titleMatch[1];
    }
    
    // arXiv IDを抽出（括弧内のURL形式にも対応）
    const arxivIdMatch = content.match(/arXiv ID: ([\w\.]+)(?:\s*\(https:\/\/arxiv\.org\/abs\/([\w\.]+)\))?/);
    if (arxivIdMatch) {
        paper.arxivId = arxivIdMatch[1];
        paper.arxivUrl = `https://arxiv.org/abs/${arxivIdMatch[1]}`;
    }
    
    // 著者を抽出（複数行対応）
    const authorsMatch = content.match(/著者:\s*\n([\s\S]*?)(?=\n- 所属:|$)/m);
    if (authorsMatch) {
        paper.authors = authorsMatch[1].trim().replace(/\s*\n\s*/g, ' ');
    } else {
        // 単一行の場合
        const singleLineAuthorsMatch = content.match(/著者: (.+)/);
        if (singleLineAuthorsMatch) {
            paper.authors = singleLineAuthorsMatch[1];
        }
    }
    
    // 所属を抽出
    const affiliationMatch = content.match(/所属: (.+)/);
    if (affiliationMatch) {
        paper.affiliations = affiliationMatch[1];
    }
    
    // 投稿日を抽出
    const submittedMatch = content.match(/投稿日: (.+)/);
    if (submittedMatch) {
        paper.submittedDate = submittedMatch[1];
    }
    
    // カテゴリを抽出
    const categoriesMatch = content.match(/カテゴリ: (.+)/);
    if (categoriesMatch) {
        paper.categories = categoriesMatch[1].split(/[,、]\s*/);
    }
    
    // 「簡単に説明すると」セクションを抽出
    const summaryMatch = content.match(/## 簡単に説明すると\r?\n+(.+?)(?=\r?\n##|\r?\n*$)/s);
    if (summaryMatch) {
        paper.summary = summaryMatch[1].trim();
    }
    
    // メタデータから選択理由を追加
    // バージョン番号の有無に対応するため、base_idでも検索
    const baseId = paper.id.replace(/v\d+$/, '');
    const metaPaper = metadata.find(m => {
        // 完全一致をまず試す
        if (m.id === paper.id) return true;
        // base_idで比較
        if (m.base_id === baseId) return true;
        // ファイル名がバージョンなしで、メタデータがバージョンありの場合
        if (m.id.startsWith(baseId) && m.id.match(/v\d+$/)) return true;
        return false;
    });
    if (metaPaper) {
        paper.selectionReason = metaPaper.selection_reason;
        // メタデータのIDを使用してページを生成
        paper.id = metaPaper.id;
    }
    
    return paper;
}

/**
 * 論文詳細ページを生成
 */
async function generatePaperPage(paper, siteRoot) {
    const paperDir = path.join(siteRoot, 'src', 'papers', paper.id);
    await fs.mkdir(paperDir, { recursive: true });
    
    const frontmatter = {
        layout: 'paper.njk',
        title: paper.title,
        paper: {
            id: paper.id,
            arxivId: paper.arxivId,
            arxivUrl: paper.arxivUrl,
            title: paper.title,
            authors: paper.authors,
            affiliations: paper.affiliations,
            submittedDate: paper.submittedDate,
            categories: paper.categories || [],
            summary: paper.summary,
            selectionReason: paper.selectionReason,
            date: paper.date
        },
        tags: ['paper'].concat(paper.categories || [])
    };
    
    const yamlCategories = frontmatter.paper.categories.length > 0 
        ? frontmatter.paper.categories.map(c => `    - "${c.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join('\n')
        : '    []';
    
    const yamlTags = frontmatter.tags.map(tag => `  - ${tag}`).join('\n');
    
    const content = `---
layout: ${frontmatter.layout}
title: "${(frontmatter.title || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
paper:
  id: "${frontmatter.paper.id}"
  arxivId: "${frontmatter.paper.arxivId || ''}"
  arxivUrl: "${frontmatter.paper.arxivUrl || ''}"
  title: "${(frontmatter.paper.title || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
  authors: "${(frontmatter.paper.authors || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
  affiliations: "${(frontmatter.paper.affiliations || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
  submittedDate: "${frontmatter.paper.submittedDate || ''}"
  categories:
${yamlCategories}
  summary: "${(frontmatter.paper.summary || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
  selectionReason: "${frontmatter.paper.selectionReason ? frontmatter.paper.selectionReason.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : ''}"
  date: "${frontmatter.paper.date}"
tags:
${yamlTags}
---

${paper.content}`;
    
    await fs.writeFile(path.join(paperDir, 'index.md'), content);
}

/**
 * グローバルデータを生成
 */
async function generateGlobalData(allPapers, siteRoot) {
    const eleventyDataDir = path.join(siteRoot, 'src', '_data');
    await fs.mkdir(eleventyDataDir, { recursive: true });
    
    // 論文データをソート（新しい順）
    const sortedPapers = allPapers.sort((a, b) => {
        if (a.date !== b.date) {
            return b.date.localeCompare(a.date);
        }
        return b.id.localeCompare(a.id);
    });
    
    // カテゴリ別の統計を集計
    const categoryStats = {};
    allPapers.forEach(paper => {
        if (paper.categories) {
            paper.categories.forEach(cat => {
                categoryStats[cat] = (categoryStats[cat] || 0) + 1;
            });
        }
    });
    
    const papersData = {
        papers: sortedPapers.map(p => ({
            id: p.id,
            arxivId: p.arxivId,
            arxivUrl: p.arxivUrl,
            title: p.title,
            authors: p.authors,
            categories: p.categories,
            summary: p.summary,
            selectionReason: p.selectionReason,
            date: p.date
        })),
        totalCount: sortedPapers.length,
        categoryStats: categoryStats,
        lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(
        path.join(eleventyDataDir, 'papers.json'),
        JSON.stringify(papersData, null, 2)
    );
}

// 実行
if (require.main === module) {
    generateSiteData()
        .then(() => console.log('サイトデータの生成が完了しました'))
        .catch(error => {
            console.error('エラーが発生しました:', error);
            process.exit(1);
        });
}

module.exports = { generateSiteData };