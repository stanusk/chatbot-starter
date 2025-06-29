"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
        setEmail("");
      }
    } catch {
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
    } catch {
      toast.error("An error occurred during sign out");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "Signing out..." : "Sign out"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to save your chats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending magic link..." : "Send magic link"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          We&apos;ll send you a magic link to sign in without a password.
        </p>
      </CardContent>
    </Card>
  );
}
