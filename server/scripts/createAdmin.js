// Script untuk membuat admin user
// Jalankan dengan: node scripts/createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/umkm_sragen';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    shop_details: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'superadmin@sragen.id' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            name: 'Super Admin Sragen',
            email: 'superadmin@sragen.id',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully!');
        console.log('Email: superadmin@sragen.id');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
