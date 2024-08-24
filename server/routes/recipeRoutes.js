const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// CRUD Маршрути
router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
