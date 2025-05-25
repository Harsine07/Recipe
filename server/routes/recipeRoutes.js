const express = require('express');
const router = express.Router();
const { fetchPaginatedRecipes } = require('../controllers/recipeController');
const { searchRecipesController } = require('../controllers/search.controller');

router.get('/recipes/search', searchRecipesController);
router.get('/recipes', fetchPaginatedRecipes);


module.exports = router;
