import Parser from "rss-parser";

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "FeedFlow RSS Reader/1.0",
  },
});

export interface ParsedArticle {
  title: string;
  url: string;
  summary: string;
  author?: string;
  publishedAt: Date;
}

export interface ParsedFeed {
  title: string;
  description?: string;
  siteUrl?: string;
  articles: ParsedArticle[];
}

export async function parseFeed(feedUrl: string): Promise<ParsedFeed> {
  const feed = await parser.parseURL(feedUrl);

  const articles: ParsedArticle[] = (feed.items || [])
    .map((item) => {
      const content = item["content:encoded"] || item.content || "";
      const summary = content
        ? content.replace(/<[^>]*>/g, "").slice(0, 300)
        : (item.title || "").slice(0, 300);

      return {
        title: item.title || "Untitled",
        url: item.link || "",
        summary: summary || item.title || "",
        author: item.creator || item.author,
        publishedAt: item.isoDate
          ? new Date(item.isoDate)
          : item.pubDate
          ? new Date(item.pubDate)
          : new Date(),
      };
    })
    .filter((a) => a.url);

  return {
    title: feed.title || "Unknown Feed",
    description: feed.description || undefined,
    siteUrl: feed.link || undefined,
    articles,
  };
}
