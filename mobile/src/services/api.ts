import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';

// Types
export interface User {
  id: string;
  username: string;
  email?: string;
  photoURL?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SimulationData {
  velocity: number;
  angle: number;
  height: number;
  distance: number;
}

export interface SimulationHistory {
  _id: string;
  velocity: number;
  angle: number;
  distance: number;
  height: number;
  timestamp: string;
}

// Helper function to get auth headers
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API
export const authAPI = {
  // Register
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mendaftar.');
    }
    
    // Save token
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Login
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal login.');
    }
    
    // Save token
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Google Login
  googleLogin: async (firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal autentikasi dengan Google.');
    }
    
    // Save token
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if logged in
  isLoggedIn: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};

// Simulation API
export const simulationAPI = {
  // Save simulation
  save: async (data: SimulationData): Promise<any> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/simulation`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal menyimpan simulasi.');
    }
    
    return result;
  },

  // Get history
  getHistory: async (): Promise<SimulationHistory[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/history`, {
      method: 'GET',
      headers,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil riwayat.');
    }
    
    return data;
  },

  // Delete history item
  deleteHistory: async (id: string): Promise<any> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/history/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus riwayat.');
    }
    
    return data;
  },

  // Delete all history
  deleteAllHistory: async (): Promise<any> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/history`, {
      method: 'DELETE',
      headers,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus semua riwayat.');
    }
    
    return data;
  },
};

// Score API
export const scoreAPI = {
  // Get best score
  getBestScore: async (): Promise<number> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/scores/best`, {
      method: 'GET',
      headers,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil skor.');
    }
    
    return data.bestScore || 0;
  },

  // Save score
  saveScore: async (score: number): Promise<any> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ score }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan skor.');
    }
    
    return data;
  },
};

// Chatbot API
export const chatbotAPI = {
  ask: async (message: string): Promise<string> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/chatbot`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal menghubungi chatbot.');
    }
    
    return data.response;
  },
};
