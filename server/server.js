const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Для зберігання конфіденційних даних

const app = express();
app.use(cors({
    origin: '*', // Вкажіть свої налаштування для безпечного доступу
}));
app.use(express.json());

// Підключення до MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Імпорт маршрутів
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
