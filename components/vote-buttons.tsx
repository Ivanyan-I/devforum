"use client";

import { votePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";

interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  userVote: "UP" | "DOWN" | null;
  isSignedIn: boolean;
}

export default function VoteButtons({
  postId,
  upvotes,
  downvotes,
  userVote,
  isSignedIn,
}: VoteButtonsProps) {
  const score = upvotes - downvotes;

  async function handleVote(type: "UP" | "DOWN") {
    if (!isSignedIn) return;
    await votePost(postId, type);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={userVote === "UP" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("UP")}
        disabled={!isSignedIn}
      >
        ▲ {upvotes}
      </Button>

      <span className="text-sm font-medium w-8 text-center">{score}</span>

      <Button
        variant={userVote === "DOWN" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("DOWN")}
        disabled={!isSignedIn}
      >
        ▼ {downvotes}
      </Button>
    </div>
  );
}
