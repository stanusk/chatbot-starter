import { NextRequest, NextResponse } from "next/server";
import { getChatSessions } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    
    const sessions = await getChatSessions(userId);
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}