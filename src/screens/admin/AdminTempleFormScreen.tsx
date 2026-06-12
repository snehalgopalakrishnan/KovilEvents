import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Temple } from '../../types/Temple';

export default function AdminTempleFormScreen({ route, navigation }: any) {
  const temple = route.params?.temple as Temple;

  const [whatsappLink, setWhatsappLink] = useState(temple?.whatsappLink ?? '');
  const [phone, setPhone] = useState(temple?.phone ?? '');
  const [timing, setTiming] = useState(temple?.timing ?? '');
  const [description, setDescription] = useState(temple?.description ?? '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'temples', temple.id), {
        whatsappLink, phone, timing, description
      });
      Alert.alert('Saved!', 'Temple details updated successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Temple Details</Text>
        <Text style={styles.headerSub}>{temple?.name}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the temple..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Temple timing</Text>
        <TextInput
          style={styles.input}
          value={timing}
          onChangeText={setTiming}
          placeholder="e.g. 5:30 AM – 8:00 PM"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. +91 491 252 7366"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>WhatsApp group link</Text>
        <TextInput
          style={styles.input}
          value={whatsappLink}
          onChangeText={setWhatsappLink}
          placeholder="Paste WhatsApp group invite link here"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
        <Text style={styles.hint}>
          To get your group link: Open WhatsApp group → tap group name → Invite via link → Copy link
        </Text>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save temple details</Text>
          )}
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
    backgroundColor: '#1C1917',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 4,
  },
  backBtn: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#1C1917',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: '#B45309',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});