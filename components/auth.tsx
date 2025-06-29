"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthProps {
  user: User | null;
  onAuthChange: (user: User | null) => void;
}

export function Auth({ user, onAuthChange }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not initialized - authentication disabled");
      return;
    }

    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      onAuthChange(session?.user || null);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((event, session) => {
      onAuthChange(session?.user || null);
      // Only show toast for explicit sign in/out events, not initial session loading
      if (event === "SIGNED_IN" && session?.user) {
        toast.success("Successfully signed in!");
      } else if (event === "SIGNED_OUT") {
        toast.success("Successfully signed out!");
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        toast.error("Authentication not available");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for the login link!");
        setEmail("");
      }
    } catch (error) {
      toast.error("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        toast.error("Authentication not available");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred during sign out");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <div className="flex-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Sign in to save your chats</h3>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending magic link..." : "Send magic link"}
        </button>
      </form>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        We'll send you a magic link to sign in without a password.
      </p>
    </div>
  );
}
