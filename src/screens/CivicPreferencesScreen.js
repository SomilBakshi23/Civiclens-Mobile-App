import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { ThemeContext } from '../context/ThemeContext';

export default function CivicPreferencesScreen({ navigation }) {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [issueUpdates, setIssueUpdates] = useState(true);
    const [nearbyAlerts, setNearbyAlerts] = useState(true);
    const [cityAnnouncements, setCityAnnouncements] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);

    const [language, setLanguage] = useState('English (US)');
    const [region, setRegion] = useState('Metro Central');

    const [modalType, setModalType] = useState(null); // 'language' or 'region' or null

    const LANGUAGES = ['English (US)', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
    const REGIONS = ['Metro Central', 'North Disctrict', 'South Bay', 'East Side', 'West Hills'];

    const renderModalOption = ({ item }) => (
        <TouchableOpacity
            style={[styles.modalOption, { borderBottomColor: theme.border }]}
            onPress={() => {
                if (modalType === 'language') setLanguage(item);
                if (modalType === 'region') setRegion(item);
                setModalType(null);
            }}
        >
            <Text style={[styles.modalOptionText, { color: theme.textPrimary }]}>{item}</Text>
            {(modalType === 'language' ? language : region) === item && (
                <Ionicons name="checkmark" size={20} color={theme.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Civic Preferences</Text>
                <TouchableOpacity>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* AI Personalization Card */}
                <View style={[styles.aiCard, { backgroundColor: isDarkMode ? '#111827' : '#F1F5F9', borderColor: theme.border }]}>
                    <View style={styles.aiIconContainer}>
                        <MaterialCommunityIcons name="robot" size={24} color="#60A5FA" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.aiTitle, { color: theme.textPrimary }]}>AI Personalization</Text>
                        <Text style={[styles.aiDesc, { color: theme.textSecondary }]}>
                            CivicLens uses preferences to curate issues relevant to you. Your data is anonymized for city planning insights.
                        </Text>
                    </View>
                </View>

                {/* Notifications & Alerts */}
                <Text style={[styles.sectionHeader, { color: theme.textTertiary }]}>NOTIFICATIONS & ALERTS</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="bell-ring" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Issue Status Updates</Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>Get notified when your reports are resolved</Text>
                        </View>
                        <Switch
                            trackColor={{ false: isDarkMode ? "#334155" : "#cbd5e1", true: theme.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor={isDarkMode ? "#334155" : "#cbd5e1"}
                            onValueChange={setIssueUpdates}
                            value={issueUpdates}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="navigation" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Nearby Incidents</Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>Alerts within 1 mile of your home</Text>
                        </View>
                        <Switch
                            trackColor={{ false: isDarkMode ? "#334155" : "#cbd5e1", true: theme.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor={isDarkMode ? "#334155" : "#cbd5e1"}
                            onValueChange={setNearbyAlerts}
                            value={nearbyAlerts}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="bullhorn" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>City Announcements</Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>Official news and emergency alerts</Text>
                        </View>
                        <Switch
                            trackColor={{ false: isDarkMode ? "#334155" : "#cbd5e1", true: theme.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor={isDarkMode ? "#334155" : "#cbd5e1"}
                            onValueChange={setCityAnnouncements}
                            value={cityAnnouncements}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                {/* Regional & Language */}
                <Text style={[styles.sectionHeader, { color: theme.textTertiary }]}>REGIONAL & LANGUAGE</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <TouchableOpacity style={styles.row} onPress={() => setModalType('language')}>
                        <MaterialCommunityIcons name="translate" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Preferred Language</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.valueText, { color: theme.textSecondary }]}>{language}</Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <TouchableOpacity style={styles.row} onPress={() => setModalType('region')}>
                        <MaterialCommunityIcons name="office-building" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Active Region</Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>Determines local authorities</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.valueText, { color: theme.textSecondary }]}>{region}</Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Privacy & Data Sharing */}
                <Text style={[styles.sectionHeader, { color: theme.textTertiary }]}>PRIVACY & DATA SHARING</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="earth" size={22} color={theme.textSecondary} style={styles.rowIcon} />
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Public Profile</Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>Show my achievements to neighbors</Text>
                        </View>
                        <Switch
                            trackColor={{ false: isDarkMode ? "#334155" : "#cbd5e1", true: theme.primary }}
                            thumbColor={"white"}
                            ios_backgroundColor={isDarkMode ? "#334155" : "#cbd5e1"}
                            onValueChange={setPublicProfile}
                            value={publicProfile}
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                    </View>
                </View>

                <Text style={[styles.legalFooter, { color: theme.textSecondary }]}>
                    CivicLens operates under the Open Data Transparency Act.{"\n"}
                    <Text style={{ textDecorationLine: 'underline', color: theme.primary }}>Learn more</Text>.
                </Text>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="content-save" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            {/* Selection Modal */}
            <Modal
                transparent={true}
                visible={modalType !== null}
                animationType="fade"
                onRequestClose={() => setModalType(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalType(null)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                                {modalType === 'language' ? 'Select Language' : 'Select Region'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalType(null)}>
                                <Ionicons name="close" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={modalType === 'language' ? LANGUAGES : REGIONS}
                            renderItem={renderModalOption}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </TouchableOpacity>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '60%',
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
