import { View, Text, ScrollView, StyleSheet } from 'react-native';

type Notification = {
  id: string;
  templeName: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    templeName: 'Kalpathy Viswanathar Temple',
    message: 'Thiruvathira Nritham is in 2 days (June 14)',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    templeName: 'Kalpathy Viswanathar Temple',
    message: 'New event added: Kalpathy Ratholsavam on June 30',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n3',
    templeName: 'Hemambika Devi Temple',
    message: 'Pradosha Pooja reminder for June 16',
    time: 'Yesterday, 6:00 PM',
    read: true,
  },
  {
    id: 'n4',
    templeName: 'Thenambikavil Bhagavathy Temple',
    message: 'Aarattu Procession details have been updated',
    time: 'Yesterday, 2:30 PM',
    read: true,
  },
];

function NotifItem({ notif }: { notif: Notification }) {
  return (
    <View style={[styles.item, notif.read && styles.itemRead]}>
      <View style={[styles.dot, notif.read && styles.dotRead]} />
      <View style={styles.itemContent}>
        <Text style={styles.templeName}>🛕 {notif.templeName}</Text>
        <Text style={styles.message}>{notif.message}</Text>
        <Text style={styles.time}>{notif.time}</Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read);
  const read = MOCK_NOTIFICATIONS.filter(n => n.read);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSub}>From temples you follow</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {unread.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>New</Text>
            {unread.map(n => <NotifItem key={n.id} notif={n} />)}
          </>
        )}

        {read.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Earlier</Text>
            {read.map(n => <NotifItem key={n.id} notif={n} />)}
          </>
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
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemRead: {
    backgroundColor: '#FAFAF9',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B45309',
    marginTop: 4,
    flexShrink: 0,
  },
  dotRead: {
    backgroundColor: '#D1D5DB',
  },
  itemContent: {
    flex: 1,
    gap: 3,
  },
  templeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1917',
  },
  message: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});