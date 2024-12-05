import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store'
import Onboarding from './components/Onboarding';



import { useColorScheme } from '@/hooks/useColorScheme';
import SignUpScreen from './components/SignUp';
import AuthScreen from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//this stores the clerk token in the secure store to persist the user's session token.
//this approach is recommended for production apps (as opposed to the default in-memory approach)
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

// Add this new component to handle user creation
function InitializeUser() {
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const createUser = async () => {
      try {
        const token = await getToken();
        if (token && userId) {
          // Call your backend to create/initialize user
          const response = await fetch('http://localhost:3000/initialize-user', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('User initialization response:', await response.json());
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    createUser();
  }, [userId]);

  return null;
}

export default function RootLayout() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    const checkOnboardingComplete = async () => {
      const value = await AsyncStorage.getItem('@onboarding_complete');
      setOnboardingComplete(value === 'true');
    };
    checkOnboardingComplete();
  }, []);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <InitializeUser />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SignedIn>
          {!onboardingComplete && <Onboarding onboardingComplete={onboardingComplete} setOnboardingComplete={setOnboardingComplete} />}
          {onboardingComplete && <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>}
          <StatusBar style="auto" />
        </SignedIn>
        <SignedOut>
          <AuthScreen />
        </SignedOut>
      </ThemeProvider>
      <Toast />
    </ClerkProvider>
  );
}
