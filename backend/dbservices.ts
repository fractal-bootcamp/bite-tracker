import type { User, Image, FoodItem } from "@prisma/client";
import prisma from "./prismaclient";

export async function createUser(clerkId: string): Promise<User> {
  return prisma.user.create({
    data: { clerkId },
  });
}

export async function getUserImagesAndFood(userId: string) {
  return prisma.image.findMany({
    where: {
      userId: userId,
    },
    include: {
      foodItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
