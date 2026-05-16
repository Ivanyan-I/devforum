import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import VoteButtons from "@/components/vote-buttons";
import CommentForm from "@/components/comment-form";
import DeletePostButton from "@/components/delete-post-button";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      topic: true,
      votes: true,
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!post) notFound();

  const upvotes = post.votes.filter((v) => v.type === "UP").length;
  const downvotes = post.votes.filter((v) => v.type === "DOWN").length;
  const userVote = (
    session?.user?.id
      ? (post.votes.find((v) => v.userId === session.user.id)?.type ?? null)
      : null
  ) as "UP" | "DOWN" | null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {" → "}
        <Link href={`/topics/${post.topic.slug}`} className="hover:underline">
          {post.topic.name}
        </Link>
      </div>

      {/* Post */}
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            by {post.author.name} ·{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {/* Owner actions */}
          {session?.user?.id === post.authorId && (
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/posts/${post.id}/edit`}
                className="text-sm border rounded-md px-2 py-1 hover:bg-muted transition-colors"
              >
                Edit
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        <VoteButtons
          postId={post.id}
          upvotes={upvotes}
          downvotes={downvotes}
          userVote={userVote}
          isSignedIn={!!session?.user}
        />
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {post.comments.length} Comments
        </h2>

        {session?.user && <CommentForm postId={post.id} />}

        {post.comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first.
          </p>
        ) : (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="text-sm font-medium">{comment.author.name}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
