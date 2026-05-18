import Link from "next/link";
import { cacheTag, cacheLife } from "next/cache";
import prisma from "@/lib/prisma";
import WelcomeMessage from "@/components/welcome-message";

// Topics are the same for every user and every visit.
// Cache them. Invalidate only when a topic is added.
async function getTopics() {
  "use cache";
  cacheTag("topics");
  cacheLife("hours");

  return prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const topics = await getTopics();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to DevForum</h1>
        <p className="text-muted-foreground">
          A place for developers to discuss, share, and learn.
        </p>
      </div>

      <WelcomeMessage />

      <h2 className="text-xl font-semibold mb-4">Browse Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <div className="font-medium">{topic.name}</div>
            {topic.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {topic.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
