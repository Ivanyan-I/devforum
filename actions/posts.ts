"use server";

import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  topicId: z.string().min(1, "Please select a topic"),
});

export type CreatePostState = {
  errors?: {
    title?: string[];
    content?: string[];
    topicId?: string[];
  };
  error?: string;
} | null;

export async function createPost(
  prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in to create a post" };
  }

  const validated = CreatePostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    topicId: formData.get("topicId"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "User not found" };

  const post = await prisma.post.create({
    data: {
      title: validated.data.title,
      content: validated.data.content,
      authorId: user.id,
      topicId: validated.data.topicId,
    },
    include: { topic: true },
  });

  revalidatePath(`/topics/${post.topic.slug}`);
  redirect(`/posts/${post.id}`);
}

export async function votePost(
  postId: string,
  voteType: "UP" | "DOWN",
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: { userId: session.user.id, postId },
    },
  });

  if (!existingVote) {
    await prisma.vote.create({
      data: { userId: session.user.id, postId, type: voteType },
    });
  } else if (existingVote.type === voteType) {
    // clicking same vote type = undo
    await prisma.vote.delete({
      where: { userId_postId: { userId: session.user.id, postId } },
    });
  } else {
    // switching vote direction
    await prisma.vote.update({
      where: { userId_postId: { userId: session.user.id, postId } },
      data: { type: voteType },
    });
  }

  revalidatePath(`/posts/${postId}`);
}

export type CreateCommentState = {
  errors?: { content?: string[] };
  error?: string;
} | null;

export async function createComment(
  postId: string,
  prevState: CreateCommentState,
  formData: FormData,
): Promise<CreateCommentState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in" };

  const content = formData.get("content");
  if (!content || typeof content !== "string" || content.trim().length < 2) {
    return { errors: { content: ["Comment must be at least 2 characters"] } };
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      authorId: session.user.id,
      postId,
    },
  });

  revalidatePath(`/posts/${postId}`);
  return null;
}

export type UpdatePostState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  error?: string;
} | null;

export async function updatePost(
  postId: string,
  prevState: UpdatePostState,
  formData: FormData,
): Promise<UpdatePostState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in" };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { topic: true },
  });

  if (!post) return { error: "Post not found" };
  if (post.authorId !== session.user.id) {
    return { error: "You can only edit your own posts" };
  }

  const validated = z
    .object({
      title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be under 100 characters"),
      content: z.string().min(10, "Content must be at least 10 characters"),
    })
    .safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
    });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: validated.data.title,
      content: validated.data.content,
    },
  });

  revalidatePath(`/posts/${postId}`);
  revalidatePath(`/topics/${post.topic.slug}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { topic: true },
  });

  if (!post) return;
  if (post.authorId !== session.user.id) return;

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath(`/topics/${post.topic.slug}`);
  redirect(`/topics/${post.topic.slug}`);
}
