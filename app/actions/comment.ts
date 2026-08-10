"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { commentSchema, type CommentInput } from "@/app/lib/validations/comment";

export async function getComments(cropId: string) {
  const comments = await prisma.comment.findMany({
    where: { cropId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return comments;
}

export async function createComment(data: CommentInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "You must be logged in." };
  }

  const parsed = commentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text: parsed.data.text,
        cropId: parsed.data.cropId,
        userId: session.user.id,
      },
      include: { user: { select: { name: true } } },
    });
    return { success: true, comment };
  } catch (error) {
    return { success: false, error: "Failed to post comment." };
  }
}