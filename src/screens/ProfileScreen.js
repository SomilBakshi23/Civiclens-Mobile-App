import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Alert, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleSignOut = () => {
        setShowLogoutModal(true);
    };

    const confirmSignOut = () => {
        setShowLogoutModal(false);
        console.log("User Signed Out");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>User Profile</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-sharp" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }}
                            style={styles.avatar}
                        />
                        <View style={styles.verifiedBadge}>
                            <MaterialCommunityIcons name="check-decagram" size={24} color={colors.primary} />
                        </View>
                    </View>
                    <Text style={styles.userName}>Alex Rivera</Text>
                    <View style={styles.userTag}>
                        <Text style={styles.userTagText}>VERIFIED RESIDENT</Text>
                    </View>
                    <Text style={styles.civicId}>Civic ID: #8821-90</Text>
                </View>

                {/* Insight Card */}
                <View style={styles.insightCard}>
                    <View style={styles.insightIconContainer}>
                        <MaterialCommunityIcons name="star-four-points" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.insightTextContainer}>
                        <Text style={styles.insightTitle}>CIVIC IMPACT INSIGHT</Text>
                        <Text style={styles.insightDesc}>
                            Your reports have helped improve neighborhood response time by <Text style={styles.boldWhite}>15%</Text> this month.
                        </Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Issues{"\n"}Reported</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Verified{"\n"}Solutions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: '#60A5FA' }]}>450</Text>
                        <Text style={styles.statLabel}>Civic{"\n"}Points</Text>
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
                    <View style={styles.achievementCard}>
                        <View style={styles.achievementIconBg}>
                            <MaterialCommunityIcons name="shield-check" size={32} color="#F59E0B" />
                        </View>
                        <Text style={styles.achievementTitle}>First{"\n"}Responder</Text>
                    </View>
                    <View style={styles.achievementCard}>
                        <View style={[styles.achievementIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <FontAwesome5 name="vote-yea" size={24} color="#10B981" />
                        </View>
                        <Text style={styles.achievementTitle}>Top{"\n"}Voter</Text>
                    </View>
                    <View style={styles.achievementCard}>
                        <View style={[styles.achievementIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <MaterialCommunityIcons name="pine-tree" size={32} color="#3B82F6" />
                        </View>
                        <Text style={styles.achievementTitle}>Clean{"\n"}Streets</Text>
                    </View>
                    <View style={[styles.achievementCard, { opacity: 0.5 }]}>
                        <View style={[styles.achievementIconBg, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                            <MaterialCommunityIcons name="lock" size={32} color="#94A3B8" />
                        </View>
                        <Text style={styles.achievementTitle}>Super{"\n"}Citizen</Text>
                    </View>
                </ScrollView>

                {/* Recent Activity */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16, paddingHorizontal: 20 }]}>Recent Activity</Text>

                <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="#cbd5e1" />
                    </View>
                    <View style={styles.activityContent}>
                        <View style={styles.activityHeader}>
                            <Text style={styles.activityTitle}>Reported Issue on 5th Ave</Text>
                            <Text style={styles.activityTime}>2h ago</Text>
                        </View>
                        <Text style={styles.activitySubtitle}>Pothole • Public Safety</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Under Review</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.activityItem}>
                    <View style={[styles.activityIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                        <MaterialCommunityIcons name="check-circle" size={24} color="white" />
                    </View>
                    <View style={styles.activityContent}>
                        <View style={styles.activityHeader}>
                            <Text style={styles.activityTitle}>Validated Fix on Park St</Text>
                            <Text style={styles.activityTime}>1d ago</Text>
                        </View>
                        <Text style={styles.activitySubtitle}>Street Light • Infrastructure</Text>
                        <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                            <Text style={[styles.statusText, { color: '#10B981' }]}>Complete</Text>
                        </View>
                    </View>
                </View>

                {/* Account Settings */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16, paddingHorizontal: 20 }]}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="person" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Edit Personal Details</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="options" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Civic Preferences</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="lock-closed" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.menuText}>Privacy & Data</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <MaterialCommunityIcons name="logout" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal
                transparent={true}
                visible={showLogoutModal}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <MaterialCommunityIcons name="logout" size={32} color={colors.primary} />
                        </View>
                        <Text style={styles.modalTitle}>Sign Out?</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to sign out? You will need to login again to access your profile.</Text>

                        <View style={styles.modalButtons}>
                            {/* Yes Button - Secondary/Ghost style */}
                            <TouchableOpacity
                                style={styles.modalButtonYes}
                                onPress={confirmSignOut}
                            >
                                <Text style={styles.modalButtonYesText}>Yes, Sign Out</Text>
                            </TouchableOpacity>

                            {/* No Button - Colored/Primary as requested */}
                            <TouchableOpacity
                                style={styles.modalButtonNo}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.modalButtonNoText}>No, Stay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        position: 'relative',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingsButton: {
        position: 'absolute',
        right: 20,
    },
    scrollContent: {
        paddingTop: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.surfaceLight,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    userName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    userTag: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    userTagText: {
        color: '#60A5FA',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    civicId: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    insightCard: {
        backgroundColor: '#111827', // Darker surface
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
    },
    insightIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    insightTextContainer: {
        flex: 1,
    },
    insightTitle: {
        color: '#60A5FA',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    insightDesc: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    boldWhite: {
        color: 'white',
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    statItem: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statNumber: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    achievementsScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    achievementCard: {
        width: 100,
        alignItems: 'center',
        marginRight: 4,
    },
    achievementIconBg: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(245, 158, 11, 0.15)', // Default Warning/Gold bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    achievementTitle: {
        color: 'white',
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 14,
    },
    activityItem: {
        marginHorizontal: 20,
        marginBottom: 16,
        flexDirection: 'row',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    activityIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    activityTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    activityTime: {
        color: colors.textSecondary,
        fontSize: 11,
    },
    activitySubtitle: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginRight: 6,
    },
    statusText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        color: 'white',
        fontSize: 15,
        flex: 1,
        fontWeight: '500',
    },
    logoutButton: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: colors.surfaceLight,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButtonYes: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    modalButtonYesText: {
        color: colors.textSecondary, // Muted for destructive/less preferred action if we want "No" to pop
        fontWeight: '600',
        fontSize: 15,
    },
    modalButtonNo: {
        flex: 1,
        backgroundColor: colors.primary, // Colored box for No
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonNoText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
});
