import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import Svg, { Circle, Path, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PHYSICS } from '../../src/constants';
import { simulationAPI, SimulationHistory } from '../../src/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 40;
const CANVAS_HEIGHT = 250;
const PADDING = 30;

export default function SimulationScreen() {
  const [angle, setAngle] = useState(PHYSICS.defaultAngle.toString());
  const [velocity, setVelocity] = useState(PHYSICS.defaultVelocity.toString());
  const [gravity, setGravity] = useState(PHYSICS.defaultGravity.toString());
  
  const [maxDistance, setMaxDistance] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [timeOfFlight, setTimeOfFlight] = useState(0);
  
  const [trajectoryPath, setTrajectoryPath] = useState('');
  const [projectilePos, setProjectilePos] = useState({ x: PADDING, y: CANVAS_HEIGHT - PADDING });
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [history, setHistory] = useState<SimulationHistory[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    loadHistory();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const data = await simulationAPI.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const calculateTrajectory = () => {
    const v0 = parseFloat(velocity) || PHYSICS.defaultVelocity;
    const angleDeg = parseFloat(angle) || PHYSICS.defaultAngle;
    const g = parseFloat(gravity) || PHYSICS.defaultGravity;
    
    const angleRad = (angleDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(angleRad);
    const v0y = v0 * Math.sin(angleRad);
    
    // Calculate physics
    const tFlight = (2 * v0y) / g;
    const range = v0x * tFlight;
    const hMax = (v0y * v0y) / (2 * g);
    
    setMaxDistance(Math.round(range * 100) / 100);
    setMaxHeight(Math.round(hMax * 100) / 100);
    setTimeOfFlight(Math.round(tFlight * 100) / 100);
    
    return { v0, angleDeg, angleRad, v0x, v0y, g, tFlight, range, hMax };
  };

  const getScale = (range: number, hMax: number) => {
    const viewWidth = Math.max(range * 1.2, 10);
    const viewHeight = Math.max(hMax * 1.5, 10);
    
    const scaleX = (CANVAS_WIDTH - PADDING * 2) / viewWidth;
    const scaleY = (CANVAS_HEIGHT - PADDING * 2) / viewHeight;
    
    return { scaleX, scaleY, viewWidth, viewHeight };
  };

  const toCanvasCoords = (x: number, y: number, scaleX: number, scaleY: number) => {
    return {
      x: PADDING + x * scaleX,
      y: CANVAS_HEIGHT - PADDING - y * scaleY,
    };
  };

  const handleLaunch = async () => {
    if (isAnimating) return;
    
    const physics = calculateTrajectory();
    const { v0x, v0y, g, tFlight, range, hMax } = physics;
    const { scaleX, scaleY } = getScale(range, hMax);
    
    // Generate trajectory path
    const points: string[] = [];
    const numPoints = 100;
    
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * tFlight;
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      const canvasCoords = toCanvasCoords(x, Math.max(0, y), scaleX, scaleY);
      
      if (i === 0) {
        points.push(`M ${canvasCoords.x} ${canvasCoords.y}`);
      } else {
        points.push(`L ${canvasCoords.x} ${canvasCoords.y}`);
      }
    }
    
    setTrajectoryPath(points.join(' '));
    
    // Animate projectile
    setIsAnimating(true);
    const startTime = Date.now();
    const animDuration = Math.min(tFlight * 500, 3000); // Max 3 seconds animation
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const t = progress * tFlight;
      
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      const canvasCoords = toCanvasCoords(x, Math.max(0, y), scaleX, scaleY);
      
      setProjectilePos(canvasCoords);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        saveSimulation(physics);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const saveSimulation = async (physics: any) => {
    try {
      await simulationAPI.save({
        velocity: parseFloat(velocity),
        angle: parseFloat(angle),
        height: physics.hMax,
        distance: physics.range,
      });
      loadHistory();
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    Alert.alert(
      'Hapus Riwayat',
      'Yakin ingin menghapus riwayat ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await simulationAPI.deleteHistory(id);
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus riwayat.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAllHistory = () => {
    Alert.alert(
      'Hapus Semua Riwayat',
      'Yakin ingin menghapus semua riwayat?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: async () => {
            try {
              await simulationAPI.deleteAllHistory();
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus riwayat.');
            }
          },
        },
      ]
    );
  };

  const renderGridLines = () => {
    const lines = [];
    const numLines = 5;
    
    // Horizontal lines
    for (let i = 0; i <= numLines; i++) {
      const y = PADDING + ((CANVAS_HEIGHT - PADDING * 2) / numLines) * i;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={PADDING}
          y1={y}
          x2={CANVAS_WIDTH - PADDING}
          y2={y}
          stroke={COLORS.border}
          strokeWidth={0.5}
        />
      );
    }
    
    // Vertical lines
    for (let i = 0; i <= numLines; i++) {
      const x = PADDING + ((CANVAS_WIDTH - PADDING * 2) / numLines) * i;
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={PADDING}
          x2={x}
          y2={CANVAS_HEIGHT - PADDING}
          stroke={COLORS.border}
          strokeWidth={0.5}
        />
      );
    }
    
    return lines;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pengaturan</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sudut (°):</Text>
            <TextInput
              style={styles.input}
              value={angle}
              onChangeText={setAngle}
              keyboardType="numeric"
              placeholder="45"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kecepatan (m/s):</Text>
            <TextInput
              style={styles.input}
              value={velocity}
              onChangeText={setVelocity}
              keyboardType="numeric"
              placeholder="25"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gravitasi (m/s²):</Text>
          <TextInput
            style={styles.input}
            value={gravity}
            onChangeText={setGravity}
            keyboardType="numeric"
            placeholder="9.8"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.launchButton, isAnimating && styles.buttonDisabled]}
          onPress={handleLaunch}
          disabled={isAnimating}
        >
          <Ionicons name="rocket" size={24} color="#fff" />
          <Text style={styles.launchButtonText}>
            {isAnimating ? 'Sedang Animasi...' : 'Luncurkan!'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simulation Canvas */}
      <View style={styles.canvasCard}>
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={styles.canvas}>
          {/* Background */}
          <G>
            {renderGridLines()}
          </G>
          
          {/* Axes */}
          <Line
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={CANVAS_HEIGHT - PADDING}
            stroke={COLORS.textSecondary}
            strokeWidth={2}
          />
          <Line
            x1={PADDING}
            y1={CANVAS_HEIGHT - PADDING}
            x2={CANVAS_WIDTH - PADDING}
            y2={CANVAS_HEIGHT - PADDING}
            stroke={COLORS.textSecondary}
            strokeWidth={2}
          />
          
          {/* Trajectory Path */}
          {trajectoryPath && (
            <Path
              d={trajectoryPath}
              fill="none"
              stroke={COLORS.secondary}
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          )}
          
          {/* Projectile */}
          <Circle
            cx={projectilePos.x}
            cy={projectilePos.y}
            r={8}
            fill={COLORS.primary}
          />
          
          {/* Labels */}
          <SvgText
            x={CANVAS_WIDTH / 2}
            y={CANVAS_HEIGHT - 5}
            fill={COLORS.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            Jarak (m)
          </SvgText>
          <SvgText
            x={10}
            y={CANVAS_HEIGHT / 2}
            fill={COLORS.textMuted}
            fontSize={10}
            textAnchor="middle"
            rotation="-90"
            origin={`10, ${CANVAS_HEIGHT / 2}`}
          >
            Tinggi (m)
          </SvgText>
        </Svg>
      </View>

      {/* Results Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hasil Kalkulasi</Text>
        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Jarak Maksimal</Text>
            <Text style={styles.resultValue}>{maxDistance} m</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Tinggi Maksimal</Text>
            <Text style={styles.resultValue}>{maxHeight} m</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Waktu di Udara</Text>
            <Text style={styles.resultValue}>{timeOfFlight} s</Text>
          </View>
        </View>
      </View>

      {/* History Card */}
      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.cardTitle}>Riwayat Simulasi</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleDeleteAllHistory}>
              <Text style={styles.deleteAllText}>Hapus Semua</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {history.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada riwayat simulasi.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyText}>
                    v₀={item.velocity} m/s, θ={item.angle}°
                  </Text>
                  <Text style={styles.historySubtext}>
                    Jarak: {item.distance?.toFixed(1)}m | Tinggi: {item.height?.toFixed(1)}m
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteHistory(item._id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
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
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  launchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  launchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  canvasCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  resultValue: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '700',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteAllText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  historySubtext: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
