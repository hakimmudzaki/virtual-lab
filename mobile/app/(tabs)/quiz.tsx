import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../../src/constants';
import { scoreAPI } from '../../src/services/api';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Sebuah bola ditendang dengan kecepatan awal 25 m/s dan sudut elevasi 37°. Berapakah waktu yang dibutuhkan bola untuk mencapai titik tertinggi? (g = 10 m/s², sin(37°)=0.6)',
    options: ['1.5 detik', '3 detik', '2 detik', '2.5 detik'],
    correctIndex: 0,
  },
  {
    id: 2,
    question: 'Sebuah peluru ditembakkan dengan kecepatan awal 100 m/s pada sudut elevasi 30°. Berapakah ketinggian maksimum yang dicapai peluru? (g = 10 m/s²)',
    options: ['250 m', '50 m', '125 m', '500 m'],
    correctIndex: 2,
  },
  {
    id: 3,
    question: 'Sebuah paket dijatuhkan dari helikopter yang terbang horizontal dengan kecepatan 40 m/s pada ketinggian 180 m. Berapa jarak horizontal yang ditempuh paket sebelum menyentuh tanah? (g = 10 m/s²)',
    options: ['240 m', '180 m', '720 m', '120 m'],
    correctIndex: 0,
  },
  {
    id: 4,
    question: 'Sebuah proyektil diluncurkan dengan kecepatan awal v₀. Pada sudut elevasi berapakah jangkauan horizontalnya sama dengan tiga kali ketinggian maksimumnya?',
    options: ['45°', '53°', '60°', '37°'],
    correctIndex: 1,
  },
  {
    id: 5,
    question: 'Pada titik tertinggi lintasan gerak parabola, komponen kecepatan apa yang bernilai nol?',
    options: ['Horizontal', 'Vertikal', 'Keduanya', 'Tidak ada'],
    correctIndex: 1,
  },
  {
    id: 6,
    question: 'Dua proyektil diluncurkan dengan kecepatan awal yang sama. Proyektil A diluncurkan pada sudut 30° dan proyektil B pada sudut 60°. Pernyataan manakah yang benar?',
    options: [
      'A memiliki jangkauan lebih jauh',
      'B memiliki jangkauan lebih jauh',
      'Jangkauan keduanya sama',
      'Tidak bisa ditentukan',
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    question: 'Sudut elevasi berapakah yang menghasilkan jangkauan horizontal maksimum?',
    options: ['30°', '45°', '60°', '90°'],
    correctIndex: 1,
  },
  {
    id: 8,
    question: 'Sebuah bola ditendang dari tanah dan kembali ke tanah dalam waktu 4 detik. Berapakah ketinggian maksimum yang dicapainya? (g = 10 m/s²)',
    options: ['40 m', '10 m', '20 m', '80 m'],
    correctIndex: 2,
  },
  {
    id: 9,
    question: 'Percepatan benda pada gerak parabola di semua titik lintasannya adalah...',
    options: [
      'Berubah-ubah',
      'Sama dengan kecepatan awal',
      'Selalu mengarah ke bawah dengan besar g',
      'Nol di titik tertinggi',
    ],
    correctIndex: 2,
  },
  {
    id: 10,
    question: 'Sudut antara vektor kecepatan dan vektor percepatan pada titik tertinggi lintasan gerak parabola adalah...',
    options: ['0°', '45°', '90°', '180°'],
    correctIndex: 2,
  },
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    loadBestScore();
  }, []);

  const loadBestScore = async () => {
    try {
      const best = await scoreAPI.getBestScore();
      setBestScore(best);
    } catch (error) {
      console.error('Error loading best score:', error);
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) {
        correct++;
      }
    });

    const finalScore = correct * 10; // 10 points per question
    setScore(finalScore);
    setShowResult(true);

    // Save score to server
    try {
      const result = await scoreAPI.saveScore(finalScore);
      if (result.isNewRecord) {
        setBestScore(finalScore);
        Alert.alert('🎉 Rekor Baru!', `Selamat! Anda mencapai skor tertinggi baru: ${finalScore}`);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setScore(0);
  };

  if (showResult) {
    const correct = questions.filter(
      (q, index) => selectedAnswers[index] === q.correctIndex
    ).length;

    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultTitle}>Kuis Selesai!</Text>
          
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.scoreLabel}>Skor Anda</Text>
          
          <Text style={styles.detailText}>
            Anda menjawab {correct} dari {questions.length} soal dengan benar.
          </Text>
          
          <Text style={styles.bestScoreText}>
            Skor Terbaik Anda: {bestScore}
          </Text>

          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Ulangi Kuis</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Soal {currentQuestion + 1} dari {questions.length}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Soal {question.id}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.optionSelected,
              ]}
              onPress={() => handleSelectAnswer(index)}
            >
              <View style={[
                styles.optionRadio,
                selectedAnswer === index && styles.optionRadioSelected,
              ]}>
                {selectedAnswer === index && <View style={styles.optionRadioInner} />}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navButtonText}>Sebelumnya</Text>
        </TouchableOpacity>

        {currentQuestion === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.navButtonText}>Selesai</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, selectedAnswer === null && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.navButtonText}>Berikutnya</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  questionNumber: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(77, 118, 253, 0.1)',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: COLORS.primary,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 140,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: COLORS.cardBg,
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Result styles
  resultCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  bestScoreText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
