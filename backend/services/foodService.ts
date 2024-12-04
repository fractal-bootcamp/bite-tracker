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
  imageData: string,
  foodData: FoodData
) {
  try {
    // Early return if no food data or food items
    if (!foodData || !foodData.foodItems || foodData.foodItems.length === 0) {
      console.log("No food items detected, skipping database save");
      return null;
    }

    // Create the image with required fields
    const image = await prisma.image.create({
      data: {
        userId: userId,
        imageUrl: "https://example.com/image.jpg", // for the future we can store imageData in the cloud
        foodItems: {
          create:
            foodData.foodItems.map((item) => ({
              name: item.name,
              calories: item.calories,
              carbs: item.carbs,
              fat: item.fat,
              protein: item.protein,
            })) || [],
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
