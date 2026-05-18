"use client";
import { useSession } from "next-auth/react";

// This runs in the browser — reads session from client-side cookie.
// Does NOT touch the server, does NOT affect page caching.
export default function WelcomeMessage() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <p className="text-sm text-muted-foreground mb-8">
        Welcome back, <strong>{session.user.name}</strong>
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground mb-8">
      Sign in to create posts and join the discussion.
    </p>
  );
}
