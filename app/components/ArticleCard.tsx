"use client";

interface FeedInfo {
  id: string;
  title: string;
}

interface Article {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  author: string | null;
  publishedAt: string;
  isRead: boolean;
  feed?: FeedInfo;
}

interface ArticleCardProps {
  article: Article;
  onMarkRead: (id: string) => void;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);

  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function ArticleCard({ article, onMarkRead }: ArticleCardProps) {
  return (
    <div
      className={`group p-4 rounded-lg border transition-all ${
        article.isRead
          ? "border-[var(--border)] bg-[var(--background)] opacity-60"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {!article.isRead && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
            )}
            <span className="text-xs text-[var(--accent2)] font-medium">
              {article.feed?.title || "未知来源"}
            </span>
            <span className="text-xs text-[var(--muted)]">·</span>
            <span className="text-xs text-[var(--muted)]">{formatTime(article.publishedAt)}</span>
            {article.author && (
              <>
                <span className="text-xs text-[var(--muted)]">·</span>
                <span className="text-xs text-[var(--muted)]">{article.author}</span>
              </>
            )}
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            onClick={() => !article.isRead && onMarkRead(article.id)}
          >
            <h3
              className={`text-base font-medium mb-1.5 group-hover:text-[var(--accent)] transition-colors ${
                article.isRead ? "text-[var(--muted)]" : "text-[var(--foreground)]"
              }`}
            >
              {article.title}
            </h3>
          </a>
          <p className="text-sm text-[var(--muted)] line-clamp-2">{article.summary || ""}</p>
        </div>
      </div>
    </div>
  );
}
