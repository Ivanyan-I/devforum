"use client";

import { useActionState, useRef, useEffect, useState } from "react";
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

function CancelButton({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onCancel}
      disabled={pending}
    >
      Cancel
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const boundAction = createComment.bind(null, postId, parentId);
  const [state, action] = useActionState<CreateCommentState, FormData>(
    boundAction,
    null,
  );

  const onCancelRef = useRef(onCancel);

  // Keep onCancelRef updated
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  // Close form on successful submission
  useEffect(() => {
    if (hasSubmitted && state === null) {
      formRef.current?.reset();
      if (onCancelRef.current) {
        onCancelRef.current();
      }
    }
  }, [state, hasSubmitted]);

  const handleSubmit = (formData: FormData) => {
    setHasSubmitted(true);
    action(formData);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
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
        {onCancel && <CancelButton onCancel={onCancel} />}
      </div>
    </form>
  );
}
