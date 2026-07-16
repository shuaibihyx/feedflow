import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { articles } from "@/drizzle/schema";

export async function PATCH() {
  try {
    await db.update(articles).set({ isRead: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark all articles as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all articles as read" },
      { status: 500 }
    );
  }
}
