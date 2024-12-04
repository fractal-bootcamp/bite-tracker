import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface PieChartsProps {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
}

const PieCharts: React.FC<PieChartsProps> = ({ fat, carbs, protein, calories }) => {
  const renderPieChart = (value: number, color: string, label: string) => (
    <View style={styles.pieContainer}>
      <PieChart
        data={[
          { value, color },
          { value: 100 - value, color: '#FFE66D' }
        ]}
        donut
        radius={40}
        innerRadius={25}
        innerCircleColor={'#fff'}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderPieChart(fat, '#FF6B6B', 'Fat')}
      {renderPieChart(carbs, '#4ECDC4', 'Carbs')}
      {renderPieChart(protein, '#45B7D1', 'Protein')}
      {renderPieChart(calories, '#FF8C42', 'Calories')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  pieContainer: {
    alignItems: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PieCharts;

