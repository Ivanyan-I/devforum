import Link from "next/link";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" — DevForum` : "Search — DevForum",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const posts =
    query.length >= 2
      ? await prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          include: {
            author: true,
            topic: true,
            _count: { select: { comments: true, votes: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      : [];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <form method="GET" action="/search" className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search posts..."
            className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
          />
          <button
            type="submit"
            className="border rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {query.length > 0 && query.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Enter at least 2 characters to search.
        </p>
      )}

      {query.length >= 2 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {posts.length === 0
              ? `No results for "${query}"`
              : `${posts.length} result${posts.length === 1 ? "" : "s"} for "${query}"`}
          </p>

          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <div className="font-medium">{post.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {post.topic.name} · by {post.author.name} ·{" "}
                  {post._count.comments} comments · {post._count.votes} votes
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {post.content}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
