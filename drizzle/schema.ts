import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable("feeds", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  siteUrl: text("site_url"),
  description: text("description"),
  iconUrl: text("icon_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  lastFetchedAt: integer("last_fetched_at", { mode: "timestamp" }),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  feedId: text("feed_id").notNull().references(() => feeds.id),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  summary: text("summary"),
  author: text("author"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const fetchLogs = sqliteTable("fetch_logs", {
  id: text("id").primaryKey(),
  feedId: text("feed_id").notNull().references(() => feeds.id),
  status: text("status").notNull(),
  articlesFetched: integer("articles_fetched").default(0),
  errorMessage: text("error_message"),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
