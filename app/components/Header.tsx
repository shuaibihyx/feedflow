"use client";

import Link from "next/link";

interface HeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function Header({ unreadCount, onMarkAllRead }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">FeedFlow</h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--muted)]">
            {unreadCount > 0 ? `${unreadCount} 篇未读` : "全部已读"}
          </span>
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1.5 text-sm rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
          >
            全部已读
          </button>
          <Link
            href="/settings"
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            设置
          </Link>
        </div>
      </div>
    </header>
  );
}
