import { Stack } from 'expo-router';

import { CameraView } from '@/app/components/CameraView';

export default function CameraScreen() {
    const handlePictureTaken = (uri: string) => {
        // Handle the captured image URI here
        console.log('Picture taken:', uri);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <CameraView onPictureTaken={handlePictureTaken} />
        </>
    );
}
