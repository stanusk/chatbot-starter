import { NextRequest, NextResponse } from "next/server";
import { getChatMessages } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    
    const messages = await getChatMessages(sessionId);
    
    return NextResponse.json({ messages });
  } catch (error) {
    ErrorHandlers.supabaseError("Failed to fetch chat messages", error, {
      component: "api/messages",
      action: "GET",
      sessionId: sessionId || "unknown"
    });
    
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}