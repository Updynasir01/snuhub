const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { verifyToken } = require('../middleware/auth');

// Create article
router.post('/', verifyToken, async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user.id
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get article by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all articles (with optional filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.user.role === 'student') {
      query.author = req.user.id;
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 10);
    
    res.json(articles);
  } catch (error) {
    console.error('Error getting all articles:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update article
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    Object.assign(article, req.body);
    await article.save();
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete article
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await article.remove();
    res.json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get featured articles for public landing page (no auth required)
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name') // Populate author's name
      .sort({ createdAt: -1 })
      .limit(3); // Limit to 3 for featured articles

    res.json(articles);
  } catch (error) {
    console.error('Error getting featured articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 