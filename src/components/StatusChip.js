import { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { ThemeContext } from '../context/ThemeContext';

export default function StatusChip({ status }) {
    const { theme } = useContext(ThemeContext);
    let bg = theme.surfaceLight;
    let color = theme.textSecondary;
    let label = status;

    switch (status?.toLowerCase()) {
        case 'resolved':
            bg = theme.successBg;
            color = theme.success;
            label = 'RESOLVED';
            break;
        case 'in progress':
            bg = theme.warningBg;
            color = theme.warning;
            label = 'IN PROGRESS';
            break;
        case 'open':
            bg = theme.errorBg;
            color = theme.error;
            label = 'OPEN';
            break;
        case 'urgent':
            bg = theme.errorBg;
            color = theme.error;
            label = 'URGENT';
            break;
        default:
            bg = theme.surfaceLight;
            color = theme.textSecondary;
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
