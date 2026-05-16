import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import EditPostForm from "@/components/edit-post-form";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/api/auth/signin");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) notFound();

  // Server-side ownership check — middleware only checks auth, not ownership
  if (post.authorId !== session.user.id) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm
        postId={post.id}
        initialTitle={post.title}
        initialContent={post.content}
      />
    </div>
  );
}
