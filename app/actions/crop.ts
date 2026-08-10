"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { cropSchema, type CropInput } from "@/app/lib/validations/crop";
import { revalidatePath } from "next/cache";

export async function createCrop(data: CropInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "You must be logged in." };
  }

  const parsed = cropSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const crop = await prisma.crop.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    });

    revalidatePath("/crops");
    return { success: true, crop };
  } catch (error: any) {
    return { success: false, error: "Failed to create crop." };
  }
}

export async function getCrops(search?: string) {
  const crops = await prisma.crop.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return crops;
}

export async function getCropById(id: string) {
  const crop = await prisma.crop.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  return crop;
}