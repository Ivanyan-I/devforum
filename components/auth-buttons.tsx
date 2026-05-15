"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>;
}

export function SignOutButton() {
  return (
    <Button variant="outline" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
