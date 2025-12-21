// Google Authentication Service for Expo with Firebase
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Platform } from 'react-native';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Firebase Google OAuth Client IDs
// Untuk standalone APK, kamu perlu membuat Android OAuth Client ID di Google Cloud Console
// dengan package name: com.virtuallab.fisika dan SHA-1 fingerprint dari EAS

// Web Client ID dari Firebase Console (untuk Expo Go development)
const WEB_CLIENT_ID = '271458979986-1b7iig4grop8tfu5tdg792dk01avs43v.apps.googleusercontent.com';

// Android Client ID - PERLU DIBUAT di Google Cloud Console
// 1. Buka https://console.cloud.google.com/apis/credentials
// 2. Create OAuth 2.0 Client ID -> Android
// 3. Package name: com.virtuallab.fisika
// 4. SHA-1 fingerprint: dapatkan dari EAS dengan: eas credentials
const ANDROID_CLIENT_ID = '271458979986-o1a5la2sspknav8acriqfm690lr99kqk.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    // Untuk standalone Android APK, gunakan Android Client ID
    androidClientId: ANDROID_CLIENT_ID || WEB_CLIENT_ID,
    iosClientId: WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    // Gunakan useProxy untuk development di Expo Go
    // Untuk standalone build, ini akan diabaikan
  });

  const signInWithGoogle = async (): Promise<{
    user: any;
    idToken: string;
  } | null> => {
    try {
      // Check if Android Client ID is configured for standalone builds
      if (Platform.OS === 'android' && !ANDROID_CLIENT_ID && !__DEV__) {
        throw new Error(
          'Google Sign-In belum dikonfigurasi untuk aplikasi standalone. ' +
          'Silakan hubungi developer untuk mengaktifkan fitur ini.'
        );
      }

      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        
        if (!id_token) {
          throw new Error('Tidak mendapat token dari Google. Coba lagi.');
        }
        
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
      } else if (result.type === 'cancel') {
        return null;
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Gagal login dengan Google');
      }
      
      return null;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Handle specific errors
      if (error.message?.includes('invalid_request') || error.message?.includes('Custom scheme')) {
        throw new Error(
          'Login Google tidak tersedia untuk versi APK ini. ' +
          'Gunakan login dengan username dan password.'
        );
      }
      
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
