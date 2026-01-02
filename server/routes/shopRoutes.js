const express = require('express');
const router = express.Router();
const {
    getShops,
    getShopById,
    createShop,
    updateShop,
    deleteShop,
    addProduct,
    deleteProduct
} = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getShops)
    .post(protect, createShop);

router.route('/:id')
    .get(getShopById)
    .put(protect, updateShop)
    .delete(protect, admin, deleteShop);

router.route('/:id/products')
    .post(protect, addProduct);

router.route('/:id/products/:productId')
    .delete(protect, deleteProduct);

module.exports = router;
