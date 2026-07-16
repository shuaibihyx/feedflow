export interface DefaultFeed {
  title: string;
  url: string;
  siteUrl: string;
  description: string;
}

export const DEFAULT_FEEDS: DefaultFeed[] = [
  {
    title: "Hacker News",
    url: "https://hnrss.org/frontpage",
    siteUrl: "https://news.ycombinator.com",
    description: "Technology and startup news aggregator",
  },
  {
    title: "少数派",
    url: "https://sspai.com/feed",
    siteUrl: "https://sspai.com",
    description: "高效工作，品质生活",
  },
  {
    title: "36kr",
    url: "https://36kr.com/feed",
    siteUrl: "https://36kr.com",
    description: "让一部分人先看到未来",
  },
  {
    title: "阮一峰的网络日志",
    url: "https://www.ruanyifeng.com/blog/atom.xml",
    siteUrl: "https://www.ruanyifeng.com/blog",
    description: "科技爱好者周刊",
  },
  {
    title: "Lobsters",
    url: "https://lobste.rs/rss",
    siteUrl: "https://lobste.rs",
    description: "Computing-focused community",
  },
];
