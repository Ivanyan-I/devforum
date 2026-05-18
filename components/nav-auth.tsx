"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-8 bg-muted rounded animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {session.user.name}
        </span>
        <Link href="/posts/create" className="text-sm font-medium">
          + New Post
        </Link>
        <Link href="/dashboard" className="text-sm font-medium">
          Dashboard
        </Link>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>;
}
