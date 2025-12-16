import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import StatusChip from './StatusChip';

export default function IssueCard({ title, location, status, time, id, votes, comments, image }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    {/* Placeholder icon logic if no image, but we'll assume list has images often or icons */}
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.placeholderAvatar]}>
                            <MaterialCommunityIcons name="road-variant" size={20} color={colors.textSecondary} />
                        </View>
                    )}
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.subtitle}>{location} • {id}</Text>
                </View>
                <StatusChip status={status} />
            </View>

            {/* Optional: Description or middle content could go here if design requires, 
          but Image 0 "Recent Activity" is compact. Image 3 has big cards. 
          This card seems to match Image 0's "Recent Activity" list item style. 
      */}
        </View>
    );
}

// Separate component for the Larger Feed Card (Image 3)
export function FeedCard({ item }) {
    return (
        <View style={styles.feedCard}>
            <View style={styles.feedHeader}>
                <StatusChip status={item.status} />
            </View>

            {/* Image Area */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x200' }}
                    style={styles.feedImage}
                />
                <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={12} color="white" />
                    <Text style={styles.timeText}>{item.timeAgo}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.feedTitle}>{item.title}</Text>
                <Text style={styles.feedDesc} numberOfLines={3}>{item.description}</Text>

                <View style={styles.officialResponse}>
                    <MaterialCommunityIcons name="bank" size={16} color={colors.textSecondary} />
                    <Text style={styles.deptName}>{item.department}</Text>
                    {item.verified && <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primary} style={{ marginLeft: 4 }} />}
                </View>

                <View style={styles.actions}>
                    <View style={styles.actionGroup}>
                        <MaterialCommunityIcons name="thumb-up" size={18} color={colors.primary} />
                        <Text style={styles.actionText}>{item.votes}</Text>
                    </View>
                    <View style={styles.actionGroup}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color={colors.textSecondary} />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.actionText}>Share</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // Compact Card (Home Recent Activity)
    card: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
    },
    placeholderAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 12,
    },

    // Large Feed Card
    feedCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    feedHeader: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
    },
    imageContainer: {
        height: 180,
        width: '100%',
        backgroundColor: '#2C3345',
    },
    feedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    timeBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
    content: {
        padding: 16,
    },
    feedTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    feedDesc: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    officialResponse: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    deptName: {
        color: colors.textPrimary,
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    actionText: {
        color: colors.textSecondary,
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '600',
    },
});
