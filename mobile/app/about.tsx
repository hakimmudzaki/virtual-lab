import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants';

export default function AboutScreen() {
  const openLink = (url: string) => { Linking.openURL(url); };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.appCard}>
          <View style={styles.appIcon}><Image source={require('../assets/icon.png')} style={styles.appIconImage} /></View>
          <Text style={styles.appName}>Virtual Physics Lab</Text>
          <Text style={styles.appVersion}>Versi 1.0.0</Text>
          <Text style={styles.appDescription}>Aplikasi pembelajaran fisika interaktif dengan simulasi virtual untuk materi gerak parabola</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          <View style={styles.featureItem}>
            <Ionicons name="flask" size={24} color={COLORS.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Simulasi Interaktif</Text>
              <Text style={styles.featureDescription}>Eksperimen gerak parabola dengan parameter yang dapat diubah</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="book" size={24} color={COLORS.secondary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Materi Lengkap</Text>
              <Text style={styles.featureDescription}>Teori gerak parabola dengan penjelasan mudah dipahami</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="help-circle" size={24} color={COLORS.warning} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Kuis dan Evaluasi</Text>
              <Text style={styles.featureDescription}>Latihan soal untuk menguji pemahaman materi</Text>
            </View>
          </View>
          <View style={[styles.featureItem, { borderBottomWidth: 0 }]}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.primary} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Physics Tutor</Text>
              <Text style={styles.featureDescription}>Asisten virtual khusus gerak parabola powered by Gemini AI</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengembang</Text>
          <View style={styles.developerItem}><Ionicons name="person" size={20} color={COLORS.textMuted} /><Text style={styles.developerText}>18223024 & 18223086</Text></View>
          <View style={styles.developerItem}><Ionicons name="school" size={20} color={COLORS.textMuted} /><Text style={styles.developerText}>Institut Teknologi Bandung</Text></View>
          <View style={styles.developerItem}><Ionicons name="calendar" size={20} color={COLORS.textMuted} /><Text style={styles.developerText}>2026 Virtual Lab</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teknologi</Text>
          <View style={styles.techGrid}>
            <View style={styles.techItem}><Text style={styles.techIcon}></Text><Text style={styles.techName}>React Native</Text></View>
            <View style={styles.techItem}><Text style={styles.techIcon}></Text><Text style={styles.techName}>Expo</Text></View>
            <View style={styles.techItem}><Text style={styles.techIcon}></Text><Text style={styles.techName}>Firebase</Text></View>
            <View style={styles.techItem}><Text style={styles.techIcon}></Text><Text style={styles.techName}>Gemini API</Text></View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tautan</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://mobile-lilac-mu.vercel.app/')}>
            <Ionicons name="globe" size={20} color={COLORS.primary} />
            <Text style={styles.linkText}>Website</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkItem, { borderBottomWidth: 0 }]} onPress={() => openLink('https://github.com/hakimmudzaki/virtual-lab')}>
            <Ionicons name="logo-github" size={20} color={COLORS.textPrimary} />
            <Text style={styles.linkText}>Source Code</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  appCard: { backgroundColor: COLORS.cardBg, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  appIcon: { width: 80, height: 80, borderRadius: 20, backgroundColor: 'rgba(77, 118, 253, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  appIconImage: { width: 70, height: 70, borderRadius: 14 },
  appName: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  appVersion: { fontSize: 14, color: COLORS.primary, marginBottom: 12 },
  appDescription: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  section: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginBottom: 16, textTransform: 'uppercase' },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  featureText: { marginLeft: 16, flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
  featureDescription: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  developerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  developerText: { marginLeft: 12, fontSize: 14, color: COLORS.textSecondary },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  techItem: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(77, 118, 253, 0.1)', borderRadius: 12, padding: 12, marginBottom: 8 },
  techIcon: { fontSize: 20, marginRight: 8 },
  techName: { fontSize: 12, color: COLORS.textPrimary },
  linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  linkText: { flex: 1, marginLeft: 12, fontSize: 14, color: COLORS.textPrimary },
});
