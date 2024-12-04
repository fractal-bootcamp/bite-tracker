import { StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4ECDC4', dark: '#1D3D47' }}
      headerImage={
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)']}
          style={styles.headerGradient}
        />
      }>
      <ThemedView style={styles.container}>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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
});
