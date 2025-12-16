import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const { user, profile, logout, isGuest, refreshProfile } = useContext(AuthContext);
    const [updatingImage, setUpdatingImage] = useState(false);

    const handleLogout = () => {
        Alert.alert(
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
            Alert.alert("Guest Mode", "Guests cannot change profile photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
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
                Alert.alert("Success", "Profile photo updated!");
            } else {
                Alert.alert("Error", "Failed to update profile photo.");
            }
            setUpdatingImage(false);
        }
    };

    // Safe access to profile data (Guest fallback)
    const displayName = profile?.name || (isGuest ? "Guest Citizen" : "Loading...");
    const displayArea = profile?.area || "CivicLens Community";
    const displayCivicId = profile?.civicId || (isGuest ? "GUEST-MODE" : "----");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>User Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header / Profile Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profile?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60' }} // Avatar from Profile
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBadge} onPress={pickImage} disabled={updatingImage}>
                            {updatingImage ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="pencil" size={14} color="white" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{displayName}</Text>
                        <Text style={styles.location}>{displayArea}</Text>
                        <View style={styles.civicIdBadge}>
                            <Text style={styles.civicIdLabel}>CIVIC ID: </Text>
                            <Text style={styles.civicIdValue}>{displayCivicId}</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.civicScore || 0}</Text>
                        <Text style={styles.statLabel}>Civic Score</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.reportsCount || 0}</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.rank || "New"}</Text>
                        <Text style={styles.statLabel}>Rank</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    {!isGuest && (
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
                            <View style={styles.menuIconBox}>
                                <Ionicons name="person-outline" size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.menuText}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CivicPreferences')}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="options-outline" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.menuText}>Civic Preferences</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Support & Legal</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="help-circle-outline" size={20} color="#8B5CF6" />
                        </View>
                        <Text style={styles.menuText}>Help Center</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
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
