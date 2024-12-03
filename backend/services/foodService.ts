import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveFoodData(
  userId: string,
  imageData: string,
  foodData: any
) {
  try {
    // Early return if no food data or food items
    if (!foodData || !foodData.foodItems || foodData.foodItems.length === 0) {
      console.log("No food items detected, skipping database save");
      return null;
    }

    // First, ensure user exists (create if not)
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
      },
    });

    // Create the image with required fields
    const image = await prisma.image.create({
      data: {
        userId: user.id,
        imageUrl: "https://example.com/image.jpg", // for the future we can store imageData in the cloud
        foodItems: {
          create:
            foodData.foodItems?.map((item: any) => ({
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
