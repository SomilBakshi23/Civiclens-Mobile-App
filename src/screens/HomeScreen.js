import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import IssueCard from '../components/IssueCard';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('UserDashboard')}>
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

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

                    {/* Background Effect: A subtle image or gradient replica */}
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.heroBg}
                        blurRadius={3}
                    />
                    <View style={styles.overlay} />
                </View>

                {/* Live Impact */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Live Impact</Text>
                    <Text style={styles.updateTime}>
                        <Ionicons name="time-outline" size={12} color={colors.textSecondary} /> Updated 2m ago
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>REPORTS</Text>
                        <Text style={styles.statValue}>142</Text>
                        <Text style={[styles.statTrend, { color: '#60A5FA' }]}>↗ +12%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>RESOLVED</Text>
                        <Text style={styles.statValue}>89%</Text>
                        <Text style={[styles.statTrend, { color: '#4ADE80' }]}>✓ +5%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>FIX TIME</Text>
                        <Text style={styles.statValue}>48h</Text>
                        <Text style={[styles.statTrend, { color: '#F59E0B' }]}>↘ -2h</Text>
                    </View>
                </View>

                {/* Active Issues Map Preview */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Issues Map</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                        <Text style={styles.linkText}>Full Map →</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mapPreviewCard}>
                    {/* Mock Map UI */}
                    <Image
                        source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12,0/600x300?access_token=pk.mock' }} // Won't load without token, using fallback style
                        style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
                    />
                    {/* Fallback pattern for map */}
                    <View style={[StyleSheet.absoluteFill, styles.mapPattern]} />

                    <View style={styles.radarEffect}>
                        <View style={styles.radarCircle} />
                        <Ionicons name="add" size={24} color="white" />
                    </View>

                    {/* Floating Map Actions */}
                    <View style={styles.mapControls}>
                        <View style={styles.controlIcon}><Ionicons name="home" size={18} color={colors.primary} /></View>
                        <View style={styles.controlIcon}><Ionicons name="map" size={18} color={colors.textSecondary} /></View>
                        <View style={{ width: 50 }} />
                        <View style={styles.controlIcon}><MaterialCommunityIcons name="clipboard-text" size={18} color={colors.textSecondary} /></View>
                        <View style={styles.controlIcon}><Ionicons name="person" size={18} color={colors.textSecondary} /></View>
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

                {/* Recent Activity */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Recent Activity</Text>

                <IssueCard
                    title="Pothole on 5th Ave"
                    location="Reported 2 hours ago • ID #4921"
                    status="Resolved"
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sCqSgVzZ3qQ6j3y8q2Z9n4Y5t6o7p8q9rA&usqp=CAU"
                />
                <IssueCard
                    title="Street Light Outage"
                    location="Main St & Oak • AI Verified"
                    status="In Progress"
                />

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
        // Should ideally be a real map view but user wants pixel replication, image is safer if no key? 
        // I'll stick to the dark bg and the icons as map abstraction
    },
    radarEffect: { // The center + button and ripple
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
        transform: [{ scale: 2 }], // Ripple effect simulation
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
});
