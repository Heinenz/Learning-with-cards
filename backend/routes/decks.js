const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/public/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT decks.id, decks.title, decks.description, decks.created_at, users.username FROM decks JOIN users ON users.id = decks.user_id WHERE is_public = true ORDER BY decks.created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, is_public } = req.body;
  const userId = req.user.userId;
  try {
    const result = await pool.query('INSERT INTO decks (user_id, title, description, is_public) VALUES ($1, $2, $3, $4) RETURNING *', [userId, title, description, is_public || false]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT * FROM decks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const deckId = parseInt(req.params.id);
  const { title, description, is_public } = req.body;
  const userId = req.user.userId;
  try {
    const result = await pool.query('UPDATE decks SET title = $1, description = $2, is_public = $3 WHERE id = $4 AND user_id = $5 RETURNING *', [title, description, is_public, deckId, userId]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const deckId = parseInt(req.params.id);
  const userId = req.user.userId;

  if (isNaN(deckId)) {
    console.log('INVALID ID RECEIVED:', req.params.id);
    return res.status(400).json({ error: 'Invalid deck ID' });
  }

  console.log('ATTEMPTING DELETE - Deck ID:', deckId, 'User ID:', userId);

  try {
    const result = await pool.query(
      'DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING *',
      [deckId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    res.json({ message: 'Deck deleted' });
  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  const deckId = parseInt(req.params.id);
  const userId = req.user.userId;
  try {
    const deck = await pool.query('SELECT * FROM decks WHERE id = $1', [deckId]);
    if (deck.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    const d = deck.rows[0];
    if (d.user_id !== userId && d.is_public === false) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const cards = await pool.query('SELECT * FROM cards WHERE deck_id = $1 ORDER BY position ASC', [deckId]);
    res.json({ deck: d, cards: cards.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;