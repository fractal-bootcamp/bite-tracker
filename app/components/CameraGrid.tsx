import { View, StyleSheet } from 'react-native';

export function CameraGrid() {
    return (
        <View style={styles.container}>
            {/* Vertical lines */}
            <View style={[styles.line, styles.verticalLine, { left: '33%' }]} />
            <View style={[styles.line, styles.verticalLine, { left: '66%' }]} />

            {/* Horizontal lines */}
            <View style={[styles.line, styles.horizontalLine, { top: '33%' }]} />
            <View style={[styles.line, styles.horizontalLine, { top: '66%' }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    line: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    verticalLine: {
        width: 1,
        height: '100%',
    },
    horizontalLine: {
        height: 1,
        width: '100%',
    },
});