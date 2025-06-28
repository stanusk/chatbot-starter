"use client";

import { useState } from "react";
import { Chat } from "@/components/chat";
import { Auth } from "@/components/auth";
import { ChatHistory } from "@/components/chat-history";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold">AI Chat</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              ✕
            </button>
          </div>

          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <Auth user={user} onAuthChange={setUser} />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ChatHistory user={user} />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">AI SDK Reasoning</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Chat component */}
        <div className="flex-1 flex justify-center">
          <Chat />
        </div>
      </div>
    </div>
  );
}
