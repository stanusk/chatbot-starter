"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useSupabase } from "./useSupabase";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const supabaseHook = useSupabase();

  // Set client flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !supabase) {
      if (!supabase) {
        console.warn("Supabase not initialized - authentication disabled");
      }
      return;
    }

    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      // Only show toast for explicit sign in/out events, not initial session loading
      if (event === "SIGNED_IN" && session?.user) {
        toast.success("Successfully signed in!");
      } else if (event === "SIGNED_OUT") {
        toast.success("Successfully signed out!");
      }
    });

    return () => subscription.unsubscribe();
  }, [isClient]);

  const signIn = useCallback(async (email: string) => {
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
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}`
              : undefined,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for the login link!");
      }
    } catch {
      toast.error("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
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
    } catch {
      toast.error("An error occurred during sign out");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    signIn,
    signOut,
  };
} 