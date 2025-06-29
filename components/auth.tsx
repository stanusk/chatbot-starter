"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AuthProps {
  user: User | null;
  onAuthChange: (user: User | null) => void;
}

export function Auth({ onAuthChange }: Omit<AuthProps, "user">) {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration mismatches
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Notify parent component of auth changes
  React.useEffect(() => {
    if (isClient) {
      onAuthChange(user);
    }
  }, [isClient, user, onAuthChange]);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email);
    setEmail("");
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
            onClick={signOut}
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
