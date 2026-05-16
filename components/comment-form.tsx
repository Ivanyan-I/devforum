"use client";

import { useActionState, useRef } from "react";
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

export default function CommentForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const boundAction = createComment.bind(null, postId);
  const [state, action] = useActionState<CreateCommentState, FormData>(
    boundAction,
    null,
  );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <textarea
        name="content"
        rows={3}
        placeholder="Write a comment..."
        className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
      />
      {state?.errors?.content && (
        <p className="text-xs text-red-500">{state.errors.content[0]}</p>
      )}
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
