import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FoodItem {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

interface FoodData {
  foodItems: FoodItem[] | null;
}

export async function saveFoodData(
  userId: string,
  imageUrl: string,
  foodData: FoodData
) {
  if (!foodData.foodItems) {
    return null;
  }

  try {
    const image = await prisma.image.create({
      data: {
        userId: userId,
        imageUrl: imageUrl,
        foodItems: {
          create: foodData.foodItems.map((item) => ({
            name: item.name,
            calories: item.calories,
            carbs: item.carbs,
            fat: item.fat,
            protein: item.protein,
          })),
        },
      },
      include: {
        foodItems: true,
      },
    });

    return image;
  } catch (error) {
    console.error("Error saving food data:", error);
    throw error;
  }
}
