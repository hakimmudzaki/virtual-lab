import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../src/constants';

const materiContent = [
  {
    title: '1. Pengertian Gerak Parabola',
    content: `Gerak parabola adalah gerak gabungan antara gerak lurus beraturan (GLB) pada arah horizontal dan gerak lurus berubah beraturan (GLBB) pada arah vertikal.

Gerak ini terjadi ketika sebuah benda dilempar atau ditembakkan dengan sudut tertentu terhadap bidang horizontal, kemudian bergerak mengikuti lintasan berbentuk parabola akibat pengaruh gravitasi bumi.`,
  },
  {
    title: '2. Komponen Kecepatan',
    content: `Kecepatan awal (v₀) dapat diuraikan menjadi dua komponen:

• Komponen horizontal (v₀ₓ):
  v₀ₓ = v₀ × cos(θ)
  
• Komponen vertikal (v₀ᵧ):
  v₀ᵧ = v₀ × sin(θ)

Dimana θ adalah sudut elevasi terhadap bidang horizontal.`,
  },
  {
    title: '3. Persamaan Gerak',
    content: `Posisi benda pada setiap saat t:

• Posisi horizontal:
  x = v₀ₓ × t = v₀ × cos(θ) × t

• Posisi vertikal:
  y = v₀ᵧ × t - ½ × g × t²
  y = v₀ × sin(θ) × t - ½ × g × t²

Kecepatan pada setiap saat t:
• vₓ = v₀ₓ = v₀ × cos(θ) (konstan)
• vᵧ = v₀ᵧ - g × t = v₀ × sin(θ) - g × t`,
  },
  {
    title: '4. Waktu Tempuh',
    content: `Waktu untuk mencapai titik tertinggi (t_puncak):
t_puncak = v₀ᵧ / g = v₀ × sin(θ) / g

Waktu total di udara (t_total):
t_total = 2 × t_puncak = 2 × v₀ × sin(θ) / g

Catatan: Ini berlaku untuk peluncuran dari dan mendarat pada ketinggian yang sama.`,
  },
  {
    title: '5. Tinggi Maksimum',
    content: `Tinggi maksimum dicapai saat komponen kecepatan vertikal = 0

H_maks = v₀ᵧ² / (2 × g)
H_maks = v₀² × sin²(θ) / (2 × g)

Pada titik tertinggi, benda hanya memiliki kecepatan horizontal (vₓ).`,
  },
  {
    title: '6. Jangkauan Horizontal',
    content: `Jangkauan horizontal (R) adalah jarak horizontal yang ditempuh benda:

R = v₀ₓ × t_total
R = v₀² × sin(2θ) / g

Jangkauan maksimum tercapai pada θ = 45°

Dua sudut yang menghasilkan jangkauan sama:
θ₁ + θ₂ = 90°
Contoh: 30° dan 60° memberikan jangkauan yang sama.`,
  },
  {
    title: '7. Contoh Aplikasi',
    content: `Gerak parabola dapat ditemukan dalam berbagai situasi:

• Olahraga: lemparan bola basket, tendangan bola sepak, pukulan golf
• Militer: peluru mortir, rudal balistik
• Air mancur: aliran air yang membentuk lengkungan
• Aksi stunt: lompatan motor atau mobil
• Permainan: angry birds, lemparan batu`,
  },
];

export default function MateriScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Materi Gerak Parabola</Text>
        <Text style={styles.headerSubtitle}>
          Pelajari konsep dasar dan rumus-rumus penting gerak parabola
        </Text>
      </View>

      {materiContent.map((section, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Tips Belajar</Text>
        <Text style={styles.tipsContent}>
          • Gunakan simulasi untuk memvisualisasikan konsep{'\n'}
          • Coba berbagai kombinasi sudut dan kecepatan{'\n'}
          • Perhatikan hubungan antara parameter dan hasil{'\n'}
          • Kerjakan kuis untuk menguji pemahaman Anda
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  tipsCard: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  tipsContent: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
});
