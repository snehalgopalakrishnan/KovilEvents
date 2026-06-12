import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { KovilEvent } from '../../types/Event';

export default function AdminDashboardScreen({ navigation }: any) {
  const [events, setEvents] = useState<KovilEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as KovilEvent[];
      setEvents(data.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function handleDelete(eventId: string, title: string) {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'events', eventId));
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSub}>KovilEvents</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEvent')}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add New Event</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>All Events</Text>

        {loading ? (
          <ActivityIndicator color="#B45309" style={{ marginTop: 20 }} />
        ) : (
          events.map(event => (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{event.templeName} · {event.date}</Text>
              </View>
              <View style={styles.eventActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('AddEvent', { event })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(event.id, event.title)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteText}>Delete</Text>
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
    backgroundColor: '#1C1917',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  statNum: {
    fontSize: 32,
    fontWeight: '700',
    color: '#B45309',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addBtn: {
    marginHorizontal: 16,
    backgroundColor: '#B45309',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
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
  eventRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 12,
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
  eventMeta: {
    fontSize: 11,
    color: '#6B7280',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  editText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  deleteText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
});