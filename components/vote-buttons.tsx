"use client";

import { useState, useOptimistic, useTransition } from "react";
import { votePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";

interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  userVote: "UP" | "DOWN" | null;
  isSignedIn: boolean;
}

interface VoteState {
  upvotes: number;
  downvotes: number;
  userVote: "UP" | "DOWN" | null;
}

function computeOptimisticVote(
  state: VoteState,
  clicked: "UP" | "DOWN",
): VoteState {
  const { upvotes, downvotes, userVote } = state;

  if (userVote === clicked) {
    return {
      upvotes: clicked === "UP" ? upvotes - 1 : upvotes,
      downvotes: clicked === "DOWN" ? downvotes - 1 : downvotes,
      userVote: null,
    };
  }

  if (userVote !== null) {
    return {
      upvotes: clicked === "UP" ? upvotes + 1 : upvotes - 1,
      downvotes: clicked === "DOWN" ? downvotes + 1 : downvotes - 1,
      userVote: clicked,
    };
  }

  return {
    upvotes: clicked === "UP" ? upvotes + 1 : upvotes,
    downvotes: clicked === "DOWN" ? downvotes + 1 : downvotes,
    userVote: clicked,
  };
}

export default function VoteButtons({
  postId,
  upvotes,
  downvotes,
  userVote,
  isSignedIn,
}: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();

  // useState owns the "committed" state — what we know the server confirmed.
  // Starts from server props, then we control it from here.
  // This replaces raw props as useOptimistic's source of truth.
  const [committed, setCommitted] = useState<VoteState>({
    upvotes,
    downvotes,
    userVote,
  });

  // useOptimistic now reads from `committed`, not raw props.
  // When transition ends: reverts to `committed` — which we update on success.
  const [optimisticVote, addOptimisticVote] = useOptimistic(
    committed,
    computeOptimisticVote,
  );

  const score = optimisticVote.upvotes - optimisticVote.downvotes;

  function handleVote(type: "UP" | "DOWN") {
    if (!isSignedIn) return;

    startTransition(async () => {
      // Pre-compute what the state will be after this vote succeeds
      const nextState = computeOptimisticVote(committed, type);

      // Step 1 — update UI immediately (optimistic)
      addOptimisticVote(type);

      // Step 2 — server action in background
      await votePost(postId, type);

      // Step 3 — action succeeded: update committed state.
      // Now when useOptimistic reverts, it reverts to nextState, not old props.
      setCommitted(nextState);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={optimisticVote.userVote === "UP" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("UP")}
        disabled={!isSignedIn || isPending}
      >
        ▲ {optimisticVote.upvotes}
      </Button>

      <span className="text-sm font-medium w-8 text-center">{score}</span>

      <Button
        variant={optimisticVote.userVote === "DOWN" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("DOWN")}
        disabled={!isSignedIn || isPending}
      >
        ▼ {optimisticVote.downvotes}
      </Button>
    </div>
  );
}
