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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Gagal mengambil data pengguna' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Gagal menghapus pengguna' });
    }
};

module.exports = { getStats, getUsers, deleteUser };
