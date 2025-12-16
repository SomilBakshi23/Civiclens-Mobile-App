import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme/colors';

// Screens
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';
import CustomTabBar from './components/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <Tab.Navigator
                tabBar={props => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Pulse" component={DashboardScreen} />
                <Tab.Screen name="Report" component={ReportScreen} />
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Profile" component={View} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
