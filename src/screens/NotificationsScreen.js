import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function NotificationsScreen({ navigation }) {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Simulate checking for updates
        const timer = setTimeout(() => {
            setChecking(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const reports = [
        {
            id: 1,
            title: 'Pothole on 5th Ave',
            status: 'In Progress',
            eta: '2 Days',
            usefulCount: 24,
            reshareCount: 5,
            progress: 0.6,
            color: '#F59E0B'
        },
        {
            id: 2,
            title: 'Street Light Outage',
            status: 'Acknowledged',
            eta: '4 Days',
            usefulCount: 12,
            reshareCount: 2,
            progress: 0.3,
            color: '#3B82F6'
        },
        {
            id: 3,
            title: 'Garbage Dump - Sec 4',
            status: 'Pending Review',
            eta: 'Calculating...',
            usefulCount: 8,
            reshareCount: 0,
            progress: 0.1,
            color: '#64748B'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications & Updates</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* System Update Section */}
                <View style={[styles.section, { marginBottom: 32 }]}>
                    <Text style={styles.sectionHeader}>System Status</Text>
                    {checking ? (
                        <View style={styles.updateCard}>
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 12 }} />
                            <Text style={styles.updateText}>Checking for updates...</Text>
                        </View>
                    ) : (
                        <View style={styles.updateCard}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={16} color="white" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.updateTitle}>Up to Date</Text>
                                <Text style={styles.updateText}>The application is already in the updated version.</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Report Tracking Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Track Reports</Text>

                    {reports.map((report) => (
                        <View key={report.id} style={styles.reportCard}>
                            <View style={styles.reportHeader}>
                                <Text style={styles.reportTitle}>{report.title}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: `${report.color}20` }]}>
                                    <View style={[styles.dot, { backgroundColor: report.color }]} />
                                    <Text style={[styles.statusText, { color: report.color }]}>{report.status}</Text>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${report.progress * 100}%`, backgroundColor: report.color }]} />
                            </View>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                                    <Text style={styles.metaText}>ETA: <Text style={{ color: 'white' }}>{report.eta}</Text></Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {/* Social Stats */}
                            <View style={styles.statsRow}>
                                <View style={[styles.statBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <Ionicons name="thumbs-up" size={14} color="#60A5FA" />
                                    <Text style={[styles.statText, { color: '#60A5FA' }]}>{report.usefulCount} Found Useful</Text>
                                </View>

                                <View style={[styles.statBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                    <Ionicons name="share-social" size={14} color="#34D399" />
                                    <Text style={[styles.statText, { color: '#34D399' }]}>{report.reshareCount} Reshares</Text>
                                </View>
                            </View>

                        </View>
                    ))}

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
