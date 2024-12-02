import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MealItemProps {
  name: string;
  image: string;
  nutrition: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

const MealItem: React.FC<MealItemProps> = ({ name, image, nutrition }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.nutritionBars}>
          <View style={[styles.bar, { width: `${nutrition.fat}%`, backgroundColor: '#FF6B6B' }]} />
          <View style={[styles.bar, { width: `${nutrition.carbs}%`, backgroundColor: '#4ECDC4' }]} />
          <View style={[styles.bar, { width: `${nutrition.protein}%`, backgroundColor: '#45B7D1' }]} />
          <View style={[styles.bar, { width: `${nutrition.calories / 10}%`, backgroundColor: '#FF8C42' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nutritionBars: {
    height: 20,
    flexDirection: 'row',
  },
  bar: {
    height: '100%',
    marginRight: 2,
  },
});

export default MealItem;

