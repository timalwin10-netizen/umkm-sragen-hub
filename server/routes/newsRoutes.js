const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsById,
    createNews,
    deleteNews,
    updateNews
} = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getNews)
    .post(protect, admin, createNews);

router.route('/:id')
    .get(getNewsById)
    .put(protect, admin, updateNews)
    .delete(protect, admin, deleteNews);

module.exports = router;
