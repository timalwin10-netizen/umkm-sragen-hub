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
            console.error('DATABASE ERROR: MONGO_URI env var is missing.');
            return; // Don't throw, let server start
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        await seedAdmin();
    } catch (error) {
        console.error(`DATABASE ERROR: ${error.message}`);
    }
};

module.exports = connectDB;
