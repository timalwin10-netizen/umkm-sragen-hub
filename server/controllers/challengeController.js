const Challenge = require('../models/Challenge');

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({});
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get challenge by ID
// @route   GET /api/challenges/:id
// @access  Public
const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (challenge) {
            res.json(challenge);
        } else {
            res.status(404).json({ message: 'Challenge not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a challenge
// @route   POST /api/challenges
// @access  Private/Admin
const createChallenge = async (req, res) => {
    try {
        const { title, description, deadline, image } = req.body;

        const challenge = new Challenge({
            title,
            description,
            deadline,
            image,
            admin: req.user._id
        });

        const createdChallenge = await challenge.save();
        res.status(201).json(createdChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        const { submission_url } = req.body;

        if (challenge) {
            const alreadyJoined = challenge.participants.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyJoined) {
                return res.status(400).json({ message: 'You have already joined this challenge' });
            }

            const participant = {
                user: req.user._id,
                submission_url,
                status: 'pending'
            };

            challenge.participants.push(participant);
            await challenge.save();
            res.status(201).json({ message: 'Challenge joined' });
        } else {
            res.status(404).json({ message: 'Challenge not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChallenges,
    getChallengeById,
    createChallenge,
    joinChallenge
};
