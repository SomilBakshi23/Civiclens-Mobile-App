import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { createIssue } from '../services/issueService';
import { calculatePriority } from '../utils/priorityEngine';

const { width } = Dimensions.get('window');

export default function ReportScreen({ navigation }) {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState(''); // Added title state
    const [category, setCategory] = useState({ name: 'Infrastructure', icon: 'account-hard-hat' }); // Default category
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim() || !title.trim()) {
            Alert.alert("Missing Details", "Please provide a title and description.");
            return;
        }

        setLoading(true);

        const priority = calculatePriority(category.name + " " + title, 0);

        const issueData = {
            title: title,
            description: description,
            category: category.name,
            priority: priority,
            location: '124 Main St. (Auto)', // Location is mocked per requirement
            imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400', // Mock image for demo
        };

        const result = await createIssue(issueData);

        setLoading(false);

        if (result.success) {
            Alert.alert("Report Submitted", "Your issue has been reported and prioritized.", [
                { text: "OK", onPress: () => navigation.navigate('Home') }
            ]);
        } else {
            Alert.alert("Error", "Could not submit report. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Report</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* AI Camera Section */}
                <View style={styles.cameraContainer}>
                    <View style={styles.aiBadge}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.aiText}>AI ANALYSIS ACTIVE</Text>
                    </View>
                    <View style={styles.flashBtn}>
                        <Ionicons name="flash" size={16} color="white" />
                    </View>
                    <View style={styles.cameraView}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
                            style={[StyleSheet.absoluteFill, { opacity: 0.2 }]}
                        />
                        <View style={styles.scanTarget}>
                            <MaterialCommunityIcons name="crop-free" size={48} color="white" />
                        </View>
                    </View>
                    <View style={styles.detectionOverlay}>
                        <Text style={styles.detectedTitle}>{title || "Detecting Issue..."}</Text>
                        <View style={styles.confidenceBadge}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color="#3B82F6" />
                            <Text style={styles.confidenceText}>98% Confidence Match</Text>
                        </View>
                    </View>
                </View>

                {/* Title Input (New Requirement) */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ISSUE TITLE</Text>
                    <View style={styles.inputContainerSm}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Pothole on 5th Ave"
                            placeholderTextColor={colors.textTertiary}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                {/* Category Selection (Simplified for Demo) */}
                <View style={styles.tagsRow}>
                    <TouchableOpacity
                        style={[styles.tag, category.name === 'Infrastructure' && styles.activeTag]}
                        onPress={() => setCategory({ name: 'Infrastructure', icon: 'account-hard-hat' })}
                    >
                        <MaterialCommunityIcons name="account-hard-hat" size={16} color="#60A5FA" style={{ marginRight: 6 }} />
                        <Text style={styles.tagText}>Infrastructure</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tag, category.name === 'Electrical' && styles.activeTag]}
                        onPress={() => setCategory({ name: 'Electrical', icon: 'flash' })}
                    >
                        <MaterialCommunityIcons name="flash" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                        <Text style={styles.tagText}>Electrical</Text>
                    </TouchableOpacity>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>LOCATION</Text>
                    <View style={styles.locationCard}>
                        <View style={styles.mapSnippet}>
                            <View style={{ flex: 1, backgroundColor: '#2C3E50', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="location" size={20} color="#60A5FA" />
                            </View>
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.addressTitle}>124 Main St. (Auto-detected)</Text>
                            <Text style={styles.addressSub}>San Francisco, CA 94105</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Describe the issue briefly..."
                            placeholderTextColor={colors.textTertiary}
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TouchableOpacity style={styles.micBtn}>
                            <Ionicons name="mic" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.submitText}>Submit Report</Text>
                            <Ionicons name="send" size={20} color="white" style={{ marginLeft: 8 }} />
                        </>
                    )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },

    // Camera
    cameraContainer: {
        height: 320,
        marginHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#0F1623',
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.border,
    },
    cameraView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050A14',
    },
    aiBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        zIndex: 10,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginRight: 8,
    },
    aiText: {
        color: '#93C5FD',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    flashBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scanTarget: {
        opacity: 0.8,
    },
    detectionOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    detectedTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    confidenceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confidenceText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },

    // Tags
    tagsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 20,
        gap: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTag: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: colors.primary,
    },
    tagText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },

    // Section
    section: {
        padding: 16,
        paddingBottom: 0,
    },
    sectionLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 1,
    },
    locationCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mapSnippet: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    addressTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
    },
    addressSub: {
        color: colors.textSecondary,
        fontSize: 12,
    },

    // Input
    inputContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        height: 120,
    },
    inputContainerSm: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
    },
    input: {
        color: 'white',
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: 'top',
        flex: 1,
    },
    micBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Submit
    submitBtn: {
        backgroundColor: colors.primary,
        margin: 16,
        paddingVertical: 18,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginTop: 24,
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
