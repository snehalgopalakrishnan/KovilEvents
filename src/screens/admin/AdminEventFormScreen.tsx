import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Temple } from '../../types/Temple';
import DateTimePicker from '@react-native-community/datetimepicker';

function convertTo24Hour(timeStr: string) {
    if (!timeStr) return '00:00';
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours}:${minutes}`;
}

function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export default function AdminEventFormScreen({ route, navigation }: any) {
    const existingEvent = route.params?.event;
    const isEditing = !!existingEvent;

    const [title, setTitle] = useState(existingEvent?.title ?? '');
    const [description, setDescription] = useState(existingEvent?.description ?? '');
    const [date, setDate] = useState(existingEvent?.date ? new Date(existingEvent.date) : new Date());
    const [time, setTime] = useState(existingEvent?.date ? new Date(`${existingEvent.date}T${convertTo24Hour(existingEvent.time)}`) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [type, setType] = useState(existingEvent?.type ?? 'festival');
    const [templeId, setTempleId] = useState(existingEvent?.templeId ?? '');
    const [templeName, setTempleName] = useState(existingEvent?.templeName ?? '');
    const [temples, setTemples] = useState<Temple[]>([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(existingEvent?.pdfUrl ?? '');
    const [pdfName, setPdfName] = useState(existingEvent?.pdfName ?? '');


    const EVENT_TYPES = ['festival', 'ritual', 'procession', 'other'];

    useEffect(() => {
        async function loadTemples() {
            const snap = await getDocs(collection(db, 'temples'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Temple[];
            setTemples(data);
            if (!templeId && data.length > 0) {
                setTempleId(data[0].id);
                setTempleName(data[0].name);
            }
        }
        loadTemples();
    }, []);

    async function handleSave() {
        await addDoc(collection(db, 'events'), {
            title, description,
            date: formatDate(date),
            time: formatTime(time),
            type, templeId, templeName,
            pdfUrl, pdfName,
            createdAt: new Date().toISOString(),
        });
        await updateDoc(doc(db, 'events', existingEvent.id), {
            title, description,
            date: formatDate(date),
            time: formatTime(time),
            type, templeId, templeName,
            pdfUrl, pdfName
        });
        if (!title || !date || !time || !templeId) {
            Alert.alert('Missing fields', 'Please fill in title, date, time and select a temple.');
            return;
        }
        setLoading(true);
        try {
            if (isEditing) {
                await updateDoc(doc(db, 'events', existingEvent.id), {
                    title, description, date, time, type, templeId, templeName,
                    pdfUrl, pdfName
                });

            } else {
                await addDoc(collection(db, 'events'), {
                    title, description, date, time, type, templeId, templeName,
                    pdfUrl, pdfName,
                    createdAt: new Date().toISOString(),
                });
            }
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
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Edit Event' : 'Add Event'}
                </Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Event title *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Kalpathy Ratholsavam"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the event..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.pickerBtnText}>📅 {formatDate(date)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                <Text style={styles.label}>Time *</Text>
                <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.pickerBtnText}>🕐 {formatTime(time)}</Text>
                </TouchableOpacity>

                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="spinner"
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false);
                            if (selectedTime) setTime(selectedTime);
                        }}
                    />
                )}

                <Text style={styles.label}>Event type *</Text>
                <View style={styles.typeRow}>
                    {EVENT_TYPES.map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                            onPress={() => setType(t)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Temple *</Text>
                {temples.map(temple => (
                    <TouchableOpacity
                        key={temple.id}
                        style={[styles.templeOption, templeId === temple.id && styles.templeOptionActive]}
                        onPress={() => { setTempleId(temple.id); setTempleName(temple.name); }}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.templeOptionText, templeId === temple.id && styles.templeOptionTextActive]}>
                            🛕 {temple.name}
                        </Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.label}>Programme PDF link (optional)</Text>
                <TextInput
                    style={styles.input}
                    value={pdfUrl}
                    onChangeText={setPdfUrl}
                    placeholder="Paste Google Drive or PDF link here"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>PDF label (optional)</Text>
                <TextInput
                    style={styles.input}
                    value={pdfName}
                    onChangeText={setPdfName}
                    placeholder="e.g. Festival Programme 2026"
                    placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveBtnText}>
                            {isEditing ? 'Save changes' : 'Add event'}
                        </Text>
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
        gap: 8,
    },
    backBtn: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF',
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
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    typeBtnActive: {
        backgroundColor: '#FEF3E2',
        borderColor: '#B45309',
    },
    typeBtnText: {
        fontSize: 13,
        color: '#6B7280',
    },
    typeBtnTextActive: {
        color: '#92400E',
        fontWeight: '600',
    },
    templeOption: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 14,
        marginBottom: 8,
    },
    templeOptionActive: {
        backgroundColor: '#FEF3E2',
        borderColor: '#B45309',
    },
    templeOptionText: {
        fontSize: 13,
        color: '#6B7280',
    },
    templeOptionTextActive: {
        color: '#92400E',
        fontWeight: '600',
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
    pickerBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 14,
    },
    pickerBtnText: {
        fontSize: 14,
        color: '#1C1917',
    },
});