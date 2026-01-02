const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const newsRoutes = require('./routes/newsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

dotenv.config();

// Validation for critical environment variables
if (process.env.NODE_ENV === 'production') {
    if (!process.env.MONGO_URI) {
        console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
    }
    if (!process.env.JWT_SECRET) {
        console.warn('WARNING: JWT_SECRET is not defined. Login will fail.');
    }
}

connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://umkm-sragen-hub.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Check for missing environment variables before processing any /api request
app.use('/api', (req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
        return res.status(500).json({
            message: 'DATABASE_CONFIG_MISSING: MONGO_URI is not set in Vercel Environment Variables.',
            instruction: 'Please add MONGO_URI in project settings -> Environment Variables and Redeploy.'
        });
    }
    next();
});

app.get(['/', '/api'], (req, res) => {
    res.send('API is running...');
});

// Diagnostic Endpoints
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/debug', (req, res) => {
    res.json({
        env: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeVersion: process.version,
        vercel: !!process.env.VERCEL
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// Catch-all for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err.message);
    // In serverless, we don't necessarily want to exit(1) as it kills the instance
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
