const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// ----------------------
// CREATE CARD
// ----------------------
router.post('/', auth, async (req, res) => {
  const { deck_id, front_text, back_text, position } = req.body;
  const userId = req.user.userId;

  try {
    // Verify the deck belongs to the user
    const deck = await pool.query(
      `SELECT * FROM decks WHERE id = $1 AND user_id = $2`,
      [deck_id, userId]
    );

    if (deck.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    // Insert the card
    const result = await pool.query(
      `INSERT INTO cards (deck_id, front_text, back_text, position)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [deck_id, front_text, back_text, position || 0]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------
// UPDATE CARD
// ----------------------
router.put('/:id', auth, async (req, res) => {
  const cardId = req.params.id;
  const { front_text, back_text, position } = req.body;
  const userId = req.user.userId;

  try {
    // Get the card + deck owner
    const card = await pool.query(
      `SELECT cards.*, decks.user_id
       FROM cards
       JOIN decks ON decks.id = cards.deck_id
       WHERE cards.id = $1`,
      [cardId]
    );

    if (card.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (card.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    // Update card
    const result = await pool.query(
      `UPDATE cards
       SET front_text = $1, back_text = $2, position = $3
       WHERE id = $4
       RETURNING *`,
      [front_text, back_text, position, cardId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------
// DELETE CARD
// ----------------------
router.delete('/:id', auth, async (req, res) => {
  const cardId = req.params.id;
  const userId = req.user.userId;

  try {
    // Check card owner
    const card = await pool.query(
      `SELECT cards.*, decks.user_id
       FROM cards
       JOIN decks ON decks.id = cards.deck_id
       WHERE cards.id = $1`,
      [cardId]
    );

    if (card.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (card.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    // Delete card
    await pool.query(
      `DELETE FROM cards WHERE id = $1`,
      [cardId]
    );

    res.json({ message: 'Card deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
