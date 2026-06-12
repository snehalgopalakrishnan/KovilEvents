import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Temple } from '../types/Temple';
import { KovilEvent } from '../types/Event';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFollow } from '../hooks/useFollow';
import { useAuth } from '../context/AuthContext';

export default function TempleDetailScreen({ route, navigation }: any) {
    const { temple } = route.params as { temple: Temple };
    const [events, setEvents] = useState<KovilEvent[]>([]);
    const { follow, unfollow, isFollowing } = useFollow();
    const { user } = useAuth();
    const following = isFollowing(temple.id);

    useEffect(() => {
        const q = query(collection(db, 'events'), where('templeId', '==', temple.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as KovilEvent[];
            setEvents(data.sort((a, b) => a.date.localeCompare(b.date)));
        });
        return () => unsubscribe();
    }, [temple.id]);

    function openDirections() {
        if (temple.latitude && temple.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`;
            Linking.openURL(url);
        }
    }

    function openPhone() {
        if (temple.phone) {
            Linking.openURL(`tel:${temple.phone}`);
        }
    }

    async function handleFollow() {
        if (!user) return;
        if (following) {
            await unfollow(temple.id);
        } else {
            await follow(temple.id);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{temple.name}</Text>
                <Text style={styles.headerLocation}>📍 {temple.location}</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.infoCard}>
                    <Text style={styles.description}>{temple.description}</Text>

                    {temple.timing && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>🕐</Text>
                            <Text style={styles.infoText}>{temple.timing}</Text>
                        </View>
                    )}

                    {temple.phone && (
                        <TouchableOpacity style={styles.infoRow} onPress={openPhone}>
                            <Text style={styles.infoIcon}>📞</Text>
                            <Text style={[styles.infoText, styles.link]}>{temple.phone}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, following && styles.actionBtnActive]}
                        onPress={handleFollow}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.actionBtnText, following && styles.actionBtnTextActive]}>
                            {following ? '✓ Following' : '+ Follow'}
                        </Text>
                    </TouchableOpacity>

                    {temple.latitude && (
                        <TouchableOpacity
                            style={styles.directionsBtn}
                            onPress={openDirections}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.directionsBtnText}>🗺 Directions</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {temple.whatsappLink && (
                    <TouchableOpacity
                        style={styles.whatsappBtn}
                        onPress={() => Linking.openURL(temple.whatsappLink!)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.whatsappBtnText}>💬 Join WhatsApp Group</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionLabel}>Upcoming Events ({events.length})</Text>

                {events.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>No upcoming events</Text>
                    </View>
                ) : (
                    events.map(event => (
                        <View key={event.id} style={styles.eventCard}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateDay}>
                                    {new Date(event.date).getDate()}
                                </Text>
                                <Text style={styles.dateMonth}>
                                    {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.eventInfo}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventTime}>🕐 {event.time}</Text>
                                {event.pdfUrl && (
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(event.pdfUrl!)}
                                        style={styles.pdfBtn}
                                    >
                                        <Text style={styles.pdfBtnText}>📄 {event.pdfName || 'View Programme'}</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={styles.shareBtn}
                                    onPress={() => {
                                        const message = `🛕 ${temple.name}\n📅 ${event.title}\n🗓 ${event.date} at ${event.time}\n\nDownload TempleAlert app to follow this temple and get event notifications!`;
                                        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.shareBtnText}>📤 Share on WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF9',
    },
    header: {
        backgroundColor: '#7C2D12',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        gap: 6,
    },
    backBtn: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerLocation: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    description: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoIcon: {
        fontSize: 16,
    },
    infoText: {
        fontSize: 13,
        color: '#6B7280',
    },
    link: {
        color: '#B45309',
        textDecorationLine: 'underline',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#B45309',
        alignItems: 'center',
    },
    actionBtnActive: {
        backgroundColor: '#FEF3E2',
    },
    actionBtnText: {
        fontSize: 13,
        color: '#B45309',
        fontWeight: '600',
    },
    actionBtnTextActive: {
        color: '#92400E',
    },
    directionsBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#7C2D12',
        alignItems: 'center',
    },
    directionsBtnText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        paddingTop: 20,
        paddingBottom: 8,
    },
    emptyBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        gap: 12,
        alignItems: 'flex-start',
    },
    dateBox: {
        backgroundColor: '#FEF3E2',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        minWidth: 44,
    },
    dateDay: {
        fontSize: 20,
        fontWeight: '600',
        color: '#92400E',
    },
    dateMonth: {
        fontSize: 10,
        color: '#B45309',
        fontWeight: '500',
    },
    eventInfo: {
        flex: 1,
        gap: 4,
    },
    eventTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1C1917',
    },
    eventTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    pdfBtn: {
        marginTop: 4,
        backgroundColor: '#EFF6FF',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderColor: '#BFDBFE',
    },
    pdfBtnText: {
        fontSize: 11,
        color: '#1D4ED8',
        fontWeight: '500',
    },
    whatsappBtn: {
        backgroundColor: '#25D366',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    whatsappBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    shareBtn: {
        marginTop: 6,
        backgroundColor: '#F0FDF4',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderColor: '#86EFAC',
    },
    shareBtnText: {
        fontSize: 11,
        color: '#166534',
        fontWeight: '500',
    },
});