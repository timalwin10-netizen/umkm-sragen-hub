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

const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            if (req.user.role === 'admin') {
                await shop.deleteOne();

                // Remove reference from user
                const user = await User.findById(shop.user);
                if (user && user.shop_details) {
                    user.shop_details = null;
                    await user.save();
                }

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

// @desc    Add product to shop
// @route   POST /api/shops/:id/products
// @access  Private
const addProduct = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            if (shop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            const { name, price, description, image } = req.body;

            const product = {
                name,
                price,
                description,
                image
            };

            shop.products.push(product);
            await shop.save();

            res.status(201).json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product from shop
// @route   DELETE /api/shops/:id/products/:productId
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (shop) {
            if (shop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            shop.products = shop.products.filter(
                (product) => product._id.toString() !== req.params.productId
            );

            await shop.save();
            res.json(shop);
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
    deleteShop,
    addProduct,
    deleteProduct
};
