import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { articles } from "@/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feedId = searchParams.get("feed_id");
    const unread = searchParams.get("unread");

    const conditions = [];
    if (feedId) {
      conditions.push(eq(articles.feedId, feedId));
    }
    if (unread === "true") {
      conditions.push(eq(articles.isRead, false));
    }

    const allArticles = await db.query.articles.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(articles.publishedAt)],
      with: {
        feed: true,
      },
    });

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
