import * as React from 'react'
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'

interface SignUpScreenProps {
    onToggleAuth: () => void
}

export default function SignUpScreen({ onToggleAuth }: SignUpScreenProps) {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <LinearGradient
            colors={['#E0F7FA', '#B2EBF2', '#80DEEA']}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Savor every moment...{'\n'} track with joy</Text>

                <Text style={styles.subtitle}>Create an account to get started</Text>

                {!pendingVerification && (
                    <>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email..."
                            placeholderTextColor="#rgba(0,0,0,0.6)" // Slightly lighter dark color for better visibility
                            onChangeText={(email) => setEmailAddress(email)}
                        />
                        <TextInput
                            style={styles.input}
                            value={password}
                            placeholder="Password..."
                            placeholderTextColor="#rgba(0,0,0,0.6)" // Slightly lighter dark color for better visibility
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )}

                {pendingVerification && (
                    <>
                        <Text style={styles.verificationText}>
                            We've sent a verification code to your email
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={code}
                            placeholder="Enter verification code..."
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            onChangeText={(code) => setCode(code)}
                        />
                        <TouchableOpacity style={styles.button} onPress={onPressVerify}>
                            <Text style={styles.buttonText}>Verify Email</Text>
                        </TouchableOpacity>
                    </>
                )}

                {!pendingVerification && (
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>Already have an account? </Text>
                        <TouchableOpacity onPress={onToggleAuth}>
                            <Text style={styles.link}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)', // Changed to white for a more inviting feel
        padding: 20,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // iOS shadow color
        shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
        shadowOpacity: 0.3, // iOS shadow opacity
        shadowRadius: 4, // iOS shadow radius
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        color: '#34495E',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 0.3,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 16,
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#BDC3C7',
    },
    button: {
        backgroundColor: '#E74C3C',  // Professional yet attention-grabbing red
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,  // Slightly smaller, more refined text
        fontWeight: '600',  // Semi-bold instead of bold
        letterSpacing: 0.5,  // Subtle letter spacing for elegance
    },
    verificationText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    linkText: {
        color: 'rgba(255,255,255,0.8)',
    },
    link: {
        color: 'white',
        fontWeight: 'bold',
    },
})