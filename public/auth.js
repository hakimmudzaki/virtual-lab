// File: auth.js

// Firebase Configuration - GANTI DENGAN KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
    apiKey: "AIzaSyCWNhyj4hSdPSbDsAF7kWYHluZEl6I6iq0",
    authDomain: "pawm-f3491.firebaseapp.com",
    projectId: "pawm-f3491",
    storageBucket: "pawm-f3491.firebasestorage.app",
    messagingSenderId: "271458979986",
    appId: "1:271458979986:web:12280b3bd630fe6b80164b",
    measurementId: "G-K8TWEQ9MEJ"
  };

// Initialize Firebase
let app, auth, googleProvider;

// Fungsi untuk memuat Firebase SDK secara dinamis
async function loadFirebaseSDK() {
    try {
        // Import Firebase modules
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, GoogleAuthProvider, signInWithPopup, signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        
        // Return the auth functions
        return { auth, googleProvider, signInWithPopup, signOut };
    } catch (error) {
        console.error('Error loading Firebase SDK:', error);
        throw error;
    }
}

// Fungsi untuk login dengan Google
async function loginWithGoogle() {
    try {
        const { auth, googleProvider, signInWithPopup } = await loadFirebaseSDK();
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log('Google login successful:', user);
        
        // Kirim data user ke backend untuk membuat/mengupdate user di database
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal autentikasi dengan Google.');
        }
        
        // Simpan token ke localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            username: data.user.username,
            email: data.user.email,
            photoURL: data.user.photoURL
        }));
        
        alert('Login dengan Google berhasil!');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Google login error:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/popup-closed-by-user') {
            alert('Login dibatalkan.');
        } else if (error.code === 'auth/popup-blocked') {
            alert('Popup diblokir oleh browser. Mohon izinkan popup untuk situs ini.');
        } else {
            alert(error.message || 'Terjadi kesalahan saat login dengan Google.');
        }
    }
}

// Event listener untuk tombol Google Login
document.addEventListener('DOMContentLoaded', () => {
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', loginWithGoogle);
    }
});

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// Jika form registrasi ada di halaman ini, tambahkan event listener
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah form reload halaman

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting to register with:', { username, password });

        try {
            console.log('Making fetch request to /api/auth/register');
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            console.log('Response received:', response);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mendaftar.');
            }

            alert('Registrasi berhasil! Silakan login.');
            window.location.href = 'login.html'; // Pindah ke halaman login

        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message);
        }
    });
}

// Jika form login ada di halaman ini, tambahkan event listener
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting to login with:', { username, password });

        try {
            console.log('Making fetch request to /api/auth/login');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            console.log('Response received:', response);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Gagal login.');
            }

            // SIMPAN TOKEN KE BROWSER! Ini adalah langkah kuncinya.
            localStorage.setItem('token', data.token);

            alert('Login berhasil!');
            window.location.href = 'index.html'; // Pindah ke halaman simulasi utama

        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    });
}