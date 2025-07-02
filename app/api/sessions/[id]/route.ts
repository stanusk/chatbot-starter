import { NextRequest, NextResponse } from "next/server";
import { softDeleteChatSession, getChatSession } from "@/lib/database/supabase";
import { ErrorHandlers } from "@/lib/error-handling";
import { getAuthenticatedUser } from "@/lib/auth";
import { ApiErrors } from "@/lib/api/error-responses";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let sessionId: string | undefined;
  
  try {
    // Authentication check - verify user is authenticated
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return ApiErrors.unauthorized("Authentication required to delete chat sessions");
    }

    const { id } = await params;
    sessionId = id;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Validate UUID format
    if (!UUID_REGEX.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    // Authorization check - verify the user owns the session
    const session = await getChatSession(sessionId);
    
    if (!session) {
      return ApiErrors.notFound("Chat session not found");
    }
    
    // Check if the session belongs to the authenticated user
    if (session.user_id && session.user_id !== user.id) {
      return ApiErrors.forbidden("Access denied: You can only delete your own chat sessions");
    }

    // Use the admin client function for soft delete
    // This bypasses RLS but ensures the operation works reliably
    await softDeleteChatSession(sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      message: "Session moved to trash successfully" 
    });

  } catch (error: any) {
    ErrorHandlers.supabaseError("Error deleting chat session", error, {
      component: "api/sessions/[id]",
      action: "DELETE",
      sessionId: sessionId || "unknown"
    });
    
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}