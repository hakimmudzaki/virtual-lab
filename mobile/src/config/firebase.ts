// Firebase Configuration for Mobile App
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut
} from 'firebase/auth';

// Firebase Configuration - sama dengan web app
const firebaseConfig = {
  apiKey: "AIzaSyCWNhyj4hSdPSbDsAF7kWYHluZEl6I6iq0",
  authDomain: "pawm-f3491.firebaseapp.com",
  projectId: "pawm-f3491",
  storageBucket: "pawm-f3491.firebasestorage.app",
  messagingSenderId: "271458979986",
  appId: "1:271458979986:web:12280b3bd630fe6b80164b",
  measurementId: "G-K8TWEQ9MEJ"
};

// Initialize Firebase (cegah multiple initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithCredential, firebaseSignOut };
export default app;
