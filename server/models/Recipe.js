const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    description: { type: String },  // Додали поле опису
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ['food', 'drink'], required: true },
    continent: { type: String, required: true },  // Додали поле континенту
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
