const mongoose = require('mongoose');

const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            console.log('No admin found, creating default admin...');
            await User.create({
                name: 'Super Admin Sragen',
                email: 'superadmin@sragen.id',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin'
            });
            console.log('Default admin created: superadmin@sragen.id / admin123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.error('MONGO_URI is missing in environment variables!');
            if (process.env.NODE_ENV === 'production') {
                throw new Error('MONGO_URI must be defined in production');
            }
            // Local fallback
            console.log('Falling back to In-Memory Database (Development)...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('In-Memory MongoDB Connected');
            await seedAdmin();
            return;
        }

        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        await seedAdmin();
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // In local development, if everything fails, we still want to know
        if (process.env.NODE_ENV !== 'production' && !process.env.MONGO_URI) {
            console.log('Critical failure in local DB setup');
        }
        // In Vercel, we throw to let the function fail visibly or keep trying
        throw error;
    }
};

module.exports = connectDB;
