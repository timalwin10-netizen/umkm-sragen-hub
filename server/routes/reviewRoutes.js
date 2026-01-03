const express = require('express');
const router = express.Router();
const { createReview, getShopReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);
router.route('/:shopId').get(getShopReviews);

module.exports = router;
