import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StatusChip({ status }) {
    let bg = colors.surfaceLight;
    let color = colors.textSecondary;
    let label = status;

    switch (status?.toLowerCase()) {
        case 'resolved':
            bg = colors.successBg;
            color = colors.success;
            label = 'RESOLVED';
            break;
        case 'in progress':
            bg = colors.warningBg;
            color = colors.warning;
            label = 'IN PROGRESS';
            break;
        case 'open':
            bg = colors.errorBg;
            color = colors.error;
            label = 'OPEN';
            break;
        case 'urgent':
            bg = colors.errorBg;
            color = colors.error;
            label = 'URGENT';
            break;
        default:
            bg = colors.surfaceLight;
            color = colors.textSecondary;
    }

    return (
        <View style={[styles.container, { backgroundColor: bg, borderColor: color }]}>
            <Text style={[styles.text, { color: color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderWidth: 0, // Design looks like solid bg without border usually, but let's check. Image shows solid bg.
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
