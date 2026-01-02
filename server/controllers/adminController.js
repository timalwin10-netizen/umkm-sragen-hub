const User = require('../models/User');
const Shop = require('../models/Shop');
const News = require('../models/News');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const [userCount, shopCount, newsCount] = await Promise.all([
            User.countDocuments(),
            Shop.countDocuments(),
            News.countDocuments(),
        ]);

        res.json({
            users: userCount,
            shops: shopCount,
            news: newsCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Gagal mengambil statistik' });
    }
};

module.exports = { getStats };
