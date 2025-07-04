const eleventyPluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // プラグイン
  eleventyConfig.addPlugin(eleventyPluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // 静的ファイルのコピー
  eleventyConfig.addPassthroughCopy("src/assets");

  // 日付フォーマットフィルター
  eleventyConfig.addFilter("dateFormat", (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  });

  // スラッグ生成フィルター
  eleventyConfig.addFilter("slugify", (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  // 数値フォーマットフィルター
  eleventyConfig.addFilter("numberFormat", (num) => {
    return num?.toLocaleString() || '0';
  });

  // 日時フォーマットフィルター
  eleventyConfig.addFilter("dateTime", (date) => {
    const d = new Date(date);
    return d.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // テキスト切り詰めフィルター
  eleventyConfig.addFilter("truncate", (str, length) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  });

  // 配列の件数制限フィルター
  eleventyConfig.addFilter("limit", (array, limit) => {
    if (!array) return [];
    return array.slice(0, limit);
  });

  // 日付をISO文字列に変換
  eleventyConfig.addFilter("toISOString", (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    if (dateStr === "now") return new Date().toISOString();
    return new Date(dateStr).toISOString();
  });


  // 論文コレクション
  eleventyConfig.addCollection("papersByCategory", function(collectionApi) {
    const papers = collectionApi.getFilteredByTag("paper");
    const grouped = {};
    
    papers.forEach(item => {
      if (item.data.paper && item.data.paper.categories) {
        item.data.paper.categories.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(item);
        });
      }
    });
    
    return grouped;
  });

  // Markdownのレンダリング設定
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false
  });
  
  eleventyConfig.setLibrary("md", md);

  // .gitignoreの設定を無視する（生成されたコンテンツも処理するため）
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: process.env.PATH_PREFIX || ""
  };
};