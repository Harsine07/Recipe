const { getPaginatedRecipes } = require('../models/recipeModel');

const fetchPaginatedRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getPaginatedRecipes(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching paginated recipes:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  fetchPaginatedRecipes
};
