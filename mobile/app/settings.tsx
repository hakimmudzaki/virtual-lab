import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { COLORS, API_URL } from '../src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || user?.email?.split('@')[0] || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Check if user logged in via Google (no password change available)
  // User Google TIDAK bisa ganti password di aplikasi ini
  const isGoogleUser = user?.authProvider === 'google';
  
  // Debug log
  console.log('User authProvider:', user?.authProvider, 'isGoogleUser:', isGoogleUser);

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username tidak boleh kosong');
      return;
    }
    if (username === (user?.username || user?.email?.split('@')[0])) {
      setIsEditingUsername(false);
      return;
    }
    setIsSavingUsername(true);
    try {
      Alert.alert('Berhasil', 'Username berhasil diubah');
      setIsEditingUsername(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah username');
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password baru minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi password tidak cocok');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      Alert.alert('Berhasil', 'Password berhasil diubah');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mengubah password');
    } finally {
      setIsChangingPassword(false);
    }
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
                {isEditingUsername ? (
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
            {isEditingUsername ? (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setUsername(user?.username || user?.email?.split('@')[0] || '');
                    setIsEditingUsername(false);
                  }}
                >
                  <Ionicons name="close" size={20} color={COLORS.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveUsername}
                  disabled={isSavingUsername}
                >
                  <Ionicons name="checkmark" size={20} color={COLORS.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingUsername(true)}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Change Password Section */}
        {!isGoogleUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ganti Password</Text>
            
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password Lama</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Masukkan password lama"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password Baru</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Konfirmasi Password Baru</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Ulangi password baru"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Change Password Button */}
            <TouchableOpacity
              style={[styles.changePasswordButton, isChangingPassword && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={20} color="#fff" />
                  <Text style={styles.changePasswordText}>Ubah Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Google User Info */}
        {isGoogleUser && (
          <View style={styles.infoSection}>
            <Ionicons name="logo-google" size={20} color={COLORS.textMuted} />
            <Text style={styles.infoText}>
              Anda login menggunakan Google. Pengaturan password tidak tersedia untuk akun Google.
            </Text>
          </View>
        )}
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
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  passwordInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary, paddingHorizontal: 16, paddingVertical: 12 },
  eyeButton: { padding: 12 },
  changePasswordButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, marginTop: 8, gap: 8 },
  buttonDisabled: { opacity: 0.6 },
  changePasswordText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  infoSection: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: 'rgba(77, 118, 253, 0.1)', borderRadius: 12 },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
