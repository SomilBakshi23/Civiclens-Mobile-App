import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { FeedCard } from '../components/IssueCard';

export default function DashboardScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('UserDashboard')}>
                    <Ionicons name="menu" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Pulse</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications" size={24} color="white" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* User Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreHeader}>
                            <Ionicons name="flash" size={14} color="#3B82F6" />
                            <Text style={styles.scoreLabel}>CIVIC SCORE</Text>
                        </View>
                        <Text style={styles.scoreValue}>1,250</Text>
                        <Text style={styles.scoreSub}>Top 5% in District</Text>
                    </View>

                    <View style={styles.levelCard}>
                        <View style={styles.scoreHeader}>
                            <MaterialCommunityIcons name="star-circle" size={14} color="#F97316" />
                            <Text style={styles.scoreLabel}>CONTRIBUTOR</Text>
                        </View>
                        <Text style={styles.scoreValue}>Lvl 5</Text>
                        <View style={styles.levelBarBg}>
                            <View style={[styles.levelBarFill, { width: '60%' }]} />
                        </View>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity style={styles.activeFilter}>
                        <Text style={styles.activeFilterText}>All Issues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filter}>
                        <Ionicons name="flame" size={14} color="#F97316" style={{ marginRight: 4 }} />
                        <Text style={styles.filterText}>Trending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filter}>
                        <Ionicons name="location-sharp" size={14} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.filterText}>Near Me</Text>
                    </TouchableOpacity>
                </View>

                {/* Feed */}
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

                <FeedCard
                    item={{
                        status: 'Open',
                        imageUrl: 'https://images.unsplash.com/photo-1550524514-c6c4e03598d4?q=80&w=1000&auto=format&fit=crop', // Street light dark
                        timeAgo: '5h ago',
                        title: 'Streetlight Outage - Sector 4',
                        description: 'Lights are completely out near the playground entrance. It\'s very dark and feels unsafe for kids walking home.',
                        department: 'Civic Energy',
                        verified: false,
                        votes: 125,
                        comments: 12,
                    }}
                />

            </ScrollView>

            {/* Daily Streak Floating */}
            <View style={styles.streakCard}>
                <View style={styles.streakIcon}>
                    <Ionicons name="star" size={16} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.streakTitle}>Daily Streak!</Text>
                    <Text style={styles.streakSub}>Log in tomorrow for +50 pts</Text>
                </View>
                <Text style={styles.viewLink}>VIEW</Text>
            </View>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
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
        paddingBottom: 100,
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
        // Glow effect simulation
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

    // Streak
    streakCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 80, // Leave room for FAB
        backgroundColor: '#0F1623',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E293B',
        // Gradient border simulation via separate component is hard, stick to solid
    },
    streakIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1D4ED8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    streakTitle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 13,
    },
    streakSub: {
        color: '#94A3B8',
        fontSize: 11,
    },
    viewLink: {
        color: '#3B82F6',
        fontSize: 11,
        fontWeight: '700',
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
});
