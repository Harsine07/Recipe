const { searchRecipes } = require('../models/search.model');

const searchRecipesController = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const data = await searchRecipes(filters, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchRecipesController };

