import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import IssueCard from '../components/IssueCard';
import { getAllIssues, upvoteIssue, getDashboardStats } from '../services/issueService';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { isGuest, logout } = useContext(AuthContext); // Access Auth Context

    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({ totalIssues: 0, resolvedRate: '0%', resTime: '0h' });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        // Parallel fetch for speed
        const [fetchedIssues, fetchedStats] = await Promise.all([
            getAllIssues(),
            getDashboardStats()
        ]);
        setIssues(fetchedIssues);
        setStats(fetchedStats);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Reload when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleUpvote = async (issueId) => {
        if (isGuest) {
            Alert.alert("Login Required", "Guest users cannot upvote issues. Please login to contribute.", [
                { text: "Cancel", style: "cancel" },
                { text: "Login", onPress: () => logout() } // Logout takes them back to AuthScreen
            ]);
            return;
        }

        await upvoteIssue(issueId);
        // Optimistic update could go here, or just reload
        loadData();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Feather name="menu" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="search" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.logoText}>CivicLens</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications" size={24} color="white" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.systemStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>SYSTEM OPERATIONAL</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Report. Track.{"\n"}
                        <Text style={styles.highlight}>Fix Your City.</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        AI-powered solutions for a better neighborhood. Identify issues instantly.
                    </Text>

                    <View style={styles.heroButtons}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Report')}>
                            <Ionicons name="camera" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Report Issue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Map')}>
                            <MaterialCommunityIcons name="target" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>View Nearby</Text>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.heroBg}
                        blurRadius={3}
                    />
                    <View style={styles.overlay} />
                </View>

                {/* Live Impact (Dynamic) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Live Impact</Text>
                    <Text style={styles.updateTime}>
                        <Ionicons name="time-outline" size={12} color={colors.textSecondary} /> Updated just now
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>REPORTS</Text>
                        <Text style={styles.statValue}>{stats.totalIssues}</Text>
                        <Text style={[styles.statTrend, { color: '#60A5FA' }]}>↗ +12%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>RESOLVED</Text>
                        <Text style={styles.statValue}>{stats.resolvedRate}</Text>
                        <Text style={[styles.statTrend, { color: '#4ADE80' }]}>✓ +5%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>FIX TIME</Text>
                        <Text style={styles.statValue}>{stats.resTime}</Text>
                        <Text style={[styles.statTrend, { color: '#F59E0B' }]}>↘ -2h</Text>
                    </View>
                </View>

                {/* Active Issues Map Preview (Static preserved per design) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Issues Map</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                        <Text style={styles.linkText}>Full Map →</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mapPreviewCard}>
                    <View style={[StyleSheet.absoluteFill, styles.mapPattern]} />
                    <View style={styles.radarEffect}>
                        <View style={styles.radarCircle} />
                        <Ionicons name="add" size={24} color="white" />
                    </View>
                    <View style={styles.mapControls}>
                        <View style={styles.controlIcon}><Ionicons name="home" size={18} color={colors.primary} /></View>
                        <View style={styles.controlIcon}><Ionicons name="map" size={18} color={colors.textSecondary} /></View>
                    </View>
                    <View style={styles.nearbyAlert}>
                        <View style={styles.alertIcon}>
                            <MaterialCommunityIcons name="target" size={20} color="white" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.alertTitle}>3 Issues near your location</Text>
                            <Text style={styles.alertSubtitle}>Downtown District • 0.5 miles</Text>
                        </View>
                        <View style={styles.arrowBtn}>
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </View>
                    </View>
                </View>

                {/* Recent Activity (Dynamic) */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Recent Activity</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    issues.map((item) => (
                        <View key={item.id} style={{ position: 'relative' }}>
                            <IssueCard
                                title={item.title}
                                location={`${item.priority?.toUpperCase()} • ${item.category}`}
                                status={item.status}
                                image={item.imageUrl}
                                id={item.id}
                            />
                            {/* Hacky way to add upvote to IssueCard without modifying IssueCard props extensively if not passed down, 
                        BUT IssueCard doesn't have an upvote button in design logic. 
                        I will stick to the List view. 
                        Requirement: "Display title, category, priority, upvote button (calls upvoteIssue)"
                        I need to modify IssueCard or wrap it.
                    */}
                            <TouchableOpacity
                                style={styles.floatingUpvote}
                                onPress={() => handleUpvote(item.id)}
                            >
                                <MaterialCommunityIcons name="thumb-up" size={14} color="white" />
                                <Text style={styles.upvoteCount}>{item.upvotes || 0}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        padding: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    logoText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.warning,
    },

    // Hero
    hero: {
        marginTop: 20,
        borderRadius: 24,
        overflow: 'hidden',
        padding: 24,
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -2,
        opacity: 0.6,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 10, 20, 0.85)',
        zIndex: -1,
    },
    systemStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 100,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3B82F6',
        marginRight: 6,
    },
    statusText: {
        color: '#E2E8F0',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        fontWeight: '800',
        lineHeight: 38,
        marginBottom: 10,
    },
    highlight: {
        color: '#60A5FA',
    },
    heroSubtitle: {
        color: '#94A3B8',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    heroButtons: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 50,
        width: '100%',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    // Stats
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    updateTime: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    linkText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'flex-start',
    },
    statLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    statValue: {
        fontSize: 24,
        color: 'white',
        fontWeight: '700',
        marginBottom: 4,
    },
    statTrend: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Map Preview
    mapPreviewCard: {
        height: 220,
        borderRadius: 24,
        backgroundColor: '#111',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mapPattern: {
        backgroundColor: colors.background,
    },
    radarEffect: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    radarCircle: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        opacity: 0.2,
        transform: [{ scale: 2 }],
    },
    mapControls: {
        position: 'absolute',
        top: '40%',
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 25, 40, 0.9)',
        paddingVertical: 12,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    controlIcon: {
        paddingHorizontal: 16,
    },
    nearbyAlert: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    alertIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    alertTitle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 13,
    },
    alertSubtitle: {
        color: colors.textSecondary,
        fontSize: 11,
    },
    arrowBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // List Upvote Button Overlay
    floatingUpvote: {
        position: 'absolute',
        right: 16,
        top: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    upvoteCount: {
        color: 'white',
        fontSize: 10,
        marginLeft: 4,
        fontWeight: '700',
    }
});
