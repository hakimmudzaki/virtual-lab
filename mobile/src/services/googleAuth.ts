// Google Authentication Service for Expo with Native Google Sign-In
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useEffect, useState, useCallback } from 'react';

// Firebase Google OAuth Client IDs
// Web Client ID dari Firebase Console (diperlukan untuk Firebase Auth)
const WEB_CLIENT_ID = '271458979986-1b7iig4grop8tfu5tdg792dk01avs43v.apps.googleusercontent.com';

// Configure Google Sign-In saat app dimulai
let isConfigured = false;

const configureGoogleSignIn = () => {
  if (isConfigured) return;
  
  try {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true, // Untuk mendapatkan refresh token
      scopes: ['profile', 'email'],
    });
    isConfigured = true;
    console.log('Google Sign-In configured successfully');
  } catch (error) {
    console.error('Failed to configure Google Sign-In:', error);
  }
};

// Initialize on module load
configureGoogleSignIn();

export const useGoogleAuth = () => {
  const [isReady, setIsReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
    setIsReady(true);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{
    user: any;
    idToken: string;
  } | null> => {
    if (isSigningIn) {
      console.log('Sign-in already in progress');
      return null;
    }

    setIsSigningIn(true);

    try {
      console.log('Starting Google Sign-In...');
      
      // Check if Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Attempt sign in
      const response = await GoogleSignin.signIn();
      console.log('Google Sign-In response type:', response.type);
      
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        
        if (!idToken) {
          throw new Error('Tidak mendapat token dari Google. Coba lagi.');
        }
        
        console.log('Got idToken, signing in to Firebase...');
        
        // Create Firebase credential
        const credential = GoogleAuthProvider.credential(idToken);
        
        // Sign in to Firebase
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        
        console.log('Firebase sign-in successful:', user.email);
        
        return {
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          idToken: idToken,
        };
      } else {
        // User cancelled
        console.log('Google Sign-In cancelled by user');
        return null;
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Handle specific error codes
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the sign-in');
            return null;
            
          case statusCodes.IN_PROGRESS:
            console.log('Sign-in already in progress');
            return null;
            
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw new Error(
              'Google Play Services tidak tersedia. ' +
              'Pastikan perangkat Anda memiliki Google Play Services terbaru.'
            );
            
          default:
            throw new Error(
              error.message || 'Gagal login dengan Google. Silakan coba lagi.'
            );
        }
      }
      
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }, [isSigningIn]);

  const signOutFromGoogle = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      console.log('Signed out from Google');
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser;
    } catch (error) {
      return null;
    }
  }, []);

  return {
    signInWithGoogle,
    signOutFromGoogle,
    getCurrentUser,
    isReady,
    isSigningIn,
  };
};

export default useGoogleAuth;
