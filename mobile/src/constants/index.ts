// Constants for the app
import { Platform } from 'react-native';

// Untuk web development, langsung pakai production API
// Untuk mobile development, pakai IP lokal
const DEV_API_URL = Platform.OS === 'web' 
  ? 'https://virtual-lab-lemon.vercel.app' // Web dev pakai production
  : 'http://10.163.223.101:3000'; // Mobile dev pakai IP lokal

export const API_URL = __DEV__ 
  ? DEV_API_URL
  : 'https://virtual-lab-lemon.vercel.app'; // URL Vercel production

export const COLORS = {
  // Primary colors
  primary: '#4d76fd',
  primaryDark: '#3658c9',
  secondary: '#00d4aa',
  
  // Background colors
  background: '#0a0e27',
  cardBg: 'rgba(20, 25, 50, 0.9)',
  
  // Text colors
  textPrimary: '#eaeaea',
  textSecondary: 'rgba(234, 234, 234, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  
  // Border colors
  border: 'rgba(77, 118, 253, 0.3)',
  
  // Status colors
  success: '#00d4aa',
  error: '#ff6b6b',
  warning: '#ffa726',
  
  // Google button
  googleBg: '#ffffff',
  googleText: '#333333',
};

export const FONTS = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
  heading: 'Rajdhani_700Bold',
};

export const PHYSICS = {
  defaultAngle: 45,
  defaultVelocity: 25,
  defaultGravity: 9.8,
  minAngle: 0,
  maxAngle: 90,
  minVelocity: 1,
  maxVelocity: 100,
};
