import { NextRequest, NextResponse } from "next/server";
import { getChatSessions } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    
    const sessions = await getChatSessions(userId);
    
    return NextResponse.json({ sessions });
  } catch (error) {
    ErrorHandlers.supabaseError("Error fetching chat sessions", error, {
      component: "api/sessions",
      action: "GET",
      userId: request.nextUrl.searchParams.get("userId") || undefined
    });
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}