import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const session = await auth();

  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!topic) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← All Topics
        </Link>
        <h1 className="text-3xl font-bold mt-2">{topic.name}</h1>
        {topic.description && (
          <p className="text-muted-foreground mt-1">{topic.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{topic.posts.length} Posts</h2>
        {session?.user && (
          <Link
            href="/posts/create"
            className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
          >
            + New Post
          </Link>
        )}
      </div>

      {topic.posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No posts yet. Be the first to start a discussion.
        </p>
      ) : (
        <div className="space-y-3">
          {topic.posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <div className="font-medium">{post.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                by {post.author.name} ·{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
