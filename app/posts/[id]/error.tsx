"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">Failed to load post</h2>
      <p className="text-muted-foreground mb-6">
        There was a problem loading this post.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
