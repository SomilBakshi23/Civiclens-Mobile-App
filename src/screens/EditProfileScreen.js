import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

export default function EditProfileScreen({ navigation }) {
    const { user, profile, refreshProfile, isGuest } = useContext(AuthContext);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize with real data
    useEffect(() => {
        if (profile) {
            setFullName(profile.name || '');
            setPhone(profile.phone || '');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);

    const handleSave = async () => {
        if (isGuest) {
            Alert.alert("Guest Mode", "You cannot edit a guest profile.");
            return;
        }

        if (!fullName.trim()) {
            Alert.alert("Required", "Full Name cannot be empty.");
            return;
        }

        setLoading(true);
        const updateData = {
            name: fullName.trim(),
            phone: phone.trim(),
        };

        const result = await updateUserProfile(user.uid, updateData);
        setLoading(false);

        if (result.success) {
            await refreshProfile();
            Alert.alert("Success", "Profile updated successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Personal Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Avatar Upload */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter full name"
                                    placeholderTextColor={colors.textTertiary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS (Read Only)</Text>
                            <View style={[styles.inputWrapper, { opacity: 0.7, backgroundColor: colors.background }]}>
                                <MaterialCommunityIcons name="email" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    editable={false}
                                    placeholder="Email"
                                    placeholderTextColor={colors.textTertiary}
                                />
                                <MaterialCommunityIcons name="lock" size={16} color={colors.textSecondary} />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PHONE NUMBER</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="cellphone" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="+1 (555) 000-0000"
                                    placeholderTextColor={colors.textTertiary}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, loading && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="content-save" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <View style={styles.securityNote}>
                        <MaterialCommunityIcons name="shield-check" size={14} color={colors.textSecondary} />
                        <Text style={styles.securityText}>Data secured by CivicLens AI Protection</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 4,
    },
    content: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.surfaceLight,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    changePhotoText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    formContainer: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    verifiedIcon: {
        marginLeft: 8,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        height: '100%',
    },
    helperTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    helperText: {
        color: colors.textSecondary,
        fontSize: 11,
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 12,
    },
    strengthBarRow: {
        flexDirection: 'row',
        gap: 4,
        flex: 1,
        maxWidth: 150,
    },
    strengthBar: {
        height: 4,
        flex: 1,
        borderRadius: 2,
    },
    strengthText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '600',
    },
    footer: {
        padding: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    saveButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    securityText: {
        color: colors.textSecondary,
        fontSize: 11,
    },
});
