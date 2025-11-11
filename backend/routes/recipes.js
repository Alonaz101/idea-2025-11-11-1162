const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

// GET /api/recipes?mood=good
router.get('/', async (req, res) => {
  try {
    const moodTag = req.query.mood;
    const redisClient = req.app.locals.redisClient;
    const cacheKey = `recipes:${moodTag || 'all'}`;

    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    let recipes;
    if (moodTag) {
      recipes = await Recipe.find({ moodTags: moodTag });
    } else {
      recipes = await Recipe.find();
    }

    if (redisClient) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(recipes)); // cache 1 hour
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
