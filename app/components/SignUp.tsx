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
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome to BiteTracker</Text>
                <Text style={styles.subtitle}>Savor every moment, track with joy</Text>

                {!pendingVerification && (
                    <>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email..."
                            placeholderTextColor="#rgba(255,255,255,0.7)"
                            onChangeText={(email) => setEmailAddress(email)}
                        />
                        <TextInput
                            style={styles.input}
                            value={password}
                            placeholder="Password..."
                            placeholderTextColor="#rgba(255,255,255,0.7)"
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 20,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
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
    },
    button: {
        backgroundColor: '#FF6B6B',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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