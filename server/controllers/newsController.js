const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const news = await News.find({ ...keyword, ...category }).sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (news) {
            res.json(news);
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
    try {
        const { title, content, category, image } = req.body;

        const news = new News({
            title,
            content,
            category,
            image,
            admin: req.user._id
        });

        const createdNews = await news.save();
        res.status(201).json(createdNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (news) {
            await news.deleteOne();
            res.json({ message: 'News removed' });
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (news) {
            news.title = req.body.title || news.title;
            news.content = req.body.content || news.content;
            news.category = req.body.category || news.category;
            news.image = req.body.image || news.image;

            const updatedNews = await news.save();
            res.json(updatedNews);
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNews,
    getNewsById,
    createNews,
    deleteNews,
    updateNews
};
