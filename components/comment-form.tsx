"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createComment } from "@/actions/posts";
import type { CreateCommentState } from "@/actions/posts";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Posting..." : "Post Comment"}
    </Button>
  );
}

export default function CommentForm({
  postId,
  parentId = null,
  onCancel,
}: {
  postId: string;
  parentId?: string | null;
  onCancel?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const boundAction = createComment.bind(null, postId, parentId);
  const [state, action] = useActionState<CreateCommentState, FormData>(
    boundAction,
    null,
  );

  // Reset form when comment successfully posted (state becomes null)
  const prevStateRef = useRef(state);
  useEffect(() => {
    if (prevStateRef.current !== null && state === null) {
      formRef.current?.reset();
      onCancel?.();
    }
    prevStateRef.current = state;
  }, [state, onCancel]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <textarea
        name="content"
        rows={3}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
      />
      {state?.errors?.content && (
        <p className="text-xs text-red-500">{state.errors.content[0]}</p>
      )}
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="flex gap-2">
        <SubmitButton />
        {onCancel && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
