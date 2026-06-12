import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Temple } from '../types/Temple';
import { useFollow } from '../hooks/useFollow';
import { useAuth } from '../context/AuthContext';

function TempleCard({ temple, navigation }: { temple: Temple; navigation: any }) {
    const { follow, unfollow, isFollowing } = useFollow();
    const { user } = useAuth();
    const following = isFollowing(temple.id);

    async function handleFollow() {
        if (!user) return;
        if (following) {
            await unfollow(temple.id);
        } else {
            await follow(temple.id);
        }
    }

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TempleDetail', { temple })}
        >
            <View style={styles.iconBox}>
                <Text style={styles.iconText}>🛕</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.templeName}>{temple.name}</Text>
                <Text style={styles.location}>📍 {temple.location}</Text>
            </View>
            <TouchableOpacity
                style={[styles.followBtn, following && styles.followingBtn]}
                onPress={handleFollow}
                activeOpacity={0.8}
            >
                <Text style={[styles.followText, following && styles.followingText]}>
                    {following ? 'Following' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

export default function TemplesScreen({ navigation }: any) {
    const [temples, setTemples] = useState<Temple[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'temples'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Temple[];
            setTemples(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Temples</Text>
                <Text style={styles.headerSub}>Follow to get event alerts</Text>
            </View>

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#B45309" />
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {temples.map(temple => (
                        <TempleCard key={temple.id} temple={temple} navigation={navigation} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF9',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1C1917',
    },
    headerSub: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    loadingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        backgroundColor: '#FEF3E2',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 22,
    },
    cardContent: {
        flex: 1,
        gap: 2,
    },
    templeName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1C1917',
    },
    location: {
        fontSize: 11,
        color: '#6B7280',
    },
    followBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#B45309',
    },
    followingBtn: {
        backgroundColor: '#FEF3E2',
    },
    followText: {
        fontSize: 11,
        color: '#B45309',
        fontWeight: '500',
    },
    followingText: {
        color: '#92400E',
    },
});