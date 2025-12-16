import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from './theme/colors';

// Screens
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#050A14',
                        borderTopColor: '#1E293B',
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Pulse"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            <MaterialCommunityIcons
                                name={focused ? "clipboard-text" : "clipboard-text-outline"}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Report"
                    component={ReportScreen}
                    options={{
                        tabBarButton: () => null, // Hidden from tab bar, accessed via FAB/Hero
                        tabBarStyle: { display: 'none' }, // Hide tab bar on report screen
                    }}
                />
                <Tab.Screen
                    name="Map"
                    component={MapScreen}
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={View} // Placeholder
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
