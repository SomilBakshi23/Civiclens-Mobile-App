import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';
import { useAlert } from '../context/AlertContext';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const { width } = Dimensions.get('window');

// Dark Mode Map Style
const mapDarkStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
    { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
    { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
    { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
    { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
    { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];

export default function MapScreen({ navigation }) {
    const { profile } = useContext(AuthContext);
    const { theme, isDarkMode } = useContext(ThemeContext);
    const { showAlert } = useAlert();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState([]);

    // Get color based on priority
    const getMarkerColor = (p) => {
        switch (p) {
            case 'high': return '#EF4444'; // Red
            case 'medium': return '#F59E0B'; // Orange
            case 'low': return '#10B981'; // Green
            default: return '#3B82F6';
        }
    };

    // Initial Location Setup
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied. Cannot show nearby issues.');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            setLoading(false);
        })();
    }, []);

    // Refresh issues directly from Firestore whenever screen is focused
    useFocusEffect(
        useCallback(() => {
            const fetchIssues = async () => {
                try {
                    const q = query(collection(db, "issues"), where("status", "!=", "deleted"));
                    const querySnapshot = await getDocs(q);
                    const fetchedIssues = [];
                    querySnapshot.forEach((doc) => {
                        fetchedIssues.push({ id: doc.id, ...doc.data() });
                    });
                    setIssues(fetchedIssues);
                } catch (e) {
                    console.error("Error fetching map issues: ", e);
                }
            };
            fetchIssues();
        }, [])
    );

    const handleMarkerPress = (issue) => {
        showAlert(
            issue.title,
            `Priority: ${issue.priority ? issue.priority.toUpperCase() : 'NORMAL'}\nStatus: ${issue.status.toUpperCase()}\n\n${issue.description || ''}`,
            [{ text: "OK" }]
        );
    };

    if (errorMsg) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <Ionicons name="location-outline" size={64} color={theme.textSecondary} />
                <Text style={{ color: theme.textPrimary, marginTop: 16, fontSize: 16, textAlign: 'center', paddingHorizontal: 40 }}>
                    {errorMsg}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <MapView
                style={styles.map}
                customMapStyle={isDarkMode ? mapDarkStyle : []}
                provider={PROVIDER_DEFAULT}
                showsUserLocation={true}
                followsUserLocation={true}
                region={location ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                } : undefined}
            >
                {/* Render Issues from Service */}
                {issues.map((issue) => (
                    <Marker
                        key={issue.id}
                        coordinate={{
                            latitude: issue.latitude || 37.78825,
                            longitude: issue.longitude || -122.4324
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={[styles.marker, { backgroundColor: getMarkerColor(issue.priority) }]}>
                            {issue.priority === 'high' ? (
                                <Text style={styles.markerText}>!</Text>
                            ) : (
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
                            )}
                        </View>
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{issue.title}</Text>
                                <Text style={[styles.calloutStatus, { color: getMarkerColor(issue.priority) }]}>
                                    AI PRIORITY: {issue.priority ? issue.priority.toUpperCase() : 'MEDIUM'}
                                </Text>
                                {issue.priorityReason ? (
                                    <Text style={styles.reasonText}>Reason: {issue.priorityReason}</Text>
                                ) : null}
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Top Overlays */}
            <View style={styles.topContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={[styles.menuBtn, { backgroundColor: theme.surface }]} onPress={() => navigation.navigate('UserDashboard')}>
                        <Ionicons name="menu" size={24} color={theme.icon} />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.appTitle, { color: theme.textPrimary }]}>CivicLens</Text>
                        <Text style={[styles.subtitle, { color: theme.primary }]}>LIVE MAP</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={{ uri: profile?.photoURL || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60' }}
                            style={[styles.avatar, { borderColor: theme.surface }]}
                        />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <View style={styles.chipsRow}>
                    <TouchableOpacity style={[styles.activeChip, { backgroundColor: theme.textPrimary }]}>
                        <Text style={[styles.activeChipText, { color: theme.background }]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={[styles.chipText, { color: theme.textSecondary }]}>Urgent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <MaterialCommunityIcons name="road-variant" size={14} color={theme.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={[styles.chipText, { color: theme.textSecondary }]}>Roads</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Sheet Card */}
            <View style={[styles.bottomSheet, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <View style={[styles.handle, { backgroundColor: theme.border }]} />
                <View style={styles.sheetHeader}>
                    <View>
                        <View style={styles.sheetMetaRow}>
                            <View style={[styles.statusBadge, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
                                <Text style={[styles.statusText, { color: theme.primary }]}>LIVE DATA</Text>
                            </View>
                            <Text style={[styles.issueId, { color: theme.textSecondary }]}>{issues.length} Issues Nearby</Text>
                        </View>
                        <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>{location ? "You are here" : "Locating..."}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={14} color={theme.textSecondary} />
                            <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                                {location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : "Waiting for GPS..."}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.sheetActionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => navigation.navigate('Report', { location })}
                    >
                        <Ionicons name="add" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Quick Action Button for Empty Space */}
                <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => navigation.navigate('Report', { location })}
                >
                    <Text style={styles.primaryActionText}>Report Issue Here</Text>
                    <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    // Custom Marker Styles
    marker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    calloutContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        width: 150,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 5,
        marginBottom: 4,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    calloutStatus: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    reasonText: {
        fontSize: 10,
        color: '#64748B',
        textAlign: 'center',
        fontStyle: 'italic'
    },

    // Top Container
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50, // Safe Area
        paddingHorizontal: 16,
        zIndex: 10,
        backgroundColor: 'transparent',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    menuBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    appTitle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5
    },
    subtitle: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        textShadowColor: 'black',
        textShadowRadius: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#1E293B',
    },
    chipsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    activeChip: {
        backgroundColor: 'white',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeChipText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 12,
    },
    chip: {
        backgroundColor: '#1E293B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    chipText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },

    // Bottom Sheet
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0F1623',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingTop: 12,
        paddingBottom: 110, // Add padding to clear the floating tab bar
        minHeight: 250,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#334155',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    sheetMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    statusText: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: '700',
    },
    issueId: {
        color: '#64748B',
        fontSize: 12,
    },
    sheetTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#94A3B8',
        fontSize: 13,
        marginLeft: 4,
    },
    sheetActionBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155'
    },
    primaryActionBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryActionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
