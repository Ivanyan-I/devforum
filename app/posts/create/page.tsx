// app/posts/create/page.tsx
import { cacheTag, cacheLife } from "next/cache"; // ← replace unstable_cache
import prisma from "@/lib/prisma";
import CreatePostForm from "@/components/create-post-form";

async function getTopics() {
  "use cache";
  cacheTag("topics");
  cacheLife("hours"); // topics change rarely — cache for hours

  return prisma.topic.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export default async function CreatePostPage() {
  const topics = await getTopics();
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create a Post</h1>
      <CreatePostForm topics={topics} />
    </div>
  );
}
