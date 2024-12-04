import { FoodItems } from "../client";
import { formatDate } from "../utils/dates";

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

export type MealsAndSummary = {
  meals: TransformedMeal[];
  summary: NutritionSummary;
}[];

export const transformFoodItemstoMealsAndSummary = (
  foodItems: FoodItems
): MealsAndSummary => {
  const meals = transformFoodItemsToMeals(foodItems);
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  const mealsWithSummary = Object.values(groupedMeals).map((dateMeals) => {
    const summary = transformFoodItemsToTargets(dateMeals, {
      fatTarget: foodItems.fatTarget,
      carbTarget: foodItems.carbTarget,
      proteinTarget: foodItems.proteinTarget,
      calorieTarget: foodItems.calorieTarget,
    });
    return {
      meals: dateMeals,
      summary,
    };
  });

  return mealsWithSummary;
};

const transformFoodItemsToMeals = (foodItems: FoodItems): TransformedMeal[] => {
  return foodItems.images.flatMap((image, index) => {
    return image.foodItems.map((foodItem) => ({
      id: foodItem.id, // You might want to use a more unique ID
      date: formatDate(new Date(foodItem.createdAt)),
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
  foodItems: TransformedMeal[],
  targets: {
    fatTarget: number;
    carbTarget: number;
    proteinTarget: number;
    calorieTarget: number;
  }
): NutritionSummary => {
  // Calculate total values
  const values = foodItems.reduce(
    (acc, item) => ({
      fat: acc.fat + (item.nutrition.fat || 0),
      carbs: acc.carbs + (item.nutrition.carbs || 0),
      protein: acc.protein + (item.nutrition.protein || 0),
      calories: acc.calories + (item.nutrition.calories || 0),
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
    fat: values.fat / (targets.fatTarget / 100),
    carbs: values.carbs / (targets.carbTarget / 100),
    protein: values.protein / (targets.proteinTarget / 100),
    calories: values.calories / (targets.calorieTarget / 100),
  };
  console.log("values", values);

  return { values, percentages };
};

// Add default export
export default {
  transformFoodItemsToMeals,
  transformFoodItemsToTargets,
};
