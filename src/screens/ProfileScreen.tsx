import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { TEMPLES } from '../data/mockData';
import { Temple } from '../types/Temple';

const FOLLOWED_IDS = ['t1', 't3'];

export default function ProfileScreen() {
  const [followed, setFollowed] = useState<string[]>(FOLLOWED_IDS);

  const followedTemples = TEMPLES.filter(t => followed.includes(t.id));

  function unfollow(templeId: string) {
    setFollowed(prev => prev.filter(id => id !== templeId));
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>B</Text>
        </View>
        <Text style={styles.name}>Bhavani</Text>
        <Text style={styles.email}>bhavani@example.com</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.sectionLabel}>Following ({followedTemples.length})</Text>

        {followedTemples.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>You are not following any temples yet.</Text>
            <Text style={styles.emptySubText}>Go to the Temples tab to follow temples and get event alerts.</Text>
          </View>
        )}

        {followedTemples.map(temple => (
          <View key={temple.id} style={styles.card}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🛕</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.templeName}>{temple.name}</Text>
              <Text style={styles.location}>📍 {temple.location}</Text>
            </View>
            <TouchableOpacity
              style={styles.unfollowBtn}
              onPress={() => unfollow(temple.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.unfollowText}>Unfollow</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Settings</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>🔔</Text>
            <Text style={styles.settingsLabel}>Notification preferences</Text>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>🌐</Text>
            <Text style={styles.settingsLabel}>Language</Text>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>ℹ️</Text>
            <Text style={styles.settingsLabel}>About KovilEvents</Text>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

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
    paddingBottom: 28,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#92400E',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  emptyBox: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  card: {
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
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF3E2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
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
  unfollowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  unfollowText: {
    fontSize: 11,
    color: '#6B7280',
  },
  settingsCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingsIcon: {
    fontSize: 18,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1C1917',
  },
  settingsArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E5E7EB',
    marginLeft: 46,
  },
  signOutBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
});