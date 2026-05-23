const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Después de app.use(express.json())


// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const deckRoutes = require('./routes/decks');
app.use('/decks', deckRoutes);

const cardRoutes = require('./routes/cards');
app.use('/cards', cardRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Flashcard API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
