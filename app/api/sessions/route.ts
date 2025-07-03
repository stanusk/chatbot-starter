import { NextRequest, NextResponse } from "next/server";
import { getChatSessions, createChatSession } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import { createAuthenticatedSupabaseClient } from "@/lib/auth/server";

export async function GET() {
  try {
    // Create authenticated client - RLS will automatically filter sessions
    const supabase = await createAuthenticatedSupabaseClient();
    const sessions = await getChatSessions(supabase);
    
    return NextResponse.json({ sessions });
  } catch (error) {
    ErrorHandlers.supabaseError("Error fetching chat sessions", error, {
      component: "api/sessions",
      action: "GET"
    });
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    // Create authenticated client - RLS will handle user context
    const supabase = await createAuthenticatedSupabaseClient();
    const session = await createChatSession(supabase, title);
    
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    ErrorHandlers.supabaseError("Error creating chat session", error, {
      component: "api/sessions",
      action: "POST"
    });
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    );
  }
}