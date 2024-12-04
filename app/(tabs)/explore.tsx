import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import PieCharts from '@/components/PieCharts';
import MealItem from '@/components/MealItem';
import { useAuth } from '@clerk/clerk-expo';
import { fetchMeals } from '../client';
import { MealsAndSummary, transformFoodItemsToTargets, transformFoodItemstoMealsAndSummary } from '../services/renderTransforms';
import { TransformedMeal } from '../services/renderTransforms';

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

export default function TabTwoScreen() {
  const { getToken } = useAuth();
  const [meals, setMeals] = React.useState<MealsAndSummary>([]);
  const [targets, setTargets] = React.useState<{ calorieTarget: number, fatTarget: number, carbTarget: number, proteinTarget: number } | null>(null);
  // const [nutritionSummary, setNutritionSummary] = React.useState<NutritionSummary>({
  //   values: { fat: 0, carbs: 0, protein: 0, calories: 0 },
  //   percentages: { fat: 0, carbs: 0, protein: 0, calories: 0 },
  // });

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        const foodItems = await fetchMeals(token);

        if (foodItems) {
          setTargets({ calorieTarget: foodItems.calorieTarget, fatTarget: foodItems.fatTarget, carbTarget: foodItems.carbTarget, proteinTarget: foodItems.proteinTarget });

          const transformedMeals = transformFoodItemstoMealsAndSummary(foodItems);
          setMeals(transformedMeals);
        }
      } else {
        console.error('No token');
      }
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {Object.entries(meals).map(([_, dateMeals]) => (

          <View key={dateMeals.meals[0].date} style={styles.section}>
            {targets && (
              <>
                <Text style={styles.sectionTitle}>{dateMeals.meals[0].date}</Text>
                <PieCharts
                  fat={dateMeals.summary.percentages.fat}
                  carbs={dateMeals.summary.percentages.carbs}
                  protein={dateMeals.summary.percentages.protein}
                  calories={dateMeals.summary.percentages.calories}
                />
                <View style={styles.nutritionSummary}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Calories</Text>
                    <Text style={styles.values}>
                      {Math.round(dateMeals.summary.values.calories)} / {targets.calorieTarget}
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Fat</Text>
                    <Text style={styles.values}>
                      {Math.round(dateMeals.summary.values.fat)}g / {targets.fatTarget}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Carbs</Text>
                    <Text style={styles.values}>
                      {Math.round(dateMeals.summary.values.carbs)}g / {targets.carbTarget}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.label}>Protein</Text>
                    <Text style={styles.values}>
                      {Math.round(dateMeals.summary.values.protein)}g / {targets.proteinTarget}g
                    </Text>
                  </View>
                </View>
              </>
            )}
            {dateMeals.meals.map((meal) => (
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

