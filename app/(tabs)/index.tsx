import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
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

          <ThemedView style={styles.statsContainer}>
            <ThemedText style={styles.statsTitle}>Today's Summary</ThemedText>
            <ThemedView style={styles.statsGrid}>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statNumber}>0</ThemedText>
                <ThemedText style={styles.statLabel}>Meals</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statNumber}>0</ThemedText>
                <ThemedText style={styles.statLabel}>Calories</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statNumber}>0g</ThemedText>
                <ThemedText style={styles.statLabel}>Protein</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

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
    justifyContent: 'space-around',
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
});
