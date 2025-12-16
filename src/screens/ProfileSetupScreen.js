import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

export default function ProfileSetupScreen() {
    const { user, profile, refreshProfile } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [gender, setGender] = useState(''); // 'male', 'female', 'other'
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isCustomAvatar, setIsCustomAvatar] = useState(false); // Track if user manually picked/randomized
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill only if editing (Profile Complete). If setup (Incomplete), force empty.
    useEffect(() => {
        if (profile && profile.isProfileComplete) {
            if (profile.name) setName(profile.name);
            if (profile.area) setArea(profile.area);
            if (profile.gender) setGender(profile.gender);
            if (profile.photoURL) {
                setAvatarUrl(profile.photoURL);
                setIsCustomAvatar(true);
            }
        }
    }, [profile]);

    // Auto-set default avatar based on gender if NOT custom
    useEffect(() => {
        if (!isCustomAvatar) {
            if (gender === 'male') {
                setAvatarUrl('https://api.dicebear.com/7.x/avataaars/png?seed=Felix');
            } else if (gender === 'female') {
                setAvatarUrl('https://api.dicebear.com/7.x/avataaars/png?seed=Aneka');
            } else {
                setAvatarUrl('https://api.dicebear.com/7.x/avataaars/png?seed=CivicLensUsers'); // Catch-all default
            }
        }
    }, [gender, isCustomAvatar]);


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], // New format: ImagePicker.MediaType.Images is deprecated
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatarUrl(result.assets[0].uri);
            setIsCustomAvatar(true);
        }
    };

    const randomizeAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        // Using 'avataaars' style for a fun look, or 'micah' / 'notionists' for modern feel. 'avataaars' is standard.
        // NOT restricting by gender as requested.
        const newAvatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${randomSeed}`;
        setAvatarUrl(newAvatar);
        setIsCustomAvatar(true);
    };

    const handleCompleteSetup = async () => {
        if (!name.trim() || !area.trim()) {
            Alert.alert("Required Fields", "Please enter your full name and local area.");
            return;
        }
        if (!gender) {
            Alert.alert("Required Fields", "Please select your gender.");
            return;
        }

        setIsSubmitting(true);

        const updateData = {
            name: name.trim(),
            area: area.trim(),
            gender: gender,
            photoURL: avatarUrl,
            isProfileComplete: true, // Mark as complete!
        };

        const result = await updateUserProfile(user.uid, updateData);

        if (result.success) {
            await refreshProfile(); // Refresh context to trigger App.js routing update

            // Gamification / Welcome Notification
            Alert.alert(
                "Welcome, Citizen!",
                "Your profile is complete. You have been awarded 100 Civic Points to start your journey!",
                [{ text: "Let's Go!" }]
            );
        } else {
            Alert.alert("Error", "Failed to save profile. Please try again.");
            setIsSubmitting(false);
        }
    };

    // If profile hasn't loaded yet
    if (!profile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>You're almost there! We've generated your unique Civic ID.</Text>
                    </View>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                            <TouchableOpacity style={styles.editIconBadge} onPress={pickImage}>
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.avatarActions}>
                            <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                                <Text style={styles.actionBtnText}>Upload Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={randomizeAvatar}>
                                <MaterialCommunityIcons name="dice-3" size={18} color={colors.primary} style={{ marginRight: 4 }} />
                                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Randomize</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Validated Civic ID Card */}
                    <View style={styles.civicIdCard}>
                        <Text style={styles.civicIdLabel}>YOUR CIVIC ID</Text>
                        <Text style={styles.civicIdValue}>{profile.civicId || "GENERATING..."}</Text>
                        <View style={styles.verifiedBadge}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color="#10B981" />
                            <Text style={styles.verifiedText}>Verified Unique ID</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>

                        {/* Gender Selection */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.genderContainer}>
                                {['male', 'female', 'other'].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[
                                            styles.genderOption,
                                            gender === g && styles.genderOptionSelected
                                        ]}
                                        onPress={() => setGender(g)}
                                    >
                                        <MaterialCommunityIcons
                                            name={g === 'male' ? 'gender-male' : g === 'female' ? 'gender-female' : 'gender-non-binary'}
                                            size={20}
                                            color={gender === g ? 'white' : colors.textSecondary}
                                        />
                                        <Text style={[
                                            styles.genderText,
                                            gender === g && styles.genderTextSelected
                                        ]}>
                                            {g.charAt(0).toUpperCase() + g.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Jane Doe"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Area / Locality</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Downtown, Sector 4"
                                placeholderTextColor={colors.textTertiary}
                                value={area}
                                onChangeText={setArea}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleCompleteSetup}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.btnText}>Complete Setup</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        maxWidth: '80%',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.surfaceLight,
        backgroundColor: colors.surface,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.background,
    },
    avatarActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    secondaryBtn: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    civicIdCard: {
        backgroundColor: '#0F1623',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 32,
        width: '100%',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    civicIdLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    civicIdValue: {
        fontSize: 28,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    verifiedText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
        marginLeft: 4,
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 6,
    },
    genderOptionSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    genderText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    genderTextSelected: {
        color: 'white',
    },
    submitBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

