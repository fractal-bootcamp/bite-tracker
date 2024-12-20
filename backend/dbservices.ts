import type { User, Image, FoodItem } from "@prisma/client";
import prisma from "./prismaclient";

console.log("Initializing DB Services");
export async function createUser(clerkId: string): Promise<User> {
  return prisma.user.create({
    data: { clerkId },
  });
}

type FoodItems = {
  fatTarget: number | null;
  proteinTarget: number | null;
  carbTarget: number | null;
  calorieTarget: number | null;
  images: {
    foodItems: FoodItem[];
    // other Image properties
  }[];
  // other User properties
} | null;

export async function getUserImagesAndFood(
  clerkId: string
): Promise<FoodItems> {
  return prisma.user.findUnique({
    where: {
      clerkId: clerkId,
    },
    include: {
      images: {
        include: {
          foodItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function updateUserTargets(
  clerkId: string,
  targets: MacroTargets
): Promise<User> {
  return prisma.user.update({
    where: { clerkId },
    data: {
      calorieTarget: targets.calories,
      proteinTarget: targets.protein,
      carbTarget: targets.carbs,
      fatTarget: targets.fat,
    },
  });
}
