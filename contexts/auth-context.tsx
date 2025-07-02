"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ErrorHandlers } from "@/lib/error-handling";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isClient: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Use SSR-compatible browser client
    const supabaseClient = supabaseBrowser;

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      // Only show toast for explicit sign in/out events, not initial session loading
      if (event === "SIGNED_IN" && session?.user) {
        // Success feedback for sign in - using dynamic import to avoid dependency
        import("sonner").then(({ toast }) =>
          toast.success("Successfully signed in!")
        );
      } else if (event === "SIGNED_OUT") {
        // Success feedback for sign out - using dynamic import to avoid dependency
        import("sonner").then(({ toast }) =>
          toast.success("Successfully signed out!")
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [isClient]);

  const signIn = useCallback(async (email: string) => {
    if (!email) {
      ErrorHandlers.validationError(
        "Please enter your email",
        "Please enter your email",
        {
          component: "AuthProvider",
          action: "signIn",
        }
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}`
              : undefined,
        },
      });

      if (error) {
        ErrorHandlers.authError("Sign in failed", error, {
          component: "AuthProvider",
          action: "signInWithOtp",
          metadata: { email },
        });
      } else {
        // Success feedback - using dynamic import to avoid dependency
        import("sonner").then(({ toast }) =>
          toast.success("Check your email for the login link!")
        );
      }
    } catch (error) {
      ErrorHandlers.authError("An error occurred during sign in", error, {
        component: "AuthProvider",
        action: "signIn",
        metadata: { email },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) {
        ErrorHandlers.authError("Sign out failed", error, {
          component: "AuthProvider",
          action: "signOut",
        });
      }
    } catch (error) {
      ErrorHandlers.authError("An error occurred during sign out", error, {
        component: "AuthProvider",
        action: "signOut",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isClient,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
