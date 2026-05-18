"use client";

import { SessionProvider } from "next-auth/react";

// This is the standard Next.js pattern for adding client-side
// context providers without making the whole layout a client component.
// layout.tsx stays a server component — it just renders this wrapper.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
