import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants';

export default function StatisticsScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Ringkasan Pembelajaran</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="book" size={32} color={COLORS.primary} />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Materi Dipelajari</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flask" size={32} color={COLORS.secondary} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Simulasi Dijalankan</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Kuis Selesai</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={32} color={COLORS.warning} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Rata-rata Skor</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: 'rgba(77, 118, 253, 0.2)' }]}>
              <Ionicons name="flask" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Menjalankan simulasi Gerak Parabola</Text>
              <Text style={styles.activityTime}>2 jam yang lalu</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: 'rgba(0, 212, 170, 0.2)' }]}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Menyelesaikan Kuis Gerak Parabola</Text>
              <Text style={styles.activityTime}>Kemarin</Text>
            </View>
          </View>
          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.activityIcon, { backgroundColor: 'rgba(255, 167, 38, 0.2)' }]}>
              <Ionicons name="chatbubbles" size={20} color={COLORS.warning} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Bertanya ke AI Physics Tutor</Text>
              <Text style={styles.activityTime}>2 hari yang lalu</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Riwayat Nilai Kuis</Text>
          <View style={styles.quizItem}>
            <View style={styles.quizInfo}>
              <Text style={styles.quizName}>Kuis Gerak Parabola #1</Text>
              <Text style={styles.quizDate}>15 Des 2025</Text>
            </View>
            <View style={[styles.quizScore, styles.scoreHigh]}>
              <Text style={styles.quizScoreText}>90%</Text>
            </View>
          </View>
          <View style={styles.quizItem}>
            <View style={styles.quizInfo}>
              <Text style={styles.quizName}>Kuis Gerak Parabola #2</Text>
              <Text style={styles.quizDate}>14 Des 2025</Text>
            </View>
            <View style={[styles.quizScore, styles.scoreMedium]}>
              <Text style={styles.quizScoreText}>75%</Text>
            </View>
          </View>
          <View style={[styles.quizItem, { borderBottomWidth: 0 }]}>
            <View style={styles.quizInfo}>
              <Text style={styles.quizName}>Kuis Gerak Parabola #3</Text>
              <Text style={styles.quizDate}>12 Des 2025</Text>
            </View>
            <View style={[styles.quizScore, styles.scoreHigh]}>
              <Text style={styles.quizScoreText}>85%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 16, paddingTop: 8 },
  overviewCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  overviewTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 20, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: { width: '48%', alignItems: 'center', paddingVertical: 16, marginBottom: 12, backgroundColor: 'rgba(77, 118, 253, 0.1)', borderRadius: 12 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  sectionCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityContent: { flex: 1 },
  activityText: { fontSize: 14, color: COLORS.textPrimary },
  activityTime: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  quizItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  quizInfo: { flex: 1 },
  quizName: { fontSize: 14, color: COLORS.textPrimary },
  quizDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  quizScore: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  scoreHigh: { backgroundColor: 'rgba(0, 212, 170, 0.2)' },
  scoreMedium: { backgroundColor: 'rgba(255, 167, 38, 0.2)' },
  quizScoreText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
});
