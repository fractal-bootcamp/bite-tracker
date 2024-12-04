import * as React from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import SignInScreen from '@/app/components/SignIn'
import SignUpScreen from '@/app/components/SignUp'
import Sell from '@/app/components/Sell'

export default function AuthScreen() {
    const [isSignIn, setIsSignIn] = React.useState(false)
    const [showSell, setShowSell] = React.useState(true)

    return (
        <LinearGradient
            colors={['#FF6B6B', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            {!showSell && (isSignIn ? (
                <SignInScreen onToggleAuth={() => setIsSignIn(false)} />
            ) : (
                <SignUpScreen onToggleAuth={() => setIsSignIn(true)} />
            ))}
            {showSell && <Sell setShowSell={setShowSell} />}
        </LinearGradient>
    )
} 