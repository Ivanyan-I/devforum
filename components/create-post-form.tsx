"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "@/actions/posts";
import type { CreatePostState } from "@/actions/posts";
import { Button } from "@/components/ui/button";

interface Topic {
  id: string;
  name: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Post"}
    </Button>
  );
}

export default function CreatePostForm({ topics }: { topics: Topic[] }) {
  const [state, action] = useActionState<CreatePostState, FormData>(
    createPost,
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
        <label htmlFor="topicId" className="text-sm font-medium">
          Topic
        </label>
        <select
          id="topicId"
          name="topicId"
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="">Select a topic...</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        {state?.errors?.topicId && (
          <p className="text-xs text-red-500">{state.errors.topicId[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="What's your post about?"
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
          rows={6}
          placeholder="Write your post..."
          className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
        />
        {state?.errors?.content && (
          <p className="text-xs text-red-500">{state.errors.content[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
