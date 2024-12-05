import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';

const FatIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      d="M50 5 C80 5, 95 35, 95 65 C95 85, 75 95, 50 95 C25 95, 5 85, 5 65 C5 35, 20 5, 50 5"
      fill="#FFC107"
      stroke="#FFA000"
      strokeWidth="2"
    />
    <Path
      d="M35 25 C45 15, 60 25, 65 40"
      fill="none"
      stroke="#FFE082"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </Svg>
);

const CarbsIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="40" fill="#8D6E63" />
    <Path
      d="M30 30 L70 70 M40 25 L75 60 M25 40 L60 75"
      stroke="#D7CCC8"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <Circle cx="50" cy="50" r="15" fill="#D7CCC8" />
  </Svg>
);

const ProteinIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="40" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
    <Path
      d="M30 50 Q50 20, 70 50 Q50 80, 30 50"
      fill="none"
      stroke="#81C784"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <Circle cx="30" cy="50" r="6" fill="#81C784" />
    <Circle cx="70" cy="50" r="6" fill="#81C784" />
  </Svg>
);

const CaloriesIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      d="M50 5 C70 25, 90 45, 90 70 C90 85, 75 95, 50 95 C25 95, 10 85, 10 70 C10 45, 30 25, 50 5"
      fill="#FF5722"
    />
    <Path
      d="M50 20 C60 35, 70 50, 70 65 C70 80, 60 85, 50 85 C40 85, 30 80, 30 65 C30 50, 40 35, 50 20"
      fill="#FFCCBC"
    />
  </Svg>
);

interface MealItemProps {
  name: string;
  // image: string;
  nutrition: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

const MealItem: React.FC<MealItemProps> = ({ name, nutrition }) => {
  const getFatSize = () => 24 + (nutrition.fat / 50) * 24;
  const getCarbsSize = () => 24 + (nutrition.carbs / 100) * 24;
  const getProteinSize = () => 24 + (nutrition.protein / 50) * 24;
  const getCaloriesSize = () => 24 + (nutrition.calories / 1000) * 24;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.nutritionContainer}>
        <View style={styles.macroItem}>
          <FatIcon size={Math.min(48, getFatSize())} />
          <Text style={styles.macroValue}>{Math.round(nutrition.fat)}g</Text>
        </View>

        <View style={styles.macroItem}>
          <CarbsIcon size={Math.min(48, getCarbsSize())} />
          <Text style={styles.macroValue}>{Math.round(nutrition.carbs)}g</Text>
        </View>

        <View style={styles.macroItem}>
          <ProteinIcon size={Math.min(48, getProteinSize())} />
          <Text style={styles.macroValue}>{Math.round(nutrition.protein)}g</Text>
        </View>

        <View style={styles.macroItem}>
          <CaloriesIcon size={Math.min(48, getCaloriesSize())} />
          <Text style={styles.macroValue}>{Math.round(nutrition.calories)}</Text>
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
    gap: 8,
  },
  macroValue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default MealItem;

