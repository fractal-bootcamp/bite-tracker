import { FoodItems } from "../client";

export interface TransformedMeal {
  id: string;
  date: string;
  name: string;
  nutrition: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

export const transformFoodItemsToMeals = (
  foodItems: FoodItems
): TransformedMeal[] => {
  return foodItems.images.flatMap((image, index) => {
    return image.foodItems.map((foodItem) => ({
      id: foodItem.id, // You might want to use a more unique ID
      date:
        new Date(foodItem.createdAt).toLocaleDateString() ===
        new Date().toLocaleDateString()
          ? "Today"
          : "Yesterday", // Simplified date handling - you might want to expand this
      name: foodItem.name,
      nutrition: {
        fat: foodItem.fat || 0,
        carbs: foodItem.carbs || 0,
        protein: foodItem.protein || 0,
        calories: foodItem.calories || 0,
      },
    }));
  });
};
