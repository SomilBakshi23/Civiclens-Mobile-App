import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function NotificationsScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [checking, setChecking] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) {
                setChecking(false);
                return;
            }

            try {
                // Fetch Reward/System Notifications
                // NOTE: Removed orderBy to avoid Firestore Index requirement for this Demo
                const q = query(
                    collection(db, "notifications"),
                    where("uid", "==", user.uid),
                    limit(50)
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Format timestamp if needed
                    timeAgo: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString() : 'Just now',
                    rawTime: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
                }))
                    .sort((a, b) => b.rawTime - a.rawTime); // Client-side sort

                setNotifications(fetched);
            } catch (e) {
                console.error("Error fetching notifications", e);
            } finally {
                setChecking(false);
            }
        };

        fetchNotifications();
    }, [user]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notifications & Updates</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* System Update Section */}
                <View style={[styles.section, { marginBottom: 32 }]}>
                    <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>System Status</Text>
                    {checking ? (
                        <View style={[styles.updateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 12 }} />
                            <Text style={[styles.updateText, { color: theme.textSecondary }]}>Checking for updates...</Text>
                        </View>
                    ) : (
                        <View style={[styles.updateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.updateTitle, { color: theme.textPrimary }]}>Up to Date</Text>
                                <Text style={[styles.updateText, { color: theme.textSecondary }]}>The application is already in the updated version.</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Report Tracking Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Track Reports</Text>

                    {notifications.length === 0 ? (
                        <Text style={{ color: theme.textSecondary, marginTop: 20 }}>No new notifications.</Text>
                    ) : (
                        notifications.map((item) => (
                            <View key={item.id} style={[styles.reportCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <View style={styles.reportHeader}>
                                    <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: `${theme.primary}20` }]}>
                                        <Text style={[styles.statusText, { color: theme.primary }]}>{item.type?.toUpperCase() || 'INFO'}</Text>
                                    </View>
                                </View>

                                <Text style={{ color: theme.textSecondary, marginBottom: 12, lineHeight: 20 }}>
                                    {item.message}
                                </Text>

                                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                                <Text style={{ fontSize: 10, color: theme.textSecondary }}>{item.timeAgo}</Text>
                            </View>
                        ))
                    )}

                </View>

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    content: {
        padding: 20,
    },
    section: {
        width: '100%',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
        marginBottom: 12,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Update Card
    updateCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    checkIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    updateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    updateText: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },

    // Report Card
    reportCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 16,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#1E293B',
        borderRadius: 2,
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        marginLeft: 6,
        fontSize: 12,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 6,
    },
    statText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
