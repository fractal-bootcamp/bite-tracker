import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';

interface CameraViewProps {
    onPictureTaken: (uri: string) => void;
}

export function CameraView({ onPictureTaken }: CameraViewProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.text}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.takePictureAsync({
                    shutterSound: false
                });
                if (photo) {
                    await uploadImage(photo.uri);
                    onPictureTaken(photo.uri);
                }
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            // Convert URI to base64
            const response = await fetch(uri);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            await fetch('http://localhost:3000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64
                }),
            });
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ExpoCameraView
                ref={(ref) => setCameraRef(ref)}
                style={styles.camera}
                facing={facing}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </ExpoCameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
        justifyContent: 'space-between',
    },
    button: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});