const Review = require('../models/Review');
const Shop = require('../models/Shop');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { rating, comment, shopId } = req.body;

        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            shop: shopId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            user: req.user._id,
            shop: shopId,
            rating: Number(rating),
            comment,
        });

        // Recalculate average
        const reviews = await Review.find({ shop: shopId });
        shop.numReviews = reviews.length;
        shop.rating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await shop.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a shop
// @route   GET /api/reviews/:shopId
// @access  Public
const getShopReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ shop: req.params.shopId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getShopReviews };
