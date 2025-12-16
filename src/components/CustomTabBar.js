import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    // Filter out the 'Report' tab so it takes ZERO space in the bar
    const visibleRoutes = state.routes.filter(route => route.name !== 'Report');

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                {visibleRoutes.map((route, index) => {
                    // Find the original index in the complete state to manage focus correctly
                    const originalIndex = state.routes.findIndex(r => r.key === route.key);
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === originalIndex;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // explicit icon mapping for perfect consistency
                    let iconName;
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                    else if (route.name === 'Pulse') iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
                    else if (route.name === 'Map') iconName = isFocused ? 'map' : 'map-outline';
                    else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={isFocused ? colors.primary : colors.textSecondary}
                            />
                            <Text style={[
                                styles.label,
                                { color: isFocused ? colors.primary : colors.textSecondary }
                            ]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#050A14',
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
    content: {
        flexDirection: 'row',
        height: 60, // Fixed height for the content area (excluding safe area)
        alignItems: 'center',
    },
    tabItem: {
        flex: 1, // Logic: 100% / 4 items = 25% width each
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    },
});
