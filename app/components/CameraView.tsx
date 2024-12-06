import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import { CameraGrid } from './CameraGrid';
import Toast from 'react-native-toast-message';

interface CameraViewProps {
    onPictureTaken: (uri: string) => void;
}

export function CameraView({ onPictureTaken }: CameraViewProps) {
    const { getToken } = useAuth();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);
    const [showGrid, setShowGrid] = useState(false);

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
            const token = await getToken();
            if (!token) {
                console.error('No authentication token available');
                return;
            }
            // Convert URI to base64
            const imageResponse = await fetch(uri);
            const blob = await imageResponse.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    image: base64
                }),
            });

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Image uploaded successfully',
                    position: 'top'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to upload image',
                    position: 'top'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to upload image',
                position: 'bottom'
            });
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: false,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
                onPictureTaken(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    return (
        <View style={styles.container}>
            <ExpoCameraView
                ref={(ref) => setCameraRef(ref)}
                style={styles.camera}
                facing={facing}
            >
                {showGrid && <CameraGrid />}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.text}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setShowGrid(!showGrid)}>
                        <Text style={styles.text}>Grid</Text>
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
        justifyContent: 'space-around',
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