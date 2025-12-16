import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, register, continueAsGuest } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);
        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(email, password);
        }
        setIsSubmitting(false);

        if (!result.success) {
            Alert.alert("Authentication Error", result.error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="search" size={32} color={colors.primary} />
                    </View>
                    <Text style={styles.appName}>CivicLens</Text>
                    <Text style={styles.tagline}>Empowering Communities.</Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

                    <View style={styles.inputGroup}>
                        <Ionicons name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.textTertiary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Text style={styles.linkText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Guest Button */}
                <TouchableOpacity style={styles.guestButton} onPress={continueAsGuest}>
                    <Text style={styles.guestText}>Continue as Guest</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050A14', // Using direct color code or import if prefer
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 1,
    },
    tagline: {
        color: '#94A3B8',
        fontSize: 16,
        marginTop: 8,
    },
    formCard: {
        backgroundColor: '#0F1623',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#334155',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    switchText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    linkText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#1E293B',
    },
    dividerText: {
        color: '#64748B',
        marginHorizontal: 16,
        fontSize: 12,
        fontWeight: '700',
    },
    guestButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    guestText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '600',
    },
});
