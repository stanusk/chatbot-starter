import { NextRequest, NextResponse } from "next/server";
import { softDeleteChatSession, updateChatSessionTitle } from "@/lib/database/supabase";
import { ErrorHandlers } from "@/lib/error-handling";
import { validateUUIDForAPI } from "@/utils/validation";
import { createAuthenticatedSupabaseClient } from "@/lib/auth/server";

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
    const uuidValidation = validateUUIDForAPI(sessionId, "Session ID");
    if (!uuidValidation.isValid) {
      return NextResponse.json(
        { error: uuidValidation.error },
        { status: 400 }
      );
    }

    // Create authenticated client - RLS will ensure only owner can delete
    const supabase = await createAuthenticatedSupabaseClient();
    await softDeleteChatSession(supabase, sessionId);

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      message: "Session moved to trash successfully" 
    });

  } catch (error: unknown) {
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

export async function PATCH(
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
    const uuidValidation = validateUUIDForAPI(sessionId, "Session ID");
    if (!uuidValidation.isValid) {
      return NextResponse.json(
        { error: uuidValidation.error },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create authenticated client - RLS will ensure only owner can update
    const supabase = await createAuthenticatedSupabaseClient();
    await updateChatSessionTitle(supabase, sessionId, title);

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      title: title,
      message: "Session title updated successfully" 
    });

  } catch (error: unknown) {
    ErrorHandlers.supabaseError("Error updating chat session title", error, {
      component: "api/sessions/[id]",
      action: "PATCH",
      sessionId: sessionId || "unknown"
    });
    
    return NextResponse.json(
      { error: "Failed to update session title" },
      { status: 500 }
    );
  }
}