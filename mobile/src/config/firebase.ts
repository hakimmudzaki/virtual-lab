// Firebase Configuration for Mobile App
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  getReactNativePersistence,
  browserLocalPersistence,
  initializeAuth
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase config - menggunakan Constants.expoConfig.extra atau fallback ke hardcoded values
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    apiKey: extra?.firebaseApiKey || "AIzaSyCWNhyj4hSdPSbDsAF7kWYHluZEl6I6iq0",
    authDomain: extra?.firebaseAuthDomain || "pawm-f3491.firebaseapp.com",
    projectId: extra?.firebaseProjectId || "pawm-f3491",
    storageBucket: extra?.firebaseStorageBucket || "pawm-f3491.firebasestorage.app",
    messagingSenderId: extra?.firebaseMessagingSenderId || "271458979986",
    appId: extra?.firebaseAppId || "1:271458979986:web:12280b3bd630fe6b80164b",
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate config
if (!firebaseConfig.apiKey) {
  console.error('Firebase API Key is missing!');
}

// Initialize Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  // App already initialized
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase initialization error:', error);
  }
}

// Initialize Auth dengan persistence yang berbeda untuk Web dan Mobile
let auth: any;

try {
  if (Platform.OS === 'web') {
    // Untuk Web: gunakan browserLocalPersistence
    auth = getAuth(app);
    auth.setPersistence(browserLocalPersistence);
  } else {
    // Untuk Mobile (iOS/Android): gunakan AsyncStorage
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error: any) {
  // Auth already initialized
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    console.error('Auth initialization error:', error);
    auth = getAuth(app);
  }
}

export { app, auth };
