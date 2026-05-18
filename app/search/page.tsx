// app/search/page.tsx
import Link from "next/link";
import { cacheTag, cacheLife } from "next/cache"; // ← new imports
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

// 'use cache' replaces unstable_cache entirely.
// Next.js automatically uses the function argument (query) as part
// of the cache key — same behavior as before, cleaner syntax.
async function searchPosts(query: string) {
  "use cache";
  cacheTag("posts"); // ← tag for invalidation
  cacheLife("minutes"); // ← cache for a few minutes, then revalidate

  return prisma.post.findMany({
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
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const posts = query.length >= 2 ? await searchPosts(query) : [];

  return (
    // JSX stays exactly the same — no changes here
    <div className="max-w-3xl mx-auto">{/* ... your existing JSX ... */}</div>
  );
}
