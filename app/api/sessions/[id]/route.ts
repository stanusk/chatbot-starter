import { NextRequest, NextResponse } from "next/server";
import { softDeleteChatSession } from "@/lib/database/supabase";
import { ErrorHandlers } from "@/lib/error-handling";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let sessionId: string | undefined;
  
  try {
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