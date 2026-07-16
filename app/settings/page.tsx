"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Feed {
  id: string;
  title: string;
  url: string;
  siteUrl: string | null;
  description: string | null;
  lastFetchedAt: string | null;
}

export default function SettingsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/feeds");
      if (res.ok) {
        setFeeds(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个订阅源吗？相关文章也会被删除。")) return;
    const res = await fetch(`/api/feeds/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleFetch = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/cron/fetch", {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "dev-secret"}`,
        },
      });
      if (res.ok) {
        alert("抓取完成！");
      } else {
        alert("抓取失败，请检查配置");
      }
    } catch {
      alert("抓取失败");
    }
    setFetching(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--muted)]">
        加载中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">设置</h1>
          <Link
            href="/"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            ← 返回阅读器
          </Link>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">订阅源管理</h2>
          <div className="space-y-3">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{feed.title}</div>
                  <div className="text-xs text-[var(--muted)] truncate">
                    {feed.url}
                  </div>
                  {feed.lastFetchedAt && (
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      上次抓取: {new Date(feed.lastFetchedAt).toLocaleString("zh-CN")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(feed.id)}
                  className="ml-4 px-3 py-1.5 text-xs rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-medium mb-4">手动操作</h2>
          <button
            onClick={handleFetch}
            disabled={fetching}
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {fetching ? "抓取中..." : "立即抓取所有订阅源"}
          </button>
          <p className="text-xs text-[var(--muted)] mt-2">
            手动触发一次全量 RSS 抓取。生产环境中每 30 分钟会自动执行。
          </p>
        </div>
      </div>
    </div>
  );
}
