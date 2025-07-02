import { NextRequest, NextResponse } from "next/server";
import { getChatMessages, getChatSession } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import { getAuthenticatedUser } from "@/lib/auth";
import { ApiErrors } from "@/lib/api/error-responses";

export async function GET(request: NextRequest) {
  try {
    // Authentication check - verify user is authenticated
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return ApiErrors.unauthorized("Authentication required to access chat messages");
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    
    // Authorization check - verify the user owns the session
    const session = await getChatSession(sessionId);
    
    if (!session) {
      return ApiErrors.notFound("Chat session not found");
    }
    
    // Check if the session belongs to the authenticated user
    // Allow access if session.user_id matches user.id, or if session.user_id is null (anonymous session) and no user is required
    if (session.user_id && session.user_id !== user.id) {
      return ApiErrors.forbidden("Access denied: You can only access messages from your own chat sessions");
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