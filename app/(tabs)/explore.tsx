import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import PieCharts from '@/components/PieCharts';
import MealItem from '@/components/MealItem';
import { useAuth } from '@clerk/clerk-expo';
import { fetchMeals } from '../client';
import { transformFoodItemsToMeals } from '../services/renderTransforms';
import { TransformedMeal } from '../services/renderTransforms';
import { FoodItems } from '../client';

export const nutritionSummary = {
  fat: 65,
  carbs: 130,
  protein: 80,
  calories: 1800
};

export default function TabTwoScreen() {
  const { getToken } = useAuth();
  const [meals, setMeals] = React.useState<TransformedMeal[]>([]);
  const [targets, setTargets] = React.useState<{ calorieTarget: number, fatTarget: number, carbTarget: number, proteinTarget: number } | null>(null);
  const [nutritionSummary, setNutritionSummary] = React.useState({
    fat: 0,
    carbs: 0,
    protein: 0,
    calories: 0,
  });

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        const foodItems = await fetchMeals(token);
        if (foodItems) {
          const transformedMeals = transformFoodItemsToMeals(foodItems);
          setTargets({ calorieTarget: foodItems.calorieTarget, fatTarget: foodItems.fatTarget, carbTarget: foodItems.carbTarget, proteinTarget: foodItems.proteinTarget });
          setMeals(transformedMeals);

          // Calculate nutrition summary
          const summary = transformedMeals.reduce((acc: {
            fat: number;
            carbs: number;
            protein: number;
            calories: number;
          }, meal: TransformedMeal) => ({
            fat: acc.fat + meal.nutrition.fat,
            carbs: acc.carbs + meal.nutrition.carbs,
            protein: acc.protein + meal.nutrition.protein,
            calories: acc.calories + meal.nutrition.calories,
          }), {
            fat: 0,
            carbs: 0,
            protein: 0,
            calories: 0,
          });

          setNutritionSummary(summary);
        }
      } else {
        console.error('No token');
      }
    });
  }, []);

  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {targets && (
          <>
            <PieCharts
              fat={nutritionSummary.fat / (targets.fatTarget / 100)}
              carbs={nutritionSummary.carbs / (targets.carbTarget / 100)}
              protein={nutritionSummary.protein / (targets.proteinTarget / 100)}
              calories={nutritionSummary.calories / (targets.calorieTarget / 100)}
            />
            <View style={styles.nutritionSummary}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Calories</Text>
                <Text style={styles.values}>{Math.round(nutritionSummary.calories)} / {targets.calorieTarget}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Fat</Text>
                <Text style={styles.values}>{Math.round(nutritionSummary.fat)}g / {targets.fatTarget}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Carbs</Text>
                <Text style={styles.values}>{Math.round(nutritionSummary.carbs)}g / {targets.carbTarget}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>Protein</Text>
                <Text style={styles.values}>{Math.round(nutritionSummary.protein)}g / {targets.proteinTarget}g</Text>
              </View>
            </View>
          </>
        )}
        {Object.entries(groupedMeals).map(([date, dateMeals]) => (
          <View key={date} style={styles.section}>
            <Text style={styles.sectionTitle}>{date}</Text>
            {dateMeals.map((meal) => (
              <MealItem
                key={meal.id}
                name={meal.name}
                // image={meal.image}
                nutrition={meal.nutrition}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  values: {
    fontSize: 14,
    fontWeight: '600',
  },
});

