import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ThemeContext } from '../context/ThemeContext';
import { createIssue } from '../services/issueService';
import { calculatePriority } from '../utils/priorityEngine';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function ReportScreen({ navigation }) {
    const { isGuest, logout, user, profile } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState({ name: 'Infrastructure', icon: 'account-hard-hat' });
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState('Detecting location...');

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

            if (locationStatus === 'granted') {
                try {
                    let loc = await Location.getCurrentPositionAsync({});
                    setLocation(loc);
                    // Optional: Reverse geocode to get address for display
                    let address = await Location.reverseGeocodeAsync({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude
                    });
                    if (address && address.length > 0) {
                        const addr = address[0];
                        setLocationAddress(`${addr.street || ''} ${addr.name || ''}, ${addr.city} `);
                    } else {
                        setLocationAddress(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)} `);
                    }
                } catch (e) {
                    setLocationAddress("Location unavailable");
                }
            } else {
                setLocationAddress("Permission denied");
            }
        })();
    }, []);

    // Guest & Incomplete Profile Protection Logic
    if (isGuest || (user && profile && !profile.isProfileComplete)) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background }]}>
                <MaterialCommunityIcons name="account-lock" size={64} color={theme.textSecondary} style={{ marginBottom: 20 }} />
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{isGuest ? "Login Required" : "Profile Incomplete"}</Text>
                <Text style={[styles.heroSubtitle, { marginTop: 10, marginBottom: 30, color: theme.textSecondary, textAlign: 'center' }]}>
                    {isGuest
                        ? "You must be logged in to report issues. Guest access is read-only."
                        : "You must complete your profile setup to report issues."}
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => logout()}>
                    <Text style={styles.buttonText}>{isGuest ? "Go to Login" : "Complete Profile"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const takePhoto = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Disabling editing to reduce crash risk on low-memory devices
                quality: 0.5,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                if (asset.width < 200 || asset.height < 200) {
                    Alert.alert("Image Error", "The image is too small. Please take a clear photo of the issue.");
                    return;
                }
                setImage(asset.uri);
            }
        } catch (e) {
            Alert.alert("Camera Error", "Could not open camera. Please try again or check permissions.");
            console.error(e);
        }
    };

    const handleSubmit = async () => {
        if (!description.trim() || !title.trim()) {
            Alert.alert("Missing Details", "Please provide a title and description.");
            return;
        }

        if (!image) {
            Alert.alert("Evidence Required", "Please upload a clear image of the issue to allow AI verification.");
            return;
        }

        if (!location) {
            Alert.alert("Location Missing", "We need your location to report this issue. Please enable permissions.");
            return;
        }

        setLoading(true);

        const { priority, reason } = calculatePriority({
            category: category.name,
            upvotes: 0,
            imageUri: image,
            title: title
        });

        // Capture current GPS coordinates exactly when submitting
        let currentLoc = location;
        try {
            currentLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        } catch (e) {
            // fallback to last known
        }

        const issueData = {
            title: title,
            description: description,
            category: category.name,
            priority: priority,
            priorityReason: reason,
            status: 'open', // Explicitly set status to open
            reportedBy: user?.uid, // Bind to current user
            location: locationAddress,
            latitude: currentLoc.coords.latitude,
            longitude: currentLoc.coords.longitude,
            imageUri: image, // Store local URI for demo
            imageUrl: image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400', // Fallback
        };

        const result = await createIssue(issueData);

        setLoading(false);

        if (result.success) {
            Alert.alert("Report Submitted", "Your issue has been reported.\n\n🏆 You earned +10 Civic Score!", [
                {
                    text: "OK", onPress: () => {
                        // Clear Form
                        setTitle('');
                        setDescription('');
                        setImage(null);
                        setCategory({ name: 'Infrastructure', icon: 'account-hard-hat' });
                        // Navigate away
                        navigation.navigate('MainTabs', { screen: 'Home' });
                    }
                }
            ]);
        } else {
            Alert.alert("Error", "Could not submit report. Please try again.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>New Report</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* AI Camera Section */}
                <TouchableOpacity style={[styles.cameraContainer, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={takePhoto}>
                    {image ? (
                        <Image source={{ uri: image }} style={StyleSheet.absoluteFill} />
                    ) : (
                        <View style={[styles.cameraView, { backgroundColor: theme.background }]}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
                                style={[StyleSheet.absoluteFill, { opacity: 0.2 }]}
                            />
                            <View style={styles.scanTarget}>
                                <MaterialCommunityIcons name="camera" size={48} color="white" />
                                <Text style={{ color: 'white', marginTop: 10, fontWeight: '600' }}>Tap to Take Photo</Text>
                            </View>
                        </View>
                    )}

                    {!image && (
                        <View style={styles.aiBadge}>
                            <View style={styles.recordingDot} />
                            <Text style={styles.aiText}>AI ANALYSIS READY</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Title Input */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ISSUE TITLE</Text>
                    <View style={[styles.inputContainerSm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <TextInput
                            style={[styles.input, { color: theme.textPrimary }]}
                            placeholder="e.g., Pothole on 5th Ave"
                            placeholderTextColor={theme.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                {/* Category Selection */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {[
                        { name: 'Infrastructure', icon: 'account-hard-hat', color: '#60A5FA' },
                        { name: 'Electrical', icon: 'lightning-bolt', color: '#F59E0B' },
                        { name: 'Sanitation', icon: 'trash-can-outline', color: '#10B981' },
                        { name: 'Water', icon: 'water', color: '#3B82F6' },
                        { name: 'Traffic', icon: 'car', color: '#EF4444' },
                        { name: 'Vandalism', icon: 'wall', color: '#8B5CF6' },
                        { name: 'Other', icon: 'dots-horizontal', color: '#9CA3AF' }
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.tag,
                                { backgroundColor: theme.surface, borderColor: theme.border },
                                category.name === item.name && { backgroundColor: theme.primary + '20', borderColor: theme.primary },
                                { marginRight: 12 } // Add gap
                            ]}
                            onPress={() => setCategory({ name: item.name, icon: item.icon })}
                        >
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={16}
                                // User requested colored icons ("not the whole option"). 
                                // Even when active, we keep the specific color to show identity, 
                                // or maybe white if the background is strong? 
                                // "Electricity icon should be yellow". 
                                // Let's keep the icon colored always, and maybe the active background is subtle or dark blue.
                                color={item.color}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.tagText, { color: theme.textPrimary }, category.name === item.name && { color: theme.primary }]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>LOCATION</Text>
                    <View style={[styles.locationCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.mapSnippet}>
                            <View style={{ flex: 1, backgroundColor: theme.canvas, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="location" size={20} color={theme.primary} />
                            </View>
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={[styles.addressTitle, { color: theme.textPrimary }]}>{locationAddress}</Text>
                            <Text style={[styles.addressSub, { color: theme.textSecondary }]}>{location ? `Lat: ${location.coords.latitude.toFixed(5)}, Long: ${location.coords.longitude.toFixed(5)} ` : "Waiting for GPS..."}</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DESCRIPTION</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <TextInput
                            style={[styles.input, { color: theme.textPrimary }]}
                            placeholder="Describe the issue briefly..."
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />
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
    scanTarget: {
        opacity: 0.9,
        alignItems: 'center',
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
