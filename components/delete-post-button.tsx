"use client";

import { deletePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";

export default function DeletePostButton({ postId }: { postId: string }) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This cannot be undone.",
    );
    if (!confirmed) return;
    await deletePost(postId);
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete Post
    </Button>
  );
}
