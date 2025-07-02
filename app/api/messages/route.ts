import { NextRequest, NextResponse } from "next/server";
import { getChatMessages } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";

/**
 * Handles GET requests to retrieve chat messages for a given session.
 *
 * Extracts the `sessionId` from the request's query parameters and returns the associated chat messages in a JSON response. Responds with an error and appropriate status code if the `sessionId` is missing or if an error occurs during retrieval.
 */
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
      userId: request.nextUrl.searchParams.get("userId") || undefined
    });
    
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}