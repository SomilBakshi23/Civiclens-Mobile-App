import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { updateUserProfile } from '../services/userService';

export default function EditProfileScreen({ navigation }) {
    const { user, profile, refreshProfile, isGuest } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/png?seed=CivicLensUsers');
    const [loading, setLoading] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);

    const COUNTRY_CODES = [
        { code: '+1', country: 'United States' },
        { code: '+91', country: 'India' },
        { code: '+44', country: 'United Kingdom' },
        { code: '+61', country: 'Australia' },
        { code: '+81', country: 'Japan' },
        { code: '+49', country: 'Germany' },
        { code: '+33', country: 'France' },
        { code: '+55', country: 'Brazil' },
    ];

    // Initialize with real data
    useEffect(() => {
        if (profile) {
            setFullName(profile.name || '');

            // Try to extract country code from saved phone if possible, otherwise default
            // This is a basic check; real implementation would be more robust
            setPhone(profile.phone || '');

            setAvatarUrl(profile.photoURL || 'https://api.dicebear.com/7.x/avataaars/png?seed=CivicLensUsers');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);

    const pickImage = async () => {
        if (isGuest) {
            Alert.alert("Guest Mode", "Guests cannot change profile photos.");
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
                setAvatarUrl(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image.");
        }
    };

    const randomizeAvatar = () => {
        if (isGuest) {
            Alert.alert("Guest Mode", "Guests cannot change profile photos.");
            return;
        }

        const randomSeed = Math.random().toString(36).substring(7);
        const newAvatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${randomSeed}`;
        setAvatarUrl(newAvatar);
    };

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
            phone: countryCode + " " + phone.trim(),
            photoURL: avatarUrl,
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Edit Personal Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Avatar Upload */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: avatarUrl }}
                                style={[styles.avatar, { borderColor: theme.surfaceLight, backgroundColor: theme.surface }]}
                            />
                            <TouchableOpacity style={[styles.cameraButton, { borderColor: theme.background }]} onPress={pickImage}>
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.avatarActions}>
                            <TouchableOpacity onPress={pickImage}>
                                <Text style={styles.changePhotoText}>Change Photo</Text>
                            </TouchableOpacity>
                            <Text style={{ color: theme.textSecondary }}>|</Text>
                            <TouchableOpacity onPress={randomizeAvatar}>
                                <Text style={styles.randomizeText}>Randomize Info</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>FULL NAME</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="person" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.textPrimary }]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter full name"
                                    placeholderTextColor={theme.textTertiary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>EMAIL ADDRESS (Read Only)</Text>
                            <View style={[styles.inputWrapper, { opacity: 0.7, backgroundColor: theme.background, borderColor: theme.border }]}>
                                <MaterialCommunityIcons name="email" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.textPrimary }]}
                                    value={email}
                                    editable={false}
                                    placeholder="Email"
                                    placeholderTextColor={theme.textTertiary}
                                />
                                <MaterialCommunityIcons name="lock" size={16} color={theme.textSecondary} />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>PHONE NUMBER</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {/* Country Code Selector */}
                                <TouchableOpacity
                                    style={[styles.countryCodeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                    onPress={() => setShowCountryModal(true)}
                                >
                                    <Text style={[styles.countryCodeText, { color: theme.textPrimary }]}>{countryCode}</Text>
                                    <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
                                </TouchableOpacity>

                                <View style={[styles.inputWrapper, { flex: 1, backgroundColor: theme.surface, borderColor: theme.border }]}>
                                    <MaterialCommunityIcons name="cellphone" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { color: theme.textPrimary }]}
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="(555) 000-0000"
                                        placeholderTextColor={theme.textTertiary}
                                        keyboardType="phone-pad"
                                    />
                                </View>
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
                        <MaterialCommunityIcons name="shield-check" size={14} color={theme.textSecondary} />
                        <Text style={[styles.securityText, { color: theme.textSecondary }]}>Data secured by CivicLens AI Protection</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Country Code Modal */}
            <Modal
                visible={showCountryModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCountryModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCountryModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Select Country Code</Text>
                            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                                <Ionicons name="close" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRY_CODES}
                            keyExtractor={(item) => item.code + item.country}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.countryItem, { borderBottomColor: theme.border }]}
                                    onPress={() => {
                                        setCountryCode(item.code);
                                        setShowCountryModal(false);
                                    }}
                                >
                                    <Text style={[styles.countryItemText, { color: theme.textPrimary }]}>
                                        {item.country} ({item.code})
                                    </Text>
                                    {countryCode === item.code && (
                                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.surfaceLight,
        backgroundColor: colors.surface,
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
    avatarActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    changePhotoText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    randomizeText: {
        color: colors.accent || '#F59E0B',
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
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        height: '100%',
    },
    footer: {
        padding: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'transparent', // controlled by theme inline if needed, or remove border
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
    countryCodeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        width: 100,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '60%',
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    countryItem: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    countryItemText: {
        fontSize: 16,
    }
});

