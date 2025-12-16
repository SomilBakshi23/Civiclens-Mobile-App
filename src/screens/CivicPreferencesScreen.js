import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CivicPreferencesScreen({ navigation }) {
    const [issueUpdates, setIssueUpdates] = useState(true);
    const [nearbyAlerts, setNearbyAlerts] = useState(true);
    const [cityAnnouncements, setCityAnnouncements] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Civic Preferences</Text>
                <TouchableOpacity>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* AI Personalization Card */}
                <View style={styles.aiCard}>
                    <View style={styles.aiIconContainer}>
                        <MaterialCommunityIcons name="robot" size={24} color="#60A5FA" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.aiTitle}>AI Personalization</Text>
                        <Text style={styles.aiDesc}>
                            CivicLens uses preferences to curate issues relevant to you. Your data is anonymized for city planning insights.
                        </Text>
                    </View>
                </View>

                {/* Notifications & Alerts */}
                <Text style={styles.sectionHeader}>NOTIFICATIONS & ALERTS</Text>
                <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="bell-ring" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Issue Status Updates</Text>
                            <Text style={styles.rowSubtitle}>Get notified when your reports are resolved</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setIssueUpdates}
                            value={issueUpdates}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="navigation" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Nearby Incidents</Text>
                            <Text style={styles.rowSubtitle}>Alerts within 1 mile of your home</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setNearbyAlerts}
                            value={nearbyAlerts}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="bullhorn" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>City Announcements</Text>
                            <Text style={styles.rowSubtitle}>Official news and emergency alerts</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setCityAnnouncements}
                            value={cityAnnouncements}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                {/* Regional & Language */}
                <Text style={styles.sectionHeader}>REGIONAL & LANGUAGE</Text>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={styles.row}>
                        <MaterialCommunityIcons name="translate" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Preferred Language</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.valueText}>English (US)</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.row}>
                        <MaterialCommunityIcons name="office-building" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Active Region</Text>
                            <Text style={styles.rowSubtitle}>Determines local authorities</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.valueText}>Metro Central</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Privacy & Data Sharing */}
                <Text style={styles.sectionHeader}>PRIVACY & DATA SHARING</Text>
                <View style={styles.sectionContainer}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="earth" size={22} color={colors.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Public Profile</Text>
                            <Text style={styles.rowSubtitle}>Show my achievements to neighbors</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setPublicProfile}
                            value={publicProfile}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                <Text style={styles.legalFooter}>
                    CivicLens operates under the Open Data Transparency Act.{"\n"}
                    <Text style={{ textDecorationLine: 'underline', color: colors.primary }}>Learn more</Text>.
                </Text>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="content-save" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
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
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 4,
    },
    resetText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    aiCard: {
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    aiIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    aiTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    aiDesc: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    sectionHeader: {
        color: colors.textTertiary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 0.5,
        marginTop: 8,
    },
    sectionContainer: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    rowIcon: {
        marginRight: 16,
    },
    rowContent: {
        flex: 1,
        marginRight: 12,
    },
    rowTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    rowSubtitle: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16, // Indent divider
        marginLeft: 54, // Align with text
    },
    valueText: {
        color: colors.textSecondary,
        fontSize: 14,
        marginRight: 4,
    },
    legalFooter: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 20,
    },
    footer: {
        padding: 20,
        paddingTop: 0,
    },
    saveButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
