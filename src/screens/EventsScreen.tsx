import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { KovilEvent } from '../types/Event';

const TYPE_COLORS: Record<KovilEvent['type'], { bg: string; text: string }> = {
  festival:   { bg: '#FEF3E2', text: '#92400E' },
  ritual:     { bg: '#F0FDF4', text: '#166534' },
  procession: { bg: '#EFF6FF', text: '#1D4ED8' },
  other:      { bg: '#F3F4F6', text: '#374151' },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString(),
    month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
  };
}

function EventCard({ event }: { event: KovilEvent }) {
  const { day, month } = formatDate(event.date ?? '2026-01-01');
  const colors = TYPE_COLORS[event.type] ?? TYPE_COLORS['other'];
  const type = event.type ?? 'other';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.eventTitle}>{event.title ?? 'Untitled Event'}</Text>
        <Text style={styles.templeName}>🛕 {event.templeName ?? 'Unknown Temple'}</Text>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const [events, setEvents] = useState<KovilEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as KovilEvent[];
      setEvents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>Palakkad Temples</Text>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#B45309" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>All Events</Text>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
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
    backgroundColor: '#7C2D12',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'flex-start',
    gap: 12,
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
  cardContent: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1917',
  },
  templeName: {
    fontSize: 12,
    color: '#6B7280',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});