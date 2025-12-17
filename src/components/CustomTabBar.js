import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const { theme, isDarkMode } = useContext(ThemeContext);

    // Define the specific order of main tabs
    const mainTabs = ['Home', 'Map', 'Community', 'Profile'];

    const getIconName = (routeName, isFocused) => {
        switch (routeName) {
            case 'Home':
                return isFocused ? 'home' : 'home-outline';
            case 'Map':
                return isFocused ? 'map' : 'map-outline';
            case 'Community':
                return isFocused ? 'people' : 'people-outline';
            case 'Profile':
                return isFocused ? 'person' : 'person-outline';
            default:
                return 'ellipse-outline';
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <View style={[styles.bar, { backgroundColor: theme.tabBar, borderColor: theme.tabBarBorder, shadowColor: isDarkMode ? '#000' : '#ccc' }]}>
                {/* Left Side Tabs */}
                {mainTabs.slice(0, 2).map((routeName) => {
                    const route = state.routes.find(r => r.name === routeName);
                    // If route not found (e.g. implementation gap), skip safely
                    if (!route) return null;

                    const index = state.routes.indexOf(route);
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(routeName);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={getIconName(routeName, isFocused)}
                                size={24}
                                color={isFocused ? theme.primary : theme.textSecondary}
                            />
                        </TouchableOpacity>
                    );
                })}

                {/* Central Space Placeholder */}
                <View style={styles.middleSpace} />

                {/* Right Side Tabs */}
                {mainTabs.slice(2, 4).map((routeName) => {
                    const route = state.routes.find(r => r.name === routeName);
                    if (!route) return null;

                    const index = state.routes.indexOf(route);
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(routeName);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={getIconName(routeName, isFocused)}
                                size={24}
                                color={isFocused ? theme.primary : theme.textSecondary}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Floating Action Button (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Report')}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bar: {
        flexDirection: 'row',
        borderRadius: 24,
        height: 64,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 1,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    middleSpace: {
        width: 60, // Space for FAB
    },
    fab: {
        position: 'absolute',
        top: -24, // Raise it up
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B82F6', // Primary Blue
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        // Removed border as decided
    },
});
