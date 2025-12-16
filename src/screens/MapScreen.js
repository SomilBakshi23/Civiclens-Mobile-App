import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'; // Using default for Expo Go
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

// Custom Map Style for Dark Mode
const mapDarkStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
    }
];

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                customMapStyle={mapDarkStyle}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Markers */}
                <Marker
                    coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={[styles.marker, { backgroundColor: '#3B82F6' }]}>
                        <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                </Marker>

                <Marker
                    coordinate={{ latitude: 37.79425, longitude: -122.4124 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={[styles.marker, { backgroundColor: '#F59E0B' }]}>
                        <MaterialCommunityIcons name="cog" size={12} color="white" />
                    </View>
                </Marker>

                <Marker
                    coordinate={{ latitude: 37.77425, longitude: -122.4224 }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <View style={[styles.marker, { backgroundColor: '#EF4444' }]}>
                        <Text style={styles.markerText}>!</Text>
                    </View>
                </Marker>
            </MapView>

            {/* Top Overlays */}
            <View style={styles.topContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.menuBtn}>
                        <Ionicons name="menu" size={24} color="#64748B" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.appTitle}>CivicLens</Text>
                        <Text style={styles.subtitle}>PUBLIC DASHBOARD</Text>
                    </View>
                    <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#64748B" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search location, issue ID, or department"
                        placeholderTextColor="#64748B"
                        style={styles.searchInput}
                    />
                    <TouchableOpacity style={styles.micBtn}>
                        <Ionicons name="mic" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <View style={styles.chipsRow}>
                    <TouchableOpacity style={styles.activeChip}>
                        <Text style={styles.activeChipText}>All Issues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.chipText}>Urgent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <MaterialCommunityIcons name="road-variant" size={14} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.chipText}>Roads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <Ionicons name="water" size={14} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.chipText}>Water</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Sheet Card */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <View style={styles.sheetHeader}>
                    <View>
                        <View style={styles.sheetMetaRow}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>IN PROGRESS</Text>
                            </View>
                            <Text style={styles.issueId}>ID: #4092-A</Text>
                        </View>
                        <Text style={styles.sheetTitle}>Pothole on 5th Ave</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-sharp" size={14} color="#64748B" />
                            <Text style={styles.locationText}>Near Central Park South Entrance</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.shareBtn}>
                        <Ionicons name="share-social-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Stats Metrics */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <View style={styles.metricHeader}>
                            <Text style={styles.metricLabel}>TARGET RESOLUTION</Text>
                            <Ionicons name="time" size={14} color="#334155" />
                        </View>
                        <Text style={[styles.metricValue, { color: '#3B82F6' }]}>14h 20m</Text>
                        <Text style={styles.metricSub}>Within SLA limits</Text>
                        <View style={styles.progressBg}><View style={[styles.progressFill, { width: '70%', backgroundColor: '#3B82F6' }]} /></View>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={styles.metricHeader}>
                            <Text style={styles.metricLabel}>DEPT. EFFICIENCY</Text>
                            <Ionicons name="stats-chart" size={14} color="#334155" />
                        </View>
                        <Text style={styles.metricValue}>94% <Text style={{ fontSize: 12, color: '#3B82F6' }}>↗</Text></Text>
                        <Text style={styles.metricSub}>Public Works Dept.</Text>
                        <View style={styles.progressBg}><View style={[styles.progressFill, { width: '90%', backgroundColor: '#3B82F6' }]} /></View>
                    </View>
                </View>

                {/* Activity Timeline (Partial) */}
                <Text style={styles.timelineTitle}>Activity Timeline</Text>
                <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                        <Text style={styles.timelineTime}>TODAY, 10:42 AM</Text>
                        <Text style={styles.timelineMain}>Repair Crew Dispatched</Text>
                        <Text style={styles.timelineSub}>Crew #42 assigned by Dispatch AI</Text>
                    </View>
                </View>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },

    // Top Container
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingHorizontal: 16,
        zIndex: 10,
        backgroundColor: 'rgba(5, 10, 20, 0.65)', // Faded background behind header elements
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
    },
    subtitle: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#1E293B',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 14,
    },
    micBtn: {
        padding: 4,
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

    // Bottom Sheet logic (Simulated as static view for now)
    bottomSheet: {
        position: 'absolute',
        bottom: 80, // Above Nav Bar
        left: 0,
        right: 0,
        backgroundColor: '#0F1623',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingTop: 12,
        minHeight: 380,
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
        marginBottom: 24,
    },
    sheetMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    statusText: {
        color: '#F59E0B',
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
    shareBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },

    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#151E2E',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    metricLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '700',
    },
    metricValue: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    metricSub: {
        color: '#64748B',
        fontSize: 11,
        marginBottom: 8,
    },
    progressBg: {
        height: 4,
        backgroundColor: '#1E293B',
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },

    timelineTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: '#334155',
        paddingLeft: 16,
        marginLeft: 6,
    },
    timelineDot: {
        position: 'absolute',
        left: -5,
        top: 0,
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#F97316',
        borderWidth: 2,
        borderColor: '#0F1623',
    },
    timelineContent: {
        marginTop: -4,
    },
    timelineTime: {
        color: '#F97316',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 2,
    },
    timelineMain: {
        color: 'white',
        fontSize: 14,
        marginBottom: 2,
    },
    timelineSub: {
        color: '#64748B',
        fontSize: 12,
    },
});
