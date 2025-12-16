import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants';

export default function SettingsScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || user?.email?.split('@')[0] || '');
  const [isEditing, setIsEditing] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username tidak boleh kosong');
      return;
    }
    if (username === (user?.username || user?.email?.split('@')[0])) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      Alert.alert('Berhasil', 'Username berhasil diubah');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah username');
    } finally {
      setIsSaving(false);
    }
  };

  const playTestSound = () => {
    Alert.alert('Volume', `Volume suara peluncuran: ${Math.round(volume * 100)}%`);
  };

  const adjustVolume = (delta: number) => {
    setVolume(prev => Math.max(0, Math.min(1, Math.round((prev + delta) * 10) / 10)));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.profileItem}>
            <View style={styles.profileInfo}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
              <View style={styles.profileText}>
                <Text style={styles.settingLabel}>Nama Pengguna</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.usernameInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Masukkan username"
                    placeholderTextColor={COLORS.textMuted}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.usernameText}>
                    {user?.username || user?.email?.split('@')[0] || 'User'}
                  </Text>
                )}
              </View>
            </View>
            {isEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setUsername(user?.username || user?.email?.split('@')[0] || '');
                    setIsEditing(false);
                  }}
                >
                  <Ionicons name="close" size={20} color={COLORS.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveUsername}
                  disabled={isSaving}
                >
                  <Ionicons name="checkmark" size={20} color={COLORS.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suara</Text>
          <View style={styles.volumeItem}>
            <View style={styles.volumeHeader}>
              <Ionicons name="volume-high" size={24} color={COLORS.secondary} />
              <Text style={styles.volumeLabel}>Volume Suara Peluncuran</Text>
              <Text style={styles.volumePercent}>{Math.round(volume * 100)}%</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Ionicons name="volume-low" size={20} color={COLORS.textMuted} />
              <View style={styles.sliderWrapper}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${volume * 100}%` }]} />
                </View>
              </View>
              <Ionicons name="volume-high" size={20} color={COLORS.textMuted} />
            </View>
            <View style={styles.volumeButtons}>
              <TouchableOpacity style={styles.volumeBtn} onPress={() => adjustVolume(-0.1)}>
                <Text style={styles.volumeBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.volumeBtn, styles.testBtn]} onPress={playTestSound}>
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.testBtnText}>Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.volumeBtn} onPress={() => adjustVolume(0.1)}>
                <Text style={styles.volumeBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={20} color={COLORS.textMuted} />
          <Text style={styles.infoText}>
            Suara peluncuran (launch.mp3) akan diputar saat menjalankan simulasi gerak parabola.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  section: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginBottom: 16, textTransform: 'uppercase' },
  profileItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  profileText: { marginLeft: 16, flex: 1 },
  settingLabel: { fontSize: 16, color: COLORS.textPrimary },
  usernameText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  usernameInput: { fontSize: 14, color: COLORS.textPrimary, backgroundColor: 'rgba(77, 118, 253, 0.1)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8, borderWidth: 1, borderColor: COLORS.primary },
  editButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { padding: 8 },
  saveButton: { padding: 8 },
  volumeItem: { paddingVertical: 8 },
  volumeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  volumeLabel: { fontSize: 16, color: COLORS.textPrimary, marginLeft: 12, flex: 1 },
  volumePercent: { fontSize: 16, fontWeight: '600', color: COLORS.secondary },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sliderWrapper: { flex: 1, height: 40, justifyContent: 'center', marginHorizontal: 12 },
  sliderTrack: { height: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 3 },
  volumeButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  volumeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  volumeBtnText: { fontSize: 24, color: COLORS.textPrimary },
  testBtn: { flexDirection: 'row', width: 80, borderRadius: 22, backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  testBtnText: { fontSize: 14, color: '#fff', marginLeft: 4 },
  infoSection: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: 'rgba(77, 118, 253, 0.1)', borderRadius: 12 },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
