import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { upvoteIssue } from '../services/issueService';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function IssueDetailsScreen({ route, navigation }) {
    const { issue } = route.params;
    const { user, isGuest } = useContext(AuthContext);
    const [likes, setLikes] = useState(issue.upvotes || 0);

    const handleUpvote = async () => {
        if (!user && !isGuest) return; // Should not happen if guarded

        if (await upvoteIssue(issue.id, user.uid)) {
            setLikes(prev => prev + 1);
        } else {
            Alert.alert("Notice", "You have already upvoted this issue.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return '#EF4444';
            case 'in_progress': return '#F59E0B';
            case 'resolved': return '#10B981';
            default: return '#3B82F6';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Issue Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Main Image */}
                <Image
                    source={{ uri: issue.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600' }}
                    style={styles.heroImage}
                />

                <View style={styles.content}>
                    {/* Title & Status */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{issue.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(issue.status)}20`, borderColor: getStatusColor(issue.status) }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                                {issue.status?.toUpperCase() || "OPEN"}
                            </Text>
                        </View>
                    </View>

                    {/* Metadata Row */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{new Date().toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="tag-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{issue.category || 'General'}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{issue.priority?.toUpperCase() || 'NORMAL'}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionHeader}>Description</Text>
                    <Text style={styles.description}>
                        {issue.description}
                    </Text>

                    {/* Location */}
                    <Text style={styles.sectionHeader}>Location</Text>
                    <View style={styles.locationContainer}>
                        <View style={styles.locationTextRow}>
                            <Ionicons name="location" size={18} color={colors.primary} />
                            <Text style={styles.addressText} numberOfLines={2}>
                                {issue.location || "Location Coordinates"}
                            </Text>
                        </View>

                        {/* Mini Map */}
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: issue.latitude || 37.78825,
                                    longitude: issue.longitude || -122.4324,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: issue.latitude || 37.78825,
                                        longitude: issue.longitude || -122.4324
                                    }}
                                />
                            </MapView>
                        </View>
                    </View>

                    {/* Action Bar */}
                    <TouchableOpacity style={styles.upvoteButton} onPress={handleUpvote}>
                        <MaterialCommunityIcons name="thumb-up" size={24} color="white" />
                        <Text style={styles.upvoteText}>Upvote Issue ({likes})</Text>
                    </TouchableOpacity>

                </View>
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
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 12,
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: colors.textSecondary,
        marginLeft: 6,
        fontSize: 14,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: 32,
    },
    locationContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 32,
    },
    locationTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    addressText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 14,
        flex: 1,
    },
    mapContainer: {
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    upvoteButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginBottom: 40,
    },
    upvoteText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
});
