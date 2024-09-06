const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// CRUD Маршрути
router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getRecipes);
router.get('/cuisines', recipeController.getAllUniqueCuisines); // Отримання всіх країн (кухонь)
router.get('/cuisines/type-continent', recipeController.getCuisinesByTypeAndContinent); // Отримання країн по типу і континенту
router.get('/continents/type', recipeController.getContinentsByType); // Отримання континентів по типу
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
