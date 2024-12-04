import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function Sell({ setShowSell }: { setShowSell: (value: boolean) => void }) {
    return (
        <LinearGradient
            colors={['#E0F7FA', '#B2EBF2', '#80DEEA']}
            style={styles.container}
        >
            <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 1500 }}
                style={styles.contentContainer}
            >
                <Text style={styles.title}>Track your calories,</Text>
                <Text style={styles.subtitle}>thrive every day</Text>

                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 500, duration: 1000 }}
                >
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            setShowSell(false)
                        }}
                    >
                        <Text style={styles.buttonText}>First month for $1</Text>
                    </Pressable>
                </MotiView>
            </MotiView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        gap: 15,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 40,
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
}); 