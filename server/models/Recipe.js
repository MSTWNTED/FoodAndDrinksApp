const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    ingredients: { type: [String], required: false, default: [] },
    instructions: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    imageUrl: { type: String, required: false, default: "" },
    type: { type: String, enum: ['food', 'drink'], required: true },
    continent: { type: String, required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
