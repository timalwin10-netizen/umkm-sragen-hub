const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
});

const shopSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Kuliner', 'Kerajinan', 'Fashion'
    location: { type: String, required: true, default: 'Sragen' },
    latitude: { type: Number, default: -7.4279 },
    longitude: { type: Number, default: 111.0188 },
    openingHours: { type: String, default: '08:00 - 17:00' },
    image: { type: String }, // Shop banner/logo
    products: [productSchema],
    contact: {
        whatsapp: { type: String },
        email: { type: String }
    }
}, { timestamps: true });

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
