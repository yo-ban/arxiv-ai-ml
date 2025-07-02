module.exports = {
  // 論文の総数を計算
  paperCount: async (data) => {
    if (data.papers && data.papers.papers) {
      return data.papers.papers.length;
    }
    return 0;
  },
  
  // 最新の論文
  latestPapers: async (data) => {
    if (data.papers && data.papers.papers) {
      return data.papers.papers.slice(0, 5);
    }
    return [];
  },
  
  // カテゴリごとの論文数
  categoryStats: async (data) => {
    if (data.papers && data.papers.categoryStats) {
      return data.papers.categoryStats;
    }
    return {};
  }
};