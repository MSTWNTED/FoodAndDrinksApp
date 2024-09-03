const Recipe = require('../models/Recipe');

// Створення нового рецепту
exports.createRecipe = async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Отримання всіх рецептів
exports.getRecipes = async (req, res) => {
    try {
        const { type, country } = req.query;
        let query = {};

        // Додаємо фільтрацію за типом, якщо параметр переданий
        if (type) {
            query.type = type;
        }

        // Додаємо фільтрацію за країною, якщо параметр переданий
        if (country) {
            query.cuisine = country;
        }

        const recipes = await Recipe.find(query);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Отримання одного рецепту за ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Оновлення рецепту за ID
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Видалення рецепту за ID
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Отримання всіх унікальних країн (кухонь) без фільтрації за типом
exports.getAllUniqueCuisines = async (req, res) => {
    try {
        const cuisines = await Recipe.distinct('cuisine');
        res.json(cuisines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Отримання унікальних країн (кухонь) за типом та континентом
exports.getUniqueCuisinesByTypeAndContinent = async (req, res) => {
    try {
        const { type, continent } = req.query;

        // Валідація параметра type
        if (!type || (type !== 'food' && type !== 'drink')) {
            return res.status(400).json({ error: 'Invalid type parameter' });
        }

        let query = { type };

        // Додаємо фільтрацію за континентом, якщо параметр переданий
        if (continent) {
            query.continent = continent;
        }

        const cuisines = await Recipe.distinct('cuisine', query);
        res.json(cuisines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
