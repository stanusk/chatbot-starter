import { NextRequest, NextResponse } from "next/server";
import { getChatMessages, saveChatMessage } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import { validateUUIDForAPI } from "@/utils/validation";
import { createAuthenticatedSupabaseClient } from "@/lib/auth/server";
import type { MessageRole } from "@/types/database";

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
    
    // Validate UUID format
    const uuidValidation = validateUUIDForAPI(sessionId, "Session ID");
    if (!uuidValidation.isValid) {
      return NextResponse.json(
        { error: uuidValidation.error },
        { status: 400 }
      );
    }
    
    // Create authenticated client - RLS will automatically filter messages
    const supabase = await createAuthenticatedSupabaseClient();
    const messages = await getChatMessages(supabase, sessionId);
    
    return NextResponse.json({ messages });
  } catch (error) {
    ErrorHandlers.supabaseError("Failed to fetch chat messages", error, {
      component: "api/messages",
      action: "GET",
      sessionId: request.nextUrl.searchParams.get("sessionId") || "unknown"
    });
    
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sessionId, 
      role, 
      content, 
      reasoning, 
      score, 
      metadata 
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!role || !content) {
      return NextResponse.json(
        { error: "Role and content are required" },
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

    // Validate role
    const validRoles: MessageRole[] = ["user", "assistant", "system"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user', 'assistant', or 'system'" },
        { status: 400 }
      );
    }

    // Create authenticated client - RLS will handle authorization
    const supabase = await createAuthenticatedSupabaseClient();
    const message = await saveChatMessage(
      supabase,
      sessionId,
      role,
      content,
      reasoning,
      score,
      metadata
    );

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    ErrorHandlers.supabaseError("Failed to save chat message", error, {
      component: "api/messages",
      action: "POST"
    });
    
    return NextResponse.json(
      { error: "Failed to save chat message" },
      { status: 500 }
    );
  }
}