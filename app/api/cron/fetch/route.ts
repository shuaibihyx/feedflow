import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { feeds, articles, fetchLogs } from "@/drizzle/schema";
import { parseFeed } from "@/app/lib/rss";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;
    if (authHeader !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allFeeds = await db.query.feeds.findMany();
    const results = [];

    for (const feed of allFeeds) {
      try {
        const parsed = await parseFeed(feed.url);
        let fetchedCount = 0;

        for (const item of parsed.articles.slice(0, 30)) {
          const existing = await db.query.articles.findFirst({
            where: eq(articles.url, item.url),
          });

          if (!existing) {
            await db.insert(articles).values({
              id: nanoid(),
              feedId: feed.id,
              title: item.title,
              url: item.url,
              summary: item.summary,
              author: item.author,
              publishedAt: item.publishedAt,
            });
            fetchedCount++;
          }
        }

        await db
          .update(feeds)
          .set({ lastFetchedAt: new Date() })
          .where(eq(feeds.id, feed.id));

        await db.insert(fetchLogs).values({
          id: nanoid(),
          feedId: feed.id,
          status: "success",
          articlesFetched: fetchedCount,
        });

        results.push({ feed: feed.title, status: "success", fetched: fetchedCount });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await db.insert(fetchLogs).values({
          id: nanoid(),
          feedId: feed.id,
          status: "error",
          errorMessage: message,
        });
        results.push({ feed: feed.title, status: "error", error: message });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Cron fetch failed:", error);
    return NextResponse.json(
      { error: "Cron fetch failed" },
      { status: 500 }
    );
  }
}
