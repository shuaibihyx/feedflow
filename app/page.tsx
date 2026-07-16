"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ArticleCard from "./components/ArticleCard";
import AddFeedModal from "./components/AddFeedModal";

interface Feed {
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
  feed?: {
    id: string;
    title: string;
  };
}

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = useCallback(async () => {
    try {
      const res = await fetch("/api/feeds");
      if (res.ok) {
        const data = await res.json();
        setFeeds(data);
      }
    } catch (err) {
      console.error("Failed to fetch feeds:", err);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      const url = selectedFeedId
        ? `/api/articles?feed_id=${selectedFeedId}`
        : "/api/articles";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  }, [selectedFeedId]);

  const initDefaultFeeds = useCallback(async () => {
    try {
      const res = await fetch("/api/feeds");
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          await fetch("/api/init", { method: "POST" });
          await fetchFeeds();
        }
      }
    } catch (err) {
      console.error("Failed to init feeds:", err);
    }
  }, [fetchFeeds]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await fetchFeeds();
      await initDefaultFeeds();
      setLoading(false);
    }
    load();
  }, [fetchFeeds, initDefaultFeeds]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/articles/${id}/read`, { method: "PATCH" });
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/articles/read-all", { method: "PATCH" });
      setArticles((prev) => prev.map((a) => ({ ...a, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleAddFeed = async (url: string) => {
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        await fetchFeeds();
      } else {
        const err = await res.json();
        alert(err.error || "添加失败");
      }
    } catch (err) {
      console.error("Failed to add feed:", err);
      alert("添加失败");
    }
  };

  const unreadCount = articles.filter((a) => !a.isRead).length;

  return (
    <div className="flex flex-col h-screen">
      <Header unreadCount={unreadCount} onMarkAllRead={handleMarkAllRead} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          feeds={feeds}
          selectedFeedId={selectedFeedId}
          onSelectFeed={setSelectedFeedId}
          onAddFeed={() => setIsModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full text-[var(--muted)]">
              加载中...
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
              <p className="text-lg mb-2">暂无文章</p>
              <p className="text-sm">先添加订阅源或手动触发抓取</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <AddFeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFeed}
      />
    </div>
  );
}
