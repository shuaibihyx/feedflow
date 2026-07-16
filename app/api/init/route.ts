import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { feeds } from "@/drizzle/schema";
import { DEFAULT_FEEDS } from "@/app/lib/default-feeds";
import { nanoid } from "nanoid";

export async function POST() {
  try {
    const existing = await db.query.feeds.findMany();
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already initialized" });
    }

    for (const feed of DEFAULT_FEEDS) {
      await db.insert(feeds).values({
        id: nanoid(),
        title: feed.title,
        url: feed.url,
        siteUrl: feed.siteUrl,
        description: feed.description,
      });
    }

    return NextResponse.json({ success: true, count: DEFAULT_FEEDS.length });
  } catch (error) {
    console.error("Failed to init feeds:", error);
    return NextResponse.json(
      { error: "Failed to initialize feeds" },
      { status: 500 }
    );
  }
}
