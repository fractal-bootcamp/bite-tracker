import { PrismaClient } from "@prisma/client";

console.log("File is being executed");

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

export async function testFoodService() {
  console.log("Starting test...");
  try {
    console.log("Connecting to database...");

    // Test data
    const testUserId = "test_user_id";
    const testImageUrl = "https://example.com/test-food-image.jpg";
    const testFoodData: FoodData = {
      foodItems: [
        {
          name: "Grilled Chicken Breast",
          calories: 165,
          carbs: 0,
          fat: 3,
          protein: 31,
        },
      ],
    };

    console.log("Creating test user...");
    const user = await prisma.user.create({
      data: {
        clerkId: "test_clerk_id_" + Date.now(),
      },
    });
    console.log("User created:", user);

    console.log("Saving food data...");
    const result = await saveFoodData(user.id, testImageUrl, testFoodData);
    console.log("Food data saved:", result);

    console.log("Starting cleanup...");
    // Clean up test data
    await prisma.foodItem.deleteMany({
      where: { imageId: result?.id },
    });
    await prisma.image.deleteMany({
      where: { userId: user.id },
    });
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log("Cleanup completed");
  } catch (error) {
    console.error("Test failed with error:", error);
    throw error;
  } finally {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
  }
}

// Make sure this is at the bottom of the file
if (import.meta.main) {
  console.log("Running test directly...");
  testFoodService()
    .then(() => {
      console.log("Test completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}
