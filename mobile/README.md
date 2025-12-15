# Virtual Lab Mobile - React Native / Expo

Aplikasi mobile Virtual Lab Fisika untuk platform Android dan iOS menggunakan React Native dan Expo.

## 📁 Struktur Folder

```
mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Splash/redirect screen
│   ├── login.tsx           # Login screen
│   ├── register.tsx        # Register screen
│   └── (tabs)/             # Tab navigation
│       ├── _layout.tsx     # Tab layout
│       ├── simulation.tsx  # Simulasi gerak parabola
│       ├── materi.tsx      # Materi pembelajaran
│       ├── quiz.tsx        # Kuis
│       └── profile.tsx     # Profil user
├── src/
│   ├── constants/          # Konstanta dan konfigurasi
│   ├── context/            # React Context (Auth)
│   └── services/           # API services
├── assets/                 # Gambar dan assets
├── app.json               # Expo configuration
├── eas.json               # EAS Build configuration
└── package.json           # Dependencies
```

## 🚀 Setup & Development

### Prerequisites

1. **Node.js** (v18 atau lebih baru)
2. **npm** atau **yarn**
3. **Expo CLI**: `npm install -g expo-cli`
4. **EAS CLI** (untuk build): `npm install -g eas-cli`
5. **Expo Go App** di smartphone (untuk testing)

### Instalasi

```bash
# Masuk ke folder mobile
cd mobile

# Install dependencies
npm install
```

### Konfigurasi API

Edit file `src/constants/index.ts` dan ganti `API_URL`:

```typescript
export const API_URL = __DEV__ 
  ? 'http://192.168.1.100:3000' // IP lokal komputer Anda
  : 'https://your-app.vercel.app'; // URL Vercel production
```

> **Penting:** Untuk development, gunakan IP lokal komputer Anda (bukan `localhost`), karena emulator/device tidak bisa akses `localhost` komputer.

### Cara Mendapatkan IP Lokal

**Windows:**
```bash
ipconfig
# Cari "IPv4 Address" di adapter yang aktif
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# atau
ip addr show
```

## 📱 Testing Lokal

### Option 1: Expo Go (Recommended untuk development)

```bash
# Jalankan Expo development server
npm start
# atau
npx expo start
```

Kemudian:
1. Buka **Expo Go** app di smartphone
2. Scan QR code yang muncul di terminal
3. Aplikasi akan terbuka di Expo Go

### Option 2: Android Emulator

```bash
# Pastikan Android Studio dan emulator sudah terinstall
npm run android
```

### Option 3: iOS Simulator (Mac only)

```bash
npm run ios
```

### Menjalankan Backend Lokal

Untuk testing dengan backend lokal, jalankan server di folder root project:

```bash
# Di folder root (virtual-lab), bukan mobile
cd ..
npm run dev
# atau
node api/index.js
```

Server akan berjalan di `http://localhost:3000`

## 🏗️ Build dengan EAS

### Setup EAS (Pertama kali)

```bash
# Login ke Expo account
eas login

# Konfigurasi project (jika belum)
eas build:configure
```

### Build untuk Testing (APK)

```bash
# Build APK untuk testing internal
eas build --platform android --profile preview
```

### Build untuk Production

```bash
# Android (AAB untuk Play Store)
eas build --platform android --profile production

# iOS (untuk App Store)
eas build --platform ios --profile production

# Keduanya
eas build --platform all --profile production
```

### Download Build

Setelah build selesai, download dari:
- Terminal: `eas build:list`
- Web: https://expo.dev/accounts/[username]/projects/virtual-lab-mobile/builds

## 🔧 Konfigurasi Firebase (untuk Google Login)

1. **Buat project di Firebase Console**
   - https://console.firebase.google.com/

2. **Tambahkan Android App**
   - Package name: `com.yourname.virtuallabmobile`
   - Download `google-services.json`
   - Letakkan di folder `mobile/`

3. **Tambahkan iOS App**
   - Bundle ID: `com.yourname.virtuallabmobile`
   - Download `GoogleService-Info.plist`
   - Letakkan di folder `mobile/`

4. **Update app.json**
   - Ganti `bundleIdentifier` dan `package` dengan yang benar

5. **Enable Google Sign-in**
   - Firebase Console → Authentication → Sign-in method → Google

## 📝 Catatan Penting

### Vercel Deployment Tidak Terganggu

Folder `mobile/` **tidak akan** mempengaruhi deployment Vercel karena:

1. `vercel.json` sudah dikonfigurasi untuk hanya build `api/` dan `public/`
2. `.gitignore` sudah mengabaikan `mobile/node_modules/` dan file build

### Struktur yang Aman

```
virtual-lab/
├── api/          ← Deploy ke Vercel ✓
├── public/       ← Deploy ke Vercel ✓
├── models/       ← Deploy ke Vercel ✓
├── mobile/       ← TIDAK di-deploy ke Vercel ✗
│   ├── node_modules/  ← Ignored
│   ├── .expo/         ← Ignored
│   └── android/       ← Ignored
└── ...
```

## 🐛 Troubleshooting

### "Network request failed"
- Pastikan `API_URL` menggunakan IP lokal yang benar
- Pastikan backend server sedang berjalan
- Pastikan device/emulator satu network dengan komputer

### "Module not found"
```bash
# Clear cache dan reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### Build gagal
```bash
# Check EAS build logs
eas build:list
# Klik link untuk melihat logs
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
