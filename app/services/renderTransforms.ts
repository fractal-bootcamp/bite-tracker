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

export const transformTargetsToSummary = (
  transformedMeals: TransformedMeal[]
) => {
  // Calculate nutrition summary
  const summary = transformedMeals.reduce(
    (
      acc: {
        fat: number;
        carbs: number;
        protein: number;
        calories: number;
      },
      meal: TransformedMeal
    ) => ({
      fat: acc.fat + meal.nutrition.fat,
      carbs: acc.carbs + meal.nutrition.carbs,
      protein: acc.protein + meal.nutrition.protein,
      calories: acc.calories + meal.nutrition.calories,
    }),
    {
      fat: 0,
      carbs: 0,
      protein: 0,
      calories: 0,
    }
  );
  return summary;
};

export interface NutritionSummary {
  values: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
  percentages: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

export const transformFoodItemsToTargets = (
  foodItems: FoodItems
): NutritionSummary => {
  // Calculate total values
  const values = foodItems.images
    .flatMap((image) =>
      image.foodItems.filter((item) => {
        const itemDate = new Date(item.createdAt).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        return itemDate === today;
      })
    )
    .reduce(
      (acc, item) => ({
        fat: acc.fat + (item.fat || 0),
        carbs: acc.carbs + (item.carbs || 0),
        protein: acc.protein + (item.protein || 0),
        calories: acc.calories + (item.calories || 0),
      }),
      {
        fat: 0,
        carbs: 0,
        protein: 0,
        calories: 0,
      }
    );

  // Calculate percentages
  const percentages = {
    fat: values.fat / (foodItems.fatTarget / 100),
    carbs: values.carbs / (foodItems.carbTarget / 100),
    protein: values.protein / (foodItems.proteinTarget / 100),
    calories: values.calories / (foodItems.calorieTarget / 100),
  };

  return { values, percentages };
};

// Add default export
export default {
  transformFoodItemsToMeals,
  transformTargetsToSummary,
  transformFoodItemsToTargets,
};
