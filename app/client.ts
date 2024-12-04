import { FoodItem } from "@prisma/client";

export interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type FoodItems = {
  fatTarget: number;
  proteinTarget: number;
  carbTarget: number;
  calorieTarget: number;
  images: {
    foodItems: FoodItem[];
  }[];
};

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!API_URL) {
  throw new Error("Missing EXPO_PUBLIC_BACKEND_URL");
}

export const updateTargets = async (token: string, targets: MacroTarget) => {
  try {
    const response = await fetch(`${API_URL}/update-targets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(targets),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error(`Failed to save targets: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving targets:", error);
    throw error;
  }
};

export const fetchMeals = async (token: string) => {
  const response = await fetch(`${API_URL}/user-food-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const foodItems: FoodItems = data["data"];
  console.log(foodItems);
  return foodItems;
};

export default {
  updateTargets,
  fetchMeals,
};
