const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Inovasi', 'Event', 'Bisnis'
    image: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);
module.exports = News;
