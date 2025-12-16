import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

export default function ProfileSetupScreen() {
    const { user, profile, refreshProfile } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill if some data already exists
    useEffect(() => {
        if (profile) {
            if (profile.name) setName(profile.name);
            if (profile.area) setArea(profile.area);
        }
    }, [profile]);

    const handleCompleteSetup = async () => {
        if (!name.trim() || !area.trim()) {
            Alert.alert("Required Fields", "Please enter your full name and local area.");
            return;
        }

        setIsSubmitting(true);

        const updateData = {
            name: name.trim(),
            area: area.trim(),
            isProfileComplete: true, // Mark as complete!
        };

        const result = await updateUserProfile(user.uid, updateData);

        if (result.success) {
            await refreshProfile(); // Refresh context to trigger App.js routing update
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
                <Text style={{ color: 'white', marginTop: 10 }}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconBadge}>
                            <MaterialCommunityIcons name="card-account-details-outline" size={32} color={colors.primary} />
                        </View>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>You're almost there! We've generated your unique Civic ID.</Text>
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
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.primary,
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
    civicIdCard: {
        backgroundColor: '#0F1623',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 32,
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
