"use client";

import { useState } from "react";

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string) => void;
}

export default function AddFeedModal({ isOpen, onClose, onAdd }: AddFeedModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    await onAdd(url.trim());
    setLoading(false);
    setUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 mx-4">
        <h2 className="text-lg font-semibold mb-4">添加订阅源</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-[var(--muted)] mb-1.5">RSS Feed URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "添加中..." : "添加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
