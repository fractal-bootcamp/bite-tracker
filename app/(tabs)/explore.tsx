import { Image, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import PieCharts from '@/components/PieCharts';
import MealItem from '@/components/MealItem';
import { useAuth } from '@clerk/clerk-expo';

export const nutritionSummary = {
  fat: 65,
  carbs: 130,
  protein: 80,
  calories: 1800
};

export const meals = [
  {
    id: 1,
    date: 'Today',
    name: 'Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    nutrition: {
      fat: 15,
      carbs: 10,
      protein: 25,
      calories: 320
    }
  },
  {
    id: 2,
    date: 'Today',
    name: 'Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    nutrition: {
      fat: 12,
      carbs: 45,
      protein: 15,
      calories: 380
    }
  },
  {
    id: 3,
    date: 'Yesterday',
    name: 'Salmon with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    nutrition: {
      fat: 22,
      carbs: 30,
      protein: 28,
      calories: 450
    }
  },
  {
    id: 4,
    date: 'Yesterday',
    name: 'Greek Yogurt with Berries',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    nutrition: {
      fat: 5,
      carbs: 25,
      protein: 15,
      calories: 200
    }
  }
];

const fetchMeals = async (token: string) => {
  if (!process.env.EXPO_PUBLIC_BACKEND_URL) {
    throw new Error("Missing EXPO_PUBLIC_BACKEND_URL");
  }
  const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/user-food-history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
};
export default function TabTwoScreen() {
  // Inside your component:
  const { getToken } = useAuth()
  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        fetchMeals(token);
      }
      else {
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
        <PieCharts
          fat={nutritionSummary.fat}
          carbs={nutritionSummary.carbs}
          protein={nutritionSummary.protein}
          calories={nutritionSummary.calories / 20} // Assuming 2000 calories is 100%
        />
        {Object.entries(groupedMeals).map(([date, dateMeals]) => (
          <View key={date} style={styles.section}>
            <Text style={styles.sectionTitle}>{date}</Text>
            {dateMeals.map((meal) => (
              <MealItem
                key={meal.id}
                name={meal.name}
                image={meal.image}
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
});

