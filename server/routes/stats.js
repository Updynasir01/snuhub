const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const Article = require('../models/Article');
const User = require('../models/User');

// Get platform overview stats (admin only)
router.get('/overview', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const totalUsers = await User.countDocuments();
    
    // Get recent activity (last 10 articles)
    const recentActivity = await Article.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title status updatedAt author')
      .lean();

    res.json({
      totalArticles,
      publishedArticles,
      activeUsers: totalUsers,
      recentActivity: recentActivity.map(article => ({
        action: `Article ${article.status}`,
        user: article.author,
        details: article.title,
        timestamp: article.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 