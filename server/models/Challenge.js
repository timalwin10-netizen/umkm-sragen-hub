const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    image: { type: String },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        submission_url: { type: String },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        joined_at: { type: Date, default: Date.now }
    }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;
