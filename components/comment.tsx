"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommentForm from "@/components/comment-form";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
  };
  replies: CommentData[];
}

interface CommentProps {
  comment: CommentData;
  postId: string;
  isSignedIn: boolean;
  depth?: number;
}

export default function Comment({
  comment,
  postId,
  isSignedIn,
  depth = 0,
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 5;

  return (
    <div className={depth > 0 ? "ml-6 mt-3 border-l-2 pl-4" : ""}>
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

        {isSignedIn && depth < maxDepth && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </Button>
        )}

        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              isSignedIn={isSignedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
