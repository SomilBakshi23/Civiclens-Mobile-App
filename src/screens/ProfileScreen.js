import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Modal, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { updateUserProfile } from '../services/userService';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const { user, profile, logout, isGuest, refreshProfile } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);

    const { showAlert } = useAlert();
    const [updatingImage, setUpdatingImage] = useState(false);
    const [localProfile, setLocalProfile] = useState(profile);

    // Sync profile when screen is focused (to get latest verification status)
    useFocusEffect(
        React.useCallback(() => {
            if (!user) return;
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) {
                    setLocalProfile(doc.data());
                }
            });
            return () => unsub();
        }, [user])
    );

    // Fallback to localProfile if available, else context profile
    const displayProfile = localProfile || profile;

    const handleLogout = () => {
        showAlert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: () => logout() }
            ]
        );
    };

    const pickImage = async () => {
        if (isGuest) {
            showAlert("Guest Mode", "Guests cannot change profile photos.");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setUpdatingImage(true);
                const newPhotoURL = result.assets[0].uri;

                const updateData = {
                    photoURL: newPhotoURL
                };

                const updateResult = await updateUserProfile(user.uid, updateData);

                if (updateResult.success) {
                    await refreshProfile();
                    showAlert("Success", "Profile photo updated!");
                } else {
                    showAlert("Error", "Failed to update profile photo.");
                }
                setUpdatingImage(false);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            showAlert("Error", "Failed to pick image.");
            setUpdatingImage(false);
        }
    };

    // Safe access to profile data (Guest fallback)
    const displayName = displayProfile?.name || (isGuest ? "Guest Citizen" : "Loading...");
    const displayArea = displayProfile?.area || "CivicLens Community";
    const displayCivicId = displayProfile?.civicId || (isGuest ? "GUEST-MODE" : "----");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>User Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header / Profile Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: displayProfile?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60' }} // Avatar from Profile
                            style={[styles.avatar, { borderColor: theme.surfaceLight }]}
                        />
                        <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.primary, borderColor: theme.background }]} onPress={pickImage} disabled={updatingImage}>
                            {updatingImage ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="pencil" size={14} color="white" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.name, { color: theme.textPrimary }]}>{displayName}</Text>
                            {displayProfile?.isVerified && (
                                <MaterialCommunityIcons name="check-decagram" size={24} color="#3B82F6" style={{ marginLeft: 6, marginBottom: 4 }} />
                            )}
                        </View>
                        <Text style={[styles.location, { color: theme.textSecondary }]}>{user?.email || "No Email"}</Text>
                        <View style={[styles.civicIdBadge, { backgroundColor: theme.infoBg, borderColor: theme.infoBg }]}>
                            <Text style={[styles.civicIdLabel, { color: theme.primary }]}>CIVIC ID: </Text>
                            <Text style={[styles.civicIdValue, { color: theme.textPrimary }]}>{displayCivicId}</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>

                    {/* Theme Toggle */}
                    {/* Theme Toggle */}
                    <View style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={20} color={isDarkMode ? "#F59E0B" : "#F97316"} />
                        </View>
                        <Text style={[styles.menuText, { color: theme.textPrimary }]}>{isDarkMode ? "Dark Mode" : "Light Mode"}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: theme.primary }}
                            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleTheme}
                            value={isDarkMode}
                        />
                    </View>

                    {!isGuest && (
                        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('EditProfile')}>
                            <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                <Ionicons name="person-outline" size={20} color={theme.primary} />
                            </View>
                            <Text style={[styles.menuText, { color: theme.textPrimary }]}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('CivicPreferences')}>
                        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Ionicons name="options-outline" size={20} color="#10B981" />
                        </View>
                        <Text style={[styles.menuText, { color: theme.textPrimary }]}>Civic Preferences</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Support & Legal</Text>

                    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('Privacy')}>
                        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#F59E0B" />
                        </View>
                        <Text style={[styles.menuText, { color: theme.textPrimary }]}>Privacy & Security</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('HelpCenter')}>
                        <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Ionicons name="help-circle-outline" size={20} color="#8B5CF6" />
                        </View>
                        <Text style={[styles.menuText, { color: theme.textPrimary }]}>Help Center</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.surfaceLight,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    profileInfo: {
        alignItems: 'center',
    },
    name: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    location: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 12,
    },
    civicIdBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    civicIdLabel: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    civicIdValue: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#0F1623',
        marginHorizontal: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F1623',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        padding: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 12,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

