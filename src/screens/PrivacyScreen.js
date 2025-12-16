import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PrivacyScreen({ navigation }) {
    const [publicProfile, setPublicProfile] = useState(false);
    const [locationSharing, setLocationSharing] = useState(true);
    const [aiContribution, setAiContribution] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Data</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Data Protection Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View style={styles.shieldIconContainer}>
                            <MaterialCommunityIcons name="shield-check" size={24} color="#60A5FA" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.statusTitle}>Data Protection Status</Text>
                        </View>
                    </View>
                    <Text style={styles.statusDesc}>
                        Your civic data is encrypted and protected. We value transparency in how your contributions are used for city improvements.
                    </Text>
                    <View style={styles.compliantBadge}>
                        <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
                        <Text style={styles.compliantText}>GDPR & CCPA Compliant</Text>
                    </View>
                </View>

                {/* Sharing Preferences */}
                <Text style={styles.sectionHeader}>SHARING PREFERENCES</Text>

                <View style={styles.preferenceGroup}>
                    {/* Public Profile */}
                    <View style={styles.preferenceItem}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={styles.prefTitle}>Public Profile</Text>
                            <Text style={styles.prefDesc}>Allow neighbors to see your civic achievements and rank.</Text>
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

                    <View style={styles.divider} />

                    {/* Location Sharing */}
                    <View style={styles.preferenceItem}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={styles.prefTitle}>Location Sharing</Text>
                            <Text style={styles.prefDesc}>Required to verify pothole reports and local issues.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setLocationSharing}
                            value={locationSharing}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* AI Contribution */}
                    <View style={styles.preferenceItem}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={styles.prefTitle}>AI Analysis Contribution</Text>
                            <Text style={styles.prefDesc}>Anonymize my reports to help train the Civic AI model.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#334155", true: colors.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor="#334155"
                            onValueChange={setAiContribution}
                            value={aiContribution}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                {/* Your Data Actions */}
                <Text style={styles.sectionHeader}>YOUR DATA</Text>

                <View style={styles.dataActionsRow}>
                    <TouchableOpacity style={styles.dataActionButton}>
                        <MaterialCommunityIcons name="download" size={24} color="white" style={{ marginBottom: 8 }} />
                        <Text style={styles.dataActionTitle}>Export Data</Text>
                        <Text style={styles.dataActionSubtitle}>Download CSV</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dataActionButton}>
                        <MaterialCommunityIcons name="delete-forever" size={24} color="white" style={{ marginBottom: 8 }} />
                        <Text style={styles.dataActionTitle}>Delete Acct</Text>
                        <Text style={styles.dataActionSubtitle}>Permanent</Text>
                    </TouchableOpacity>
                </View>

                {/* Legal Links */}
                <View style={styles.legalContainer}>
                    <TouchableOpacity style={styles.legalLink}>
                        <Text style={styles.legalText}>Privacy Policy</Text>
                        <MaterialCommunityIcons name="open-in-new" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.legalLink}>
                        <Text style={styles.legalText}>Terms of Service</Text>
                        <MaterialCommunityIcons name="open-in-new" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                    <MaterialCommunityIcons name="lock" size={16} color="white" style={{ marginLeft: 8 }} />
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
    content: {
        padding: 20,
    },
    statusCard: {
        backgroundColor: '#111827', // Darker to verify against background
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    shieldIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statusTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusDesc: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
    },
    compliantBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    compliantText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '700',
    },
    sectionHeader: {
        color: colors.textTertiary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    preferenceGroup: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
        overflow: 'hidden',
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    prefTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    prefDesc: {
        color: colors.textSecondary,
        fontSize: 11,
        lineHeight: 16,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },
    dataActionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    dataActionButton: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    dataActionTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    dataActionSubtitle: {
        color: colors.textSecondary,
        fontSize: 10,
    },
    legalContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 20,
    },
    legalLink: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    legalText: {
        color: colors.textSecondary,
        fontSize: 14,
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
