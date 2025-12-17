import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, register, continueAsGuest } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);
        let result;
        try {
            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await register(email, password);
            }
        } catch (error) {
            // Fallback catch, though AuthContext should handle it
            result = { success: false, error: error.message };
        }

        setIsSubmitting(false);

        if (result && !result.success) {
            Alert.alert("Authentication Error", result.error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <View style={[styles.logoCircle, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}>
                            <Ionicons name="search" size={40} color={theme.primary} />
                        </View>
                        <Text style={[styles.title, { color: theme.textPrimary }]}>CivicLens</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Empowering Citizens, Fixing Cities</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={[styles.formTitle, { color: theme.textPrimary }]}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

                        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.textPrimary }]}
                                placeholder="Email Address"
                                placeholderTextColor={theme.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.textPrimary }]}
                                placeholder="Password"
                                placeholderTextColor={theme.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={[styles.authButton, { backgroundColor: theme.primary }]} onPress={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={[styles.authButtonText, { color: 'white' }]}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
                            <Text style={[styles.switchText, { color: theme.primary }]}>
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}>
                        <View style={[styles.line, { backgroundColor: theme.border }]} />
                        <Text style={[styles.orText, { color: theme.textSecondary }]}>OR</Text>
                        <View style={[styles.line, { backgroundColor: theme.border }]} />
                    </View>

                    <TouchableOpacity style={[styles.guestButton, { borderColor: theme.border }]} onPress={continueAsGuest}>
                        <Text style={[styles.guestText, { color: theme.textPrimary }]}>Continue as Guest</Text>
                    </TouchableOpacity>

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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
    },
    form: {
        width: '100%',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        height: 56, // Fixed height for consistency
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
    authButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    authButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchButton: {
        alignItems: 'center',
        marginTop: 16,
        padding: 8,
    },
    switchText: {
        color: colors.primary,
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    orText: {
        color: colors.textSecondary,
        marginHorizontal: 16,
        fontSize: 12,
    },
    guestButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    guestText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
