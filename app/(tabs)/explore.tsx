import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import PieCharts from '@/components/PieCharts';
import MealItem from '@/components/MealItem';
import { useAuth } from '@clerk/clerk-expo';
import { fetchMeals } from '../client';
import { MealsAndSummary, transformFoodItemsToTargets, transformFoodItemstoMealsAndSummary } from '../services/renderTransforms';
import { TransformedMeal } from '../services/renderTransforms';
import { LinearGradient } from 'expo-linear-gradient';

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

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        try {
          const foodItems = await fetchMeals(token);
          if (foodItems) {
            setTargets({
              calorieTarget: foodItems.calorieTarget,
              fatTarget: foodItems.fatTarget,
              carbTarget: foodItems.carbTarget,
              proteinTarget: foodItems.proteinTarget
            });

            const transformedMeals = transformFoodItemstoMealsAndSummary(foodItems);
            setMeals(transformedMeals);
          }
        } catch (error) {
          console.error('Error in data fetching:', error);
        }
      }
    }).catch(error => {
      console.error('Error getting token:', error);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Macro Dashboard</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(meals).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No meals logged yet</Text>
            <Text style={styles.emptyStateSubtext}>Your nutrition tracking will appear here</Text>
          </View>
        ) : (
          Object.entries(meals).map(([_, dateMeals]) => (
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#b2ebf2',
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 1,
    fontWeight: 'bold',
    color: "#d0d0d0", // darker off-white color
    textAlign: 'left',
  },
  scrollContent: {
    paddingTop: 15,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

