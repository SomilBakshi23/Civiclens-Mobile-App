import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function PriorityBadge({ priority, score }) {
    // Default to High Priority style since that's what we see most
    let bg = colors.errorBg;
    let color = colors.error;
    let icon = "alert-circle";

    if (priority?.toLowerCase().includes('medium')) {
        bg = colors.warningBg;
        color = colors.warning;
        icon = "alert";
    } else if (priority?.toLowerCase().includes('low')) {
        bg = colors.infoBg;
        color = colors.info;
        icon = "information";
    }

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={14} color={color} style={{ marginRight: 4 }} />
            <Text style={[styles.text, { color: color }]}>{priority}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
