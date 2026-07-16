import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { feeds } from "@/drizzle/schema";
import { parseFeed } from "@/app/lib/rss";
import { DEFAULT_FEEDS } from "@/app/lib/default-feeds";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const allFeeds = await db.query.feeds.findMany({
    orderBy: [desc(feeds.createdAt)],
  });
  return NextResponse.json(allFeeds);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const existing = await db.query.feeds.findFirst({
      where: eq(feeds.url, url),
    });
    if (existing) {
      return NextResponse.json({ error: "Feed already exists" }, { status: 409 });
    }

    const parsed = await parseFeed(url);
    const feedId = nanoid();

    await db.insert(feeds).values({
      id: feedId,
      title: parsed.title,
      url,
      siteUrl: parsed.siteUrl,
      description: parsed.description,
    });

    const feed = await db.query.feeds.findFirst({
      where: eq(feeds.id, feedId),
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    console.error("Failed to add feed:", error);
    return NextResponse.json(
      { error: "Failed to add feed" },
      { status: 500 }
    );
  }
}
