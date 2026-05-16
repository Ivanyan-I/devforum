"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updatePost } from "@/actions/posts";
import type { UpdatePostState } from "@/actions/posts";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

interface EditPostFormProps {
  postId: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditPostForm({
  postId,
  initialTitle,
  initialContent,
}: EditPostFormProps) {
  const boundAction = updatePost.bind(null, postId);
  const [state, action] = useActionState<UpdatePostState, FormData>(
    boundAction,
    null,
  );

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
          {state.error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialTitle}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
        />
        {state?.errors?.title && (
          <p className="text-xs text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={initialContent}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
        />
        {state?.errors?.content && (
          <p className="text-xs text-red-500">{state.errors.content[0]}</p>
        )}
      </div>

      <div className="flex gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
