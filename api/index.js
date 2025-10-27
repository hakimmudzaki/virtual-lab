// Vercel serverless API entrypoint — serves all /api/* routes
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Simulation = require('../models/Simulation');
const Score = require('../models/Score');

const app = express();

// Middleware
app.use(express.json());

// CORS Middleware untuk Vercel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const JWT_SECRET = process.env.JWT_SECRET || 'kunci-rahasia-ini-sangat-aman-dan-harus-diganti';

// Inisialisasi model Gemini
let genAI, model;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY.trim());
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch (error) {
        console.error('Error inisialisasi Gemini AI:', error);
    }
}

// MongoDB Connection
const connectionString = process.env.MONGODB_URI || "mongodb+srv://user_lab:user_lab_098@cluster0.rq2wgnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        isConnected = true;
        console.log('✅ Berhasil terhubung ke MongoDB Atlas!');
    } catch (error) {
        console.error('❌ Koneksi database gagal:', error.message);
        throw error;
    }
};

// Auth Middleware
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token tidak ditemukan atau format salah.' });
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('ERROR AUTH MIDDLEWARE:', error);
        return res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
    }
};

// API Routes
app.get('/api', (req, res) => res.json({ message: 'Virtual Lab API is running on Vercel!' }));

app.get('/api/debug', (req, res) => {
    res.json({ nodeEnv: process.env.NODE_ENV, hasGeminiKey: !!process.env.GEMINI_API_KEY, hasMongoUri: !!process.env.MONGODB_URI, hasJwtSecret: !!process.env.JWT_SECRET });
});

app.post('/api/auth/register', async (req, res) => {
    try {
        await connectToDatabase();
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username sudah digunakan.' });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'Registrasi berhasil!', token, user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error('ERROR REGISTRASI:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        await connectToDatabase();
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Username atau password salah.' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Username atau password salah.' });
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login berhasil!', token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('ERROR LOGIN:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

// History, simulation, scores, chatbot routes (kept minimal here — mirror of original)
app.get('/api/history', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); const userHistory = await Simulation.find({ user: req.user.id }).sort({ timestamp: -1 }).limit(10); res.json(userHistory); } catch (error) { console.error(error); res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
});

app.delete('/api/history/:id', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); const simulation = await Simulation.findById(req.params.id); if (!simulation) return res.status(404).json({ message: 'Riwayat tidak ditemukan.' }); if (simulation.user.toString() !== req.user.id) return res.status(403).json({ message: 'Akses ditolak.' }); await Simulation.findByIdAndDelete(req.params.id); res.json({ message: 'Riwayat berhasil dihapus.' }); } catch (error) { console.error(error); res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
});

app.post('/api/simulation', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); const { velocity, angle, height, range, time } = req.body; const newSimulation = new Simulation({ user: req.user.id, velocity, angle, height, range, time }); await newSimulation.save(); res.status(201).json({ message: 'Simulasi berhasil disimpan!', simulation: newSimulation }); } catch (error) { console.error(error); res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
});

app.get('/api/scores/best', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); const bestScore = await Score.findOne({ user: req.user.id }); if (!bestScore) return res.json({ bestScore: 0 }); res.json({ bestScore: bestScore.bestScore }); } catch (error) { console.error(error); res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
});

app.post('/api/scores', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); const { score } = req.body; let userScore = await Score.findOne({ user: req.user.id }); if (!userScore) { userScore = new Score({ user: req.user.id, bestScore: score }); } else if (score > userScore.bestScore) { userScore.bestScore = score; } await userScore.save(); res.json({ message: 'Skor berhasil disimpan!', bestScore: userScore.bestScore, isNewRecord: !userScore || score > userScore.bestScore }); } catch (error) { console.error(error); res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
});

app.post('/api/chatbot', authMiddleware, async (req, res) => {
    try { await connectToDatabase(); if (!model) return res.status(503).json({ error: 'Chatbot tidak tersedia', response: 'Maaf, layanan chatbot sedang tidak tersedia.' }); const { message } = req.body; if (!message || message.trim() === '') return res.status(400).json({ error: 'Pesan tidak boleh kosong', response: 'Silakan masukkan pertanyaan Anda.' }); const fullPrompt = `Pertanyaan pengguna: ${message}`; const result = await model.generateContent(fullPrompt); const rawText = result.response.text(); res.json({ response: rawText }); } catch (error) { console.error(error); res.status(500).json({ error: 'Terjadi kesalahan pada chatbot.' }); }
});

// Global error and 404
app.use((err, req, res, next) => { console.error('GLOBAL ERROR', err); res.status(500).json({ error: 'Internal Server Error' }); });
app.use((req, res) => { res.status(404).json({ error: 'Not Found', path: req.path, method: req.method }); });

module.exports = app;

// Local test server
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Local API server listening on http://localhost:${port}`));
}
