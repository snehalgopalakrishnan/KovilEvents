import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { TEMPLES } from '../data/mockData';
import { EVENTS } from '../data/mockData';
import { Temple } from '../types/Temple';

function getEventCount(templeId: string) {
  return EVENTS.filter(e => e.templeId === templeId).length;
}

function TempleCard({ temple }: { temple: Temple }) {
  const [following, setFollowing] = useState(false);
  const eventCount = getEventCount(temple.id);

  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>🛕</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.templeName}>{temple.name}</Text>
        <Text style={styles.location}>📍 {temple.location}</Text>
        <Text style={styles.eventCount}>{eventCount} upcoming event{eventCount !== 1 ? 's' : ''}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followBtn, following && styles.followingBtn]}
        onPress={() => setFollowing(!following)}
        activeOpacity={0.8}
      >
        <Text style={[styles.followText, following && styles.followingText]}>
          {following ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TemplesScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Temples</Text>
        <Text style={styles.headerSub}>Follow to get event alerts</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TEMPLES.map(temple => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
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
  eventCount: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
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