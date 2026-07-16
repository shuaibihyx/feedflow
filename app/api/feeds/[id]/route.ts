import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { feeds, articles, fetchLogs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(fetchLogs).where(eq(fetchLogs.feedId, id));
    await db.delete(articles).where(eq(articles.feedId, id));
    await db.delete(feeds).where(eq(feeds.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete feed:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
