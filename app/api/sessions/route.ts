import { NextRequest, NextResponse } from "next/server";
import { getChatSessions } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import { getAuthenticatedUser } from "@/lib/auth";
import { ApiErrors } from "@/lib/api/error-responses";

export async function GET(request: NextRequest) {
  try {
    // Authentication check - verify user is authenticated
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return ApiErrors.unauthorized("Authentication required to access chat sessions");
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    
    // Additional authorization check - ensure user can only access their own sessions
    // If userId is provided in query params, it must match the authenticated user's ID
    if (userId && userId !== user.id) {
      return ApiErrors.forbidden("Access denied: You can only access your own chat sessions");
    }
    
    // Use the authenticated user's ID if no userId provided, or validate the provided userId
    const authorizedUserId = userId || user.id;
    
    const sessions = await getChatSessions(authorizedUserId);
    
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