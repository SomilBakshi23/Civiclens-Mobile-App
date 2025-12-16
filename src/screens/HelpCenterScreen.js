import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../theme/colors';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQ_DATA = [
    {
        id: '1',
        question: 'How do I report an issue?',
        answer: 'To report an issue, tap on the camera icon in the bottom center of the home screen ("Report"). You can then take a photo, add a description, and submit it directly to the dashboard.'
    },
    {
        id: '2',
        question: 'Can I edit my report after submitting?',
        answer: 'Currently, reports cannot be edited once submitted to ensure data integrity. However, you can delete a report if it was submitted in error and create a new one.'
    },
    {
        id: '3',
        question: 'How is the Civic Score calculated?',
        answer: 'Your Civic Score increases every time you report a valid issue, verify other reports, or when your reported issues get resolved by authorities. It reflects your active contribution to the community.'
    },
    {
        id: '4',
        question: 'Is my personal data safe?',
        answer: 'Yes, we take privacy seriously. Your location data is only used for issue mapping, and your personal profile details are visible only to verified users or authorities if necessary. Checks our Privacy Policy for more info.'
    },
    {
        id: '5',
        question: 'What do the different status colors mean?',
        answer: 'Red (Open) means the issue is new. Orange (In Progress) means authorities are working on it. Green (Resolved) means the issue has been fixed and verified.'
    }
];

const CONTACT_OPTIONS = [
    { id: 'c1', title: 'Chat with Support', icon: 'chatbubble-ellipses-outline', color: '#3B82F6', subtitle: 'Average wait time: 2 min' },
    { id: 'c2', title: 'Email Us', icon: 'mail-outline', color: '#EC4899', subtitle: 'support@civiclens.org' },
    { id: 'c3', title: 'Report a Bug', icon: 'bug-outline', color: '#F59E0B', subtitle: 'Help us improve the app' },
];

function AccordionItem({ item, expanded, onPress, theme }) {
    return (
        <View style={[styles.accordionItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.accordionHeader} onPress={onPress}>
                <Text style={[styles.questionText, { color: theme.textPrimary }]}>{item.question}</Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.textSecondary}
                />
            </TouchableOpacity>
            {expanded && (
                <View style={[styles.accordionBody, { borderTopColor: theme.border }]}>
                    <Text style={[styles.answerText, { color: theme.textSecondary }]}>{item.answer}</Text>
                </View>
            )}
        </View>
    );
}

export default function HelpCenterScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredFaq = FAQ_DATA.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Help Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.textSecondary} style={{ marginRight: 10 }} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.textPrimary }]}
                        placeholder="Search for answers..."
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Quick Actions / Contact */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Need more help?</Text>
                <View style={styles.contactGrid}>
                    {CONTACT_OPTIONS.map((option) => (
                        <TouchableOpacity key={option.id} style={[styles.contactCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={[styles.iconBox, { backgroundColor: option.color + '20' }]}>
                                <Ionicons name={option.icon} size={24} color={option.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.contactTitle, { color: theme.textPrimary }]}>{option.title}</Text>
                                <Text style={[styles.contactSubtitle, { color: theme.textSecondary }]}>{option.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* FAQs */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 32 }]}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {filteredFaq.map((item) => (
                        <AccordionItem
                            key={item.id}
                            item={item}
                            expanded={expandedId === item.id}
                            onPress={() => toggleExpand(item.id)}
                            theme={theme}
                        />
                    ))}
                    {filteredFaq.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={{ color: theme.textSecondary }}>No articles found for "{searchQuery}"</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 32,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    contactGrid: {
        gap: 12,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 12,
    },
    faqList: {
        gap: 12,
    },
    accordionItem: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        minHeight: 56,
    },
    accordionBody: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 0, // Visual style choice
    },
    questionText: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        paddingRight: 10,
    },
    answerText: {
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    }
});
