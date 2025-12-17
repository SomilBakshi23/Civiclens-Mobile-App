import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { FeedCard } from '../components/IssueCard';
import { getDashboardStats } from '../services/issueService';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
    const { profile } = useContext(AuthContext);
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [stats, setStats] = useState({ totalIssues: 0, resolvedRate: '0%', resTime: '0h' });

    // Simple Level Calculation: 1 Level per 200 points
    const currentScore = profile?.civicScore || 0;
    const currentLevel = Math.floor(currentScore / 200) + 1;

    // Progress to next level
    const nextLevelScore = currentLevel * 200;
    const progress = (currentScore % 200) / 200;

    useFocusEffect(
        useCallback(() => {
            async function fetchStats() {
                const s = await getDashboardStats();
                setStats(s);
            }
            fetchStats();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('UserDashboard')}>
                    <Ionicons name="menu" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Community Pulse</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <Ionicons name="notifications" size={24} color={theme.textPrimary} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* User Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.scoreCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.scoreHeader}>
                            <Ionicons name="flash" size={14} color="#3B82F6" />
                            <Text style={styles.scoreLabel}>CIVIC SCORE</Text>
                        </View>
                        <Text style={[styles.scoreValue, { color: theme.textPrimary }]}>{currentScore.toLocaleString()}</Text>
                        <Text style={styles.scoreSub}>Good Standing</Text>
                    </View>

                    <View style={[styles.levelCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.scoreHeader}>
                            <MaterialCommunityIcons name="star-circle" size={14} color="#F97316" />
                            <Text style={styles.scoreLabel}>CONTRIBUTOR</Text>
                        </View>
                        <Text style={[styles.scoreValue, { color: theme.textPrimary }]}>Lvl {currentLevel}</Text>
                        <View style={[styles.levelBarBg, { backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0' }]}>
                            <View style={[styles.levelBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>
                </View>

                {/* Dashboard Stats from Firestore */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                    <View style={[styles.miniStat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={styles.miniLabel}>Total Issues</Text>
                        <Text style={[styles.miniValue, { color: theme.textPrimary }]}>{stats.totalIssues}</Text>
                    </View>
                    <View style={[styles.miniStat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={styles.miniLabel}>Resolution Rate</Text>
                        <Text style={[styles.miniValue, { color: '#4ADE80' }]}>{stats.resolvedRate}</Text>
                    </View>
                    <View style={[styles.miniStat, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={styles.miniLabel}>Avg Time</Text>
                        <Text style={[styles.miniValue, { color: '#F59E0B' }]}>{stats.resTime}</Text>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity style={[styles.activeFilter, { backgroundColor: theme.textPrimary }]}>
                        <Text style={[styles.activeFilterText, { color: theme.background }]}>All Issues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="flame" size={14} color="#F97316" style={{ marginRight: 4 }} />
                        <Text style={styles.filterText}>Trending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filter, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="location-sharp" size={14} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.filterText}>Near Me</Text>
                    </TouchableOpacity>
                </View>

                {/* Feed */}
                {/* Using static feed here as dashboard might have different queries, but demonstrating service integration in stats above */}
                <FeedCard
                    item={{
                        status: 'Resolved',
                        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                        timeAgo: '2h ago',
                        title: 'Pothole on 5th Ave',
                        description: 'Great news! The Department of Public Works has patched the large pothole reported near the intersection. Traffic is flowing smoothly.',
                        department: 'Public Works Dept',
                        verified: true,
                        votes: 342,
                        comments: 24,
                    }}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
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
    content: {
        padding: 20,
        paddingBottom: 130,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    scoreCard: {
        flex: 1,
        backgroundColor: '#0F1623',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1E293B',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    levelCard: {
        flex: 1,
        backgroundColor: '#0F1623',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    scoreLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    scoreValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    scoreSub: {
        color: '#64748B',
        fontSize: 11,
    },
    levelBarBg: {
        height: 4,
        backgroundColor: '#1E293B',
        borderRadius: 2,
        marginTop: 8,
    },
    levelBarFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 2,
    },

    // Mini Stats for Dashboard
    miniStat: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    miniLabel: {
        color: colors.textSecondary,
        fontSize: 10,
        marginBottom: 4,
    },
    miniValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Filters
    filterRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    activeFilter: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeFilterText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 12,
    },
    filter: {
        backgroundColor: '#1E293B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    filterText: {
        color: '#94A3B8',
        fontWeight: '600',
        fontSize: 12,
    },


});
