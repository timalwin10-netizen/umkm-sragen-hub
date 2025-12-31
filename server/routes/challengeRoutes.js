const express = require('express');
const router = express.Router();
const {
    getChallenges,
    getChallengeById,
    createChallenge,
    joinChallenge
} = require('../controllers/challengeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getChallenges)
    .post(protect, admin, createChallenge);

router.route('/:id').get(getChallengeById);
router.route('/:id/join').post(protect, joinChallenge);

module.exports = router;
