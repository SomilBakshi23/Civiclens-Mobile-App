import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from './src/theme/colors';

// Auth
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import ProfileSetupNavigator from './src/navigation/ProfileSetupNavigator';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import MapScreen from './src/screens/MapScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import UserDashboardScreen from './src/screens/UserDashboardScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import CivicPreferencesScreen from './src/screens/CivicPreferencesScreen';

import CustomTabBar from './src/components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Community" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* Hidden / Functional Screens */}
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="UserDashboard" component={UserDashboardScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, profile, isGuest, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 1. Not Authenticated (and not Guest) -> Auth Screen
  if (!user && !isGuest) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // 2. Authenticated but Incomplete Profile -> Setup Screen
  if (user && (!profile || !profile.isProfileComplete) && !isGuest) {
    return (
      <NavigationContainer>
        <ProfileSetupNavigator />
      </NavigationContainer>
    );
  }

  // 3. Authenticated & Complete OR Guest -> Main App
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* Stack Screens (Cover Tabs) */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="CivicPreferences" component={CivicPreferencesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
