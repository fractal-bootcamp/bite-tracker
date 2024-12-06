import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { TransformedMeal } from '../app/services/renderTransforms';
import { FatIcon, CarbsIcon, ProteinIcon, CaloriesIcon } from './svgs/icons';

interface MealItemProps {
  meal: TransformedMeal;
  onUpdate: (updatedMeal: TransformedMeal) => void;
}

const MealItem: React.FC<MealItemProps> = ({ meal, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeal, setEditedMeal] = useState(meal);

  const getFatSize = () => 24 + (editedMeal.nutrition.fat / 50) * 24;
  const getCarbsSize = () => 24 + (editedMeal.nutrition.carbs / 100) * 24;
  const getProteinSize = () => 24 + (editedMeal.nutrition.protein / 50) * 24;
  const getCaloriesSize = () => 24 + (editedMeal.nutrition.calories / 1000) * 24;

  const handleSave = () => {
    onUpdate(editedMeal);
    setIsEditing(false);
  };

  const updateNutrition = (key: keyof typeof meal.nutrition, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedMeal({
      ...editedMeal,
      nutrition: {
        ...editedMeal.nutrition,
        [key]: numValue
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{meal.name}</Text>
        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nutritionContainer}>
        <View style={styles.macroItem}>
          <CaloriesIcon size={Math.min(48, getCaloriesSize())} />
          {isEditing ? (
            <TextInput
              style={styles.macroInput}
              value={String(Math.round(editedMeal.nutrition.calories))}
              onChangeText={(value) => updateNutrition('calories', value)}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.macroValue}>{Math.round(editedMeal.nutrition.calories)}</Text>
          )}
        </View>

        <View style={styles.macroItem}>
          <CarbsIcon size={Math.min(48, getCarbsSize())} />
          {isEditing ? (
            <TextInput
              style={styles.macroInput}
              value={String(Math.round(editedMeal.nutrition.carbs))}
              onChangeText={(value) => updateNutrition('carbs', value)}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.macroValue}>{Math.round(editedMeal.nutrition.carbs)}g</Text>
          )}
        </View>

        <View style={styles.macroItem}>
          <FatIcon size={Math.min(48, getFatSize())} />
          {isEditing ? (
            <TextInput
              style={styles.macroInput}
              value={String(Math.round(editedMeal.nutrition.fat))}
              onChangeText={(value) => updateNutrition('fat', value)}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.macroValue}>{Math.round(editedMeal.nutrition.fat)}g</Text>
          )}
        </View>

        <View style={styles.macroItem}>
          <ProteinIcon size={Math.min(48, getProteinSize())} />
          {isEditing ? (
            <TextInput
              style={styles.macroInput}
              value={String(Math.round(editedMeal.nutrition.protein))}
              onChangeText={(value) => updateNutrition('protein', value)}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.macroValue}>{Math.round(editedMeal.nutrition.protein)}g</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: '25%',
  },
  macroValue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 0,
    marginRight: 2,
    minWidth: 50,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  macroInput: {
    fontSize: 14,
    color: '#666',
    marginLeft: 0,
    marginRight: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 50,
    width: 50,
    textAlign: 'center',
  },
});

export default MealItem;

