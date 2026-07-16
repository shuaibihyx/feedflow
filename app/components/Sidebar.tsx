"use client";

interface Feed {
  id: string;
  title: string;
}

interface SidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (id: string | null) => void;
  onAddFeed: () => void;
}

export default function Sidebar({
  feeds,
  selectedFeedId,
  onSelectFeed,
  onAddFeed,
}: SidebarProps) {
  return (
    <aside className="w-56 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={() => onSelectFeed(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            selectedFeedId === null
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          全部文章
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 px-3">
          订阅源
        </div>
        {feeds.map((feed) => (
          <button
            key={feed.id}
            onClick={() => onSelectFeed(feed.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors truncate ${
              selectedFeedId === feed.id
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            {feed.title}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={onAddFeed}
          className="w-full px-3 py-2 rounded-md border border-[var(--border)] text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
        >
          + 添加订阅源
        </button>
      </div>
    </aside>
  );
}
