import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ReportScreen({ navigation }) {
    const [description, setDescription] = useState('');

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

                    {/* Mock Camera View */}
                    <View style={styles.cameraView}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }} // Dark crack texture
                            style={[StyleSheet.absoluteFill, { opacity: 0.2 }]} // Simulating dark camera feed
                        />
                        <View style={styles.scanTarget}>
                            <MaterialCommunityIcons name="crop-free" size={48} color="white" />
                        </View>
                    </View>

                    <View style={styles.detectionOverlay}>
                        <Text style={styles.detectedTitle}>Pothole Detected</Text>
                        <View style={styles.confidenceBadge}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color="#3B82F6" />
                            <Text style={styles.confidenceText}>98% Confidence Match</Text>
                        </View>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsRow}>
                    <View style={styles.tag}>
                        <MaterialCommunityIcons name="account-hard-hat" size={16} color="#60A5FA" style={{ marginRight: 6 }} />
                        <Text style={styles.tagText}>Infrastructure</Text>
                    </View>
                    <View style={[styles.tag, { borderColor: '#F87171', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                        <MaterialCommunityIcons name="alert" size={16} color="#F87171" style={{ marginRight: 6 }} />
                        <Text style={[styles.tagText, { color: '#F87171' }]}>High Priority</Text>
                    </View>
                    <TouchableOpacity style={styles.addTag}>
                        <Ionicons name="add" size={16} color={colors.textSecondary} />
                        <Text style={styles.addTagText}>Add Tag</Text>
                    </TouchableOpacity>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>LOCATION</Text>
                    <View style={styles.locationCard}>
                        <View style={styles.mapSnippet}>
                            {/* Placeholder for map snippet */}
                            <View style={{ flex: 1, backgroundColor: '#2C3E50', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="location" size={20} color="#60A5FA" />
                            </View>
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.addressTitle}>124 Main St. (Auto-detected)</Text>
                            <Text style={styles.addressSub}>San Francisco, CA 94105</Text>
                        </View>
                        <TouchableOpacity style={styles.editPin}>
                            <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Describe the issue briefly... (AI suggests: Deep pothole on right lane causing traffic slowdown)"
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

                {/* Media Actions */}
                <View style={styles.mediaActions}>
                    <TouchableOpacity style={styles.mediaBtn}>
                        <Ionicons name="images" size={24} color={colors.textSecondary} />
                        <Text style={styles.mediaText}>Gallery</Text>
                    </TouchableOpacity>

                    <View style={styles.captureBtnOuter}>
                        <TouchableOpacity style={styles.captureBtnInner}>
                            <Ionicons name="camera" size={28} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.mediaBtn}>
                        <Ionicons name="videocam" size={24} color={colors.textSecondary} />
                        <Text style={styles.mediaText}>Video</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>Submit Report</Text>
                    <Ionicons name="send" size={20} color="white" style={{ marginLeft: 8 }} />
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
    tagText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    addTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    addTagText: {
        color: colors.textSecondary,
        fontSize: 12,
        marginLeft: 4,
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
    editPin: {
        padding: 8,
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

    // Media Actions
    mediaActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        gap: 30,
    },
    mediaBtn: {
        alignItems: 'center',
    },
    mediaText: {
        color: colors.textSecondary,
        fontSize: 10,
        marginTop: 4,
    },
    captureBtnOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    captureBtnInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'white',
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
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
