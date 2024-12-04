import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveOnboardingCompleteToLocalStorage = async (isComplete: boolean) => {
    try {
        await AsyncStorage.setItem('@onboarding_complete', JSON.stringify(isComplete));
        console.log('Onboarding complete status saved to local storage:', isComplete);
    } catch (e) {
        console.error('Failed to save onboarding complete status to local storage:', e);
    }
};

interface MacroTarget {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const MacroSlider = ({
    label,
    value,
    max,
    onChange,
    color
}: {
    label: string;
    value: number;
    max: number;
    onChange: (value: number) => void;
    color: string;
}) => (
    <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
            delay: 200,
            duration: 1000,
            easing: Easing.out(Easing.ease)
        }}
        style={styles.sliderContainer}
    >
        <Text style={styles.label}>{label}</Text>
        <View style={styles.barContainer}>
            <Pressable
                style={styles.bar}
                onTouchStart={(e) => {
                    const { locationX } = e.nativeEvent;
                    const percentage = Math.min(Math.max(locationX / 300, 0), 1);
                    onChange(Math.round(percentage * max));
                }}
                onTouchMove={(e) => {
                    const { locationX } = e.nativeEvent;
                    const percentage = Math.min(Math.max(locationX / 300, 0), 1);
                    onChange(Math.round(percentage * max));
                }}
            >
                <LinearGradient
                    colors={[color, color + '80']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.fill,
                        { width: `${(value / max) * 100}%` }
                    ]}
                />
            </Pressable>
            <Text style={styles.value}>{value}</Text>
        </View>
    </MotiView>
);

export default function Onboarding({ onboardingComplete, setOnboardingComplete }: { onboardingComplete: boolean, setOnboardingComplete: (value: boolean) => void }) {
    const [step, setStep] = useState<'welcome' | 'targets'>('welcome');
    const [targets, setTargets] = useState<MacroTarget>({
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 65,
    });
    if (step === 'welcome') {
        return (
            <LinearGradient
                colors={['#E0F7FA', '#B2EBF2', '#80DEEA']}
                style={styles.container}
            >
                <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', duration: 1500 }}
                    style={styles.welcomeContainer}
                >
                    <Text style={styles.title}>Let's get started</Text>
                    <Pressable
                        style={styles.button}
                        onPress={() => setStep('targets')}
                    >
                        <Text style={styles.buttonText}>Go</Text>
                    </Pressable>
                </MotiView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#E0F7FA', '#B2EBF2', '#80DEEA']}
            style={styles.container}
        >
            <View style={styles.targetsContainer}>
                <Text style={styles.title}>Set Your Daily Targets</Text>

                <MacroSlider
                    label="Calories"
                    value={targets.calories}
                    max={4000}
                    onChange={(value) => setTargets(prev => ({ ...prev, calories: value }))}
                    color="#FF6B6B"
                />

                <MacroSlider
                    label="Protein (g)"
                    value={targets.protein}
                    max={300}
                    onChange={(value) => setTargets(prev => ({ ...prev, protein: value }))}
                    color="#4ECDC4"
                />

                <MacroSlider
                    label="Carbs (g)"
                    value={targets.carbs}
                    max={500}
                    onChange={(value) => setTargets(prev => ({ ...prev, carbs: value }))}
                    color="#45B7D1"
                />

                <MacroSlider
                    label="Fat (g)"
                    value={targets.fat}
                    max={150}
                    onChange={(value) => setTargets(prev => ({ ...prev, fat: value }))}
                    color="#96CEB4"
                />

                <Pressable
                    style={styles.button}
                    onPress={() => {
                        // Handle saving targets
                        console.log('Targets saved:', targets);


                        saveOnboardingCompleteToLocalStorage(true);
                        setOnboardingComplete(true);
                    }}
                >
                    <Text style={styles.buttonText}>Save Targets</Text>
                </Pressable>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        gap: 30,
    },
    targetsContainer: {
        width: '90%',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2C3E50',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    sliderContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    bar: {
        height: 30,
        width: 300,
        backgroundColor: '#E0E0E0',
        borderRadius: 15,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 15,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        minWidth: 50,
    },
}); 