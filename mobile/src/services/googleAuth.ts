// Google Authentication Service for Expo with Firebase
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { makeRedirectUri } from 'expo-auth-session';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Firebase Google OAuth Client IDs
// Ambil dari Firebase Console → Authentication → Sign-in method → Google → Web client ID
// Format: [project-number]-[random].apps.googleusercontent.com
const EXPO_CLIENT_ID = '271458979986-1b7iig4grop8tfu5tdg792dk01avs43v.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const redirectUri = makeRedirectUri({
    scheme: 'virtuallabmobile',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    webClientId: EXPO_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  const signInWithGoogle = async (): Promise<{
    user: any;
    idToken: string;
  } | null> => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        
        // Create Firebase credential
        const credential = GoogleAuthProvider.credential(id_token);
        
        // Sign in to Firebase
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        
        return {
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          idToken: id_token,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  return {
    request,
    response,
    promptAsync,
    signInWithGoogle,
    isReady: !!request,
  };
};

export default useGoogleAuth;
