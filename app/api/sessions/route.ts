import { NextRequest, NextResponse } from "next/server";
import { getChatSessions } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";

/**
 * Handles GET requests to retrieve chat sessions, optionally filtered by user ID.
 *
 * Extracts the `userId` query parameter from the request URL and fetches the corresponding chat sessions. Returns the sessions as a JSON response. If an error occurs, responds with a 500 status and an error message.
 *
 * @param request - The incoming HTTP request
 * @returns A JSON response containing chat sessions or an error message
 */
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