import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { articles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db
      .update(articles)
      .set({ isRead: true })
      .where(eq(articles.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark article as read:", error);
    return NextResponse.json(
      { error: "Failed to mark article as read" },
      { status: 500 }
    );
  }
}
