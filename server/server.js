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
        // Allow requests with no origin (mobile apps, Postman, etc)
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

app.get(['/', '/api'], (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
