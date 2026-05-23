const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if email is already used
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Insert the user
    const newUser = await pool.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, hashed]
    );

    res.json({ user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

    try {
        //look for user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({error: 'Invalid email or password'});
        }

        const user = result.rows[0];

        //Compare password
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        //Create JWT
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.json({token,user: {
            id: user.id,
            email: user.email,
            username: user.username
        }});

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});

module.exports = router;