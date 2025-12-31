const Shop = require('../models/Shop');
const User = require('../models/User');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const shops = await Shop.find({ ...keyword, ...category });
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a shop
// @route   POST /api/shops
// @access  Private
const createShop = async (req, res) => {
    try {
        const { name, description, category, location, contact, image } = req.body;

        const shopExists = await Shop.findOne({ user: req.user._id });

        if (shopExists) {
            return res.status(400).json({ message: 'User already has a shop' });
        }

        const shop = new Shop({
            user: req.user._id,
            name,
            description,
            category,
            location,
            contact,
            image,
            products: []
        });

        const createdShop = await shop.save();

        // Update user to have shop_details
        const user = await User.findById(req.user._id);
        user.shop_details = createdShop._id;
        await user.save();

        res.status(201).json(createdShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private
const updateShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            if (shop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            shop.name = req.body.name || shop.name;
            shop.description = req.body.description || shop.description;
            shop.category = req.body.category || shop.category;
            shop.location = req.body.location || shop.location;
            shop.image = req.body.image || shop.image;
            shop.contact = req.body.contact || shop.contact;

            const updatedShop = await shop.save();
            res.json(updatedShop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private/Admin
const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            if (req.user.role === 'admin') { // Only admin can delete for now, or owner? Logic says Admin deletes violators
                await shop.remove();

                // Remove reference from user? Optional but good practice
                // ... logic to find user and unset shop_details

                res.json({ message: 'Shop removed' });
            } else {
                res.status(401).json({ message: 'Not authorized as admin' });
            }
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getShops,
    getShopById,
    createShop,
    updateShop,
    deleteShop
};
