import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current; // For Phases 1 & 3
    const scaleAnim = useRef(new Animated.Value(0.8)).current; // For Logo Entrance
    const circleScale = useRef(new Animated.Value(0)).current; // For Lens Pulse
    const circleOpacity = useRef(new Animated.Value(0)).current; // For Lens Pulse

    useEffect(() => {
        // 1️⃣ Phase 1: Fade In & Entrance (0 - 800ms)
        // Logo fades up and scales slightly to 1
        const phase1 = Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
        ]);

        // 2️⃣ Phase 2: Motion Focus - Pulse/Ripple (800ms - 1800ms)
        // A circle expands behind/around the logo to simulate a "lens" or "capture"
        const phase2 = Animated.parallel([
            Animated.timing(circleScale, {
                toValue: 2.5,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }),
            Animated.sequence([
                Animated.timing(circleOpacity, {
                    toValue: 0.1, // Subtle visibility
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(circleOpacity, {
                    toValue: 0, // Fade out ripple
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        ]);

        // 3️⃣ Phase 3: Exit Transition (1800ms - 2500ms)
        // Splash fades out, Logo scales up slightly (zoom effect into app)
        const phase3 = Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
                easing: Easing.in(Easing.cubic),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.2, // Zoom effect
                duration: 700,
                useNativeDriver: true,
            }),
        ]);

        // ✨ Run Sequence
        Animated.sequence([
            phase1,
            phase2,
            Animated.delay(200), // Short pause before exit
            phase3,
        ]).start(() => {
            // Notify parent to unmount splash
            if (onFinish) onFinish();
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Expanding Ripple/Lens Effect */}
            <Animated.View
                style={[
                    styles.circle,
                    {
                        transform: [{ scale: circleScale }],
                        opacity: circleOpacity,
                    },
                ]}
            />

            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo Icon */}
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="camera-iris" size={64} color="#60A5FA" />
                </View>

                {/* Brand Name */}
                <Text style={styles.title}>CivicLens</Text>

                {/* Tagline */}
                <Text style={styles.tagline}>See. Report. Improve.</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827', // Deep Navy / Charcoal
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Ensure it sits on top if used in a stack
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 20,
        shadowColor: '#60A5FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    tagline: {
        fontSize: 14,
        color: '#9CA3AF', // Gray-400
        fontWeight: '500',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    circle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#3B82F6', // Blue-500
        opacity: 0,
    },
});

export default SplashScreen;
