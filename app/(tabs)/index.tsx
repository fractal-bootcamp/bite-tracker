import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@clerk/clerk-expo';
import { updateTargets, fetchMeals } from '../client';
import { showToast } from '../utils/toast';

interface Targets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealsResponse {
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
}

interface TargetInputProps {
  label: string;
  value: number;
  isEditing: boolean;
  onChangeText: (value: string) => void;
}

export default function HomeScreen(): JSX.Element {
  const { signOut, getToken } = useAuth();

  const [targets, setTargets] = useState<Targets>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        try {
          const foodItems: MealsResponse = await fetchMeals(token);
          if (foodItems) {
            setTargets({
              calories: foodItems.calorieTarget,
              protein: foodItems.proteinTarget,
              carbs: foodItems.carbTarget,
              fat: foodItems.fatTarget,
            });
          }
        } catch (error) {
          console.error('Error fetching targets:', error);
        }
      }
    });
  }, [getToken]);

  const handleSaveTargets = async (): Promise<void> => {
    try {
      const token = await getToken();
      if (token) {
        await updateTargets(token, targets);
        setIsEditing(false);
        showToast.success('Targets updated successfully');
      }
    } catch (error) {
      console.error('Error saving targets:', error);
      showToast.error('Failed to update targets');
    }
  };

  const TargetInput: React.FC<TargetInputProps> = ({ label, value, isEditing, onChangeText }) => (
    <ThemedView style={styles.targetItem}>
      <ThemedText style={styles.targetLabel}>{label}</ThemedText>
      {isEditing ? (
        <TextInput
          style={styles.targetInput}
          value={value.toString()}
          onChangeText={onChangeText}
          keyboardType="numeric"
        />
      ) : (
        <ThemedText style={styles.targetValue}>{value}</ThemedText>
      )}
    </ThemedView>
  );

  const renderTargetsSection = (): JSX.Element => (
    <ThemedView style={styles.statsContainer}>
      <View style={styles.titleRow}>
        <ThemedText style={styles.statsTitle}>Daily Targets</ThemedText>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <ThemedText style={styles.editButton}>Edit</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSaveTargets}>
            <ThemedText style={styles.saveButton}>Save</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      <ThemedView style={styles.statsGrid}>
        <TargetInput
          label="Calories"
          value={targets.calories}
          isEditing={isEditing}
          onChangeText={(value) => setTargets((prev) => ({ ...prev, calories: parseInt(value, 10) || 0 }))}
        />
        <TargetInput
          label="Protein (g)"
          value={targets.protein}
          isEditing={isEditing}
          onChangeText={(value) => setTargets((prev) => ({ ...prev, protein: parseInt(value, 10) || 0 }))}
        />
        <TargetInput
          label="Carbs (g)"
          value={targets.carbs}
          isEditing={isEditing}
          onChangeText={(value) => setTargets((prev) => ({ ...prev, carbs: parseInt(value, 10) || 0 }))}
        />
        <TargetInput
          label="Fat (g)"
          value={targets.fat}
          isEditing={isEditing}
          onChangeText={(value) => setTargets((prev) => ({ ...prev, fat: parseInt(value, 10) || 0 }))}
        />
      </ThemedView>
    </ThemedView>
  );

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemedView style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.welcomeContainer}>
            <ThemedText style={styles.welcomeText}>Welcome back!</ThemedText>
          </ThemedView>

          <ThemedView style={styles.mainContent}>
            <ThemedText type="title" style={styles.title}>
              Track Your Meals
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Take a photo of your food and let AI calculate the calories
            </ThemedText>

            <Link href="/camera" asChild>
              <TouchableOpacity style={styles.cameraButton}>
                <IconSymbol name="house.fill" size={32} color="#fff" />
                <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/explore" asChild>
              <TouchableOpacity style={styles.historyButton}>
                <IconSymbol name="paperplane.fill" size={24} color="#4ECDC4" />
                <ThemedText style={styles.historyButtonText}>View History</ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>

          {renderTargetsSection()}

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeContainer: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.8,
  },
  mainContent: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  historyButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 20,
    marginBottom: 40,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  targetItem: {
    alignItems: 'center',
    marginVertical: 8,
    width: '45%',
  },
  targetLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  targetInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    borderBottomWidth: 1,
    borderBottomColor: '#4ECDC4',
    paddingVertical: 2,
    textAlign: 'center',
    minWidth: 80,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});
