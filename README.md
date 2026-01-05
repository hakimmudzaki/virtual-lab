# Virtual Physics Lab - Projectile Motion Simulator

Aplikasi pembelajaran fisika interaktif untuk simulasi gerak parabola, dikembangkan dengan **React Native (Expo)** untuk platform **Web** dan **Mobile (Android/iOS)**, dilengkapi dengan AI chatbot tutor.

## 🚀 Demo

- **Web App**: [https://mobile-lilac-mu.vercel.app](https://mobile-lilac-mu.vercel.app)
- **Backend API**: [https://virtual-lab-lemon.vercel.app](https://virtual-lab-lemon.vercel.app)

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** - Login/Register dengan JWT + Google OAuth (Firebase)
- 🎯 **Simulasi Gerak Parabola** - Visualisasi interaktif dengan animasi
- 📊 **Sistem Kuis** - Quiz interaktif dengan tracking skor terbaik
- 🤖 **AI Chatbot Tutor** - Powered by Google Gemini AI (khusus topik gerak parabola)
- 📚 **Materi Pembelajaran** - Konten edukatif tentang gerak parabola
- 💾 **Database Integration** - MongoDB untuk user data dan history
- 📱 **Cross-Platform** - Satu codebase untuk Web, Android, dan iOS

## 🛠️ Tech Stack

### Frontend (Mobile & Web)
- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Authentication**: Firebase Auth + Google Sign-In
- **UI Components**: React Native core components
- **Styling**: StyleSheet (React Native)

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **AI**: Google Gemini Pro API
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel Serverless Functions

## 📁 Struktur Project

```
virtual-lab/
├── api/                    # Backend API (Vercel Serverless)
│   ├── index.js           # Main API routes
│   └── ask.js             # AI Chatbot endpoint
├── models/                 # MongoDB Models
│   ├── User.js
│   ├── Simulation.js
│   └── Score.js
├── mobile/                 # React Native App (Expo)
│   ├── app/               # Expo Router pages
│   │   ├── _layout.tsx    # Root layout
│   │   ├── index.tsx      # Landing page
│   │   ├── login.tsx      # Login screen
│   │   ├── register.tsx   # Register screen
│   │   └── (tabs)/        # Tab navigation
│   │       ├── simulation.tsx
│   │       ├── materi.tsx
│   │       ├── quiz.tsx
│   │       ├── chatbot.tsx
│   │       └── profile.tsx
│   ├── src/
│   │   ├── config/        # Firebase config
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API & Auth services
│   │   └── constants/     # App constants & colors
│   ├── assets/            # Images & icons
│   ├── app.json           # Expo config
│   ├── eas.json           # EAS Build config
│   └── package.json
├── public/                 # Legacy web frontend (vanilla JS)
├── vercel.json            # Vercel deployment config
├── package.json           # Backend dependencies
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Mobile (mobile/.env)
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
```

## 💻 Local Development

### Backend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Server berjalan di http://localhost:3000
```

### Mobile/Web App
```bash
# Masuk ke folder mobile
cd mobile

# Install dependencies
npm install

# Run untuk Web
npx expo start --web

# Run untuk Android (memerlukan emulator/device)
npx expo start --android

# Run untuk iOS (memerlukan Mac + Xcode)
npx expo start --ios
```

## 🚀 Deployment

### Deploy Backend ke Vercel
```bash
# Dari root folder
vercel --prod
```

### Deploy Web App ke Vercel
```bash
# Dari folder mobile
cd mobile
vercel --prod
```

### Build APK Android
```bash
cd mobile

# Build APK (untuk distribusi langsung)
npx eas-cli build --profile production-apk --platform android

# Build AAB (untuk Google Play Store)
npx eas-cli build --profile production --platform android
```

### Build iOS
```bash
cd mobile

# Build untuk App Store
npx eas-cli build --profile production --platform ios
```

## 📡 API Endpoints

| Endpoint | Method | Deskripsi | Auth |
|----------|--------|-----------|------|
| `/api/auth/register` | POST | Registrasi user baru | ❌ |
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/google` | POST | Login dengan Google | ❌ |
| `/api/auth/change-password` | POST | Ubah password | ✅ |
| `/api/history` | GET | Ambil riwayat simulasi | ✅ |
| `/api/history/:id` | DELETE | Hapus satu riwayat | ✅ |
| `/api/history` | DELETE | Hapus semua riwayat | ✅ |
| `/api/simulation` | POST | Simpan hasil simulasi | ✅ |
| `/api/score` | GET | Ambil skor terbaik | ✅ |
| `/api/score` | POST | Update skor | ✅ |
| `/api/leaderboard` | GET | Leaderboard | ❌ |
| `/api/ask` | POST | AI Chatbot | ✅ |

## 🔐 Autentikasi

Aplikasi mendukung 2 metode login:

1. **Local Authentication**
   - Username & password
   - Password di-hash dengan bcrypt

2. **Google OAuth**
   - Firebase Authentication
   - Popup sign-in untuk web
   - Native Google Sign-In untuk mobile

## 📱 Screenshots

### Mobile App
- Simulasi gerak parabola interaktif
- Quiz dengan timer dan scoring
- AI Chatbot untuk tanya jawab
- Profile dengan riwayat simulasi

### Web App
- Responsive design (mobile-first)
- PWA support
- Same features as mobile

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Auth Error (Web)**
   - Pastikan domain sudah ditambahkan di Firebase Console → Authentication → Authorized domains

2. **API Connection Error**
   - Cek `API_URL` di `src/constants/index.ts`
   - Pastikan backend sudah running

3. **Google Sign-In tidak berfungsi di APK**
   - Pastikan SHA-1 fingerprint sudah ditambahkan di Firebase Console
   - Cek `eas.json` untuk keystore configuration

4. **Build APK gagal**
   - Jalankan `npx eas-cli build --profile production-apk --platform android --clear-cache`

## 📄 License

ISC

## 👨‍💻 Author

18223024 & 18223086

## 👥 Pembagian Tugas

| NIM | Tugas |
|-----|-------|
| 18223024 | Frontend (React Native), UI/UX Design, Simulasi Gerak Parabola, Integrasi Firebase Auth, Laporan Tugas |
| 18223086 | Backend API, Database MongoDB, AI Chatbot (Gemini), Deployment Vercel & Expo, Laporan Tugas|
