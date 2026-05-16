import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DeletePostButton from "@/components/delete-post-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/api/auth/signin");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      topic: true,
      _count: { select: { comments: true, votes: true } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Link
          href="/posts/create"
          className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any posts yet.
          </p>
          <Link
            href="/posts/create"
            className="text-sm font-medium hover:underline"
          >
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post.id}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">
                    {post.topic.name} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                    {post._count.comments} comments · {post._count.votes} votes
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-sm border rounded-md px-2 py-1 hover:bg-muted transition-colors"
                  >
                    Edit
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
