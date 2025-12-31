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
        if (!process.env.MONGO_URI) {
            console.log('No MONGO_URI found in environment variables.');
            throw new Error('Local check');
        }
        console.log('Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        await seedAdmin();
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            console.error(`CRITICAL: Failed to connect to production database: ${error.message}`);
            process.exit(1);
        }

        console.log('Falling back to In-Memory Database...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();

            console.log(`In-Memory Database URI: ${uri}`);
            await mongoose.connect(uri);
            console.log(`In-Memory MongoDB Connected`);
            await seedAdmin();
        } catch (memError) {
            console.error(`Fatal Error: Could not connect to any database. ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
