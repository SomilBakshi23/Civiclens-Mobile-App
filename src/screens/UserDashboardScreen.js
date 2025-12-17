import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAlert } from '../context/AlertContext';

export default function UserDashboardScreen({ navigation }) {
    const { logout, user, profile, isGuest } = useContext(AuthContext);
    const { theme, isDarkMode } = useContext(ThemeContext);
    const { showAlert } = useAlert();
    const [stats, setStats] = useState({ total: 0, verified: 0 });
    const [categoryCounts, setCategoryCounts] = useState({});

    // Load Real Data Filtered by User
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                if (!user) return;

                try {
                    // 1. Fetch Latest Profile (for Civic Score)
                    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
                    if (!userDoc.empty) {
                        // We could update context, but for now just local state or rely on stats re-render
                        // Actually, we should force a profile refresh if we want 'profile.civicScore' to update
                        // But since 'profile' comes from AuthContext, let's fetch it manually here for display
                        const freshProfile = userDoc.docs[0].data();
                        setCurrentProfile(freshProfile);
                    }

                    // 2. Fetch Issues
                    // Strict Isolation: Only show current user's reports
                    // Also exclude deleted ones
                    const q = query(
                        collection(db, "issues"),
                        where("reportedBy", "==", user?.uid),
                        where("status", "!=", "deleted")
                    );

                    const querySnapshot = await getDocs(q);
                    const issues = [];
                    querySnapshot.forEach((doc) => {
                        issues.push({ id: doc.id, ...doc.data() });
                    });

                    setStats({
                        total: issues.length,
                        verified: issues.filter(i => i.status === 'resolved' || i.verified).length
                    });

                    // Tally Categories
                    const newCounts = {};
                    issues.forEach(i => {
                        const cat = i.category || 'Other';
                        newCounts[cat] = (newCounts[cat] || 0) + 1;
                    });
                    setCategoryCounts(newCounts);

                } catch (e) {
                    console.error("Error fetching user dashboard data:", e);
                }
            };
            loadData();
        }, [user, isGuest])
    );

    // Use local profile if available, else context profile
    const [currentProfile, setCurrentProfile] = useState(profile);

    const userStats = {
        starRating: currentProfile?.civicScore ? (currentProfile.civicScore / 20).toFixed(1) : "5.0",
        totalReports: stats.total, // REAL DATA
        verifiedReports: stats.verified, // REAL DATA
        ranking: currentProfile?.rank || 'New Citizen'
    };

    // Category data with report counts
    const categories = [
        { id: 1, name: 'Infrastructure', icon: 'alert-octagon', key: 'Infrastructure', color: '#EAB308' },
        { id: 2, name: 'Electrical', icon: 'lightbulb-on', key: 'Electrical', color: '#F97316' },
        { id: 3, name: 'Sanitation', icon: 'delete', key: 'Sanitation', color: '#EF4444' },
        { id: 4, name: 'Water', icon: 'water', key: 'Water', color: '#3B82F6' },
        { id: 5, name: 'Traffic', icon: 'car', key: 'Traffic', color: '#A855F7' },
        { id: 6, name: 'Vandalism', icon: 'wall', key: 'Vandalism', color: '#64748B' },
        { id: 7, name: 'Other', icon: 'dots-horizontal', key: 'Other', color: '#10B981' },
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);

    const toggleCategory = (id) => {
        if (selectedCategory === id) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(id);
        }
    };

    const handleLogout = () => {
        showAlert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: () => logout() }
            ]
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const name = i <= rating ? 'star' : (i - 0.5 <= rating ? 'star-half' : 'star-outline');
            stars.push(
                <Ionicons key={i} name={name} size={24} color="#F59E0B" style={{ marginHorizontal: 2 }} />
            );
        }
        return stars;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>User Dashboard</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Profile/Rating Section */}
                <View style={[styles.ratingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { borderColor: theme.surfaceLight }]}>
                            {profile?.photoURL ? (
                                <Image source={{ uri: profile.photoURL }} style={{ width: '100%', height: '100%', borderRadius: 40 }} />
                            ) : (
                                <Ionicons name="person" size={40} color="white" />
                            )}
                        </View>
                        {!isGuest && (
                            <View style={[styles.rankBadge, { borderColor: theme.surface }]}>
                                <MaterialCommunityIcons name="trophy" size={14} color="white" />
                            </View>
                        )}
                    </View>

                    <Text style={[styles.userName, { color: theme.textPrimary }]}>
                        {isGuest ? "Responsible Citizen" : (profile?.name || "Responsible Citizen")}
                    </Text>
                    <Text style={[styles.userSub, { color: theme.textSecondary }]}>Making the city better, one report at a time</Text>

                    <View style={styles.starsContainer}>
                        {renderStars(userStats.starRating)}
                    </View>
                    <Text style={styles.ratingText}>{userStats.starRating} / 5.0 Rating</Text>

                    <View style={[styles.statsRow, { backgroundColor: theme.background }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{userStats.totalReports}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reports</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{userStats.verifiedReports}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Verified</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{userStats.ranking}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ranking</Text>
                        </View>
                    </View>
                </View>

                {/* Categories Section */}
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Report History by Category</Text>
                <Text style={styles.sectionSub}>Tap a category to see your impact</Text>

                <View style={styles.grid}>
                    {categories.map((cat) => {
                        const count = categoryCounts[cat.key] || categoryCounts[cat.name] || 0;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.card,
                                    selectedCategory === cat.id && styles.activeCard,
                                    {
                                        backgroundColor: selectedCategory === cat.id ? (isDarkMode ? '#1E293B' : '#E2E8F0') : theme.surface,
                                        borderColor: selectedCategory === cat.id ? cat.color : theme.border
                                    }
                                ]}
                                onPress={() => toggleCategory(cat.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconBox, { backgroundColor: `${cat.color}20` }]}>
                                    <MaterialCommunityIcons name={cat.icon} size={28} color={cat.color} />
                                </View>
                                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{cat.name}</Text>

                                <View style={styles.countBadge}>
                                    <Text style={[styles.countText, { color: theme.textPrimary }]}>{count}</Text>
                                    <Text style={styles.countLabel}>Reports</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Logout Section */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

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

    // Rating Card
    ratingCard: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 32,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#1E293B',
    },
    rankBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F59E0B',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.surface,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    userSub: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F59E0B',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        backgroundColor: colors.background, // Nested darker background
        paddingVertical: 12,
        borderRadius: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
    },

    // Categories
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Roughly half width with gap
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 140, // consistent height
        justifyContent: 'space-between',
    },
    activeCard: {
        backgroundColor: '#1E293B', // Slightly lighter on active
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    countBadge: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    countText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    countLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
