import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../botm360 v1.0.4 conection with db/database.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save email and hashedPassword to your users table
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Fetch the user by email from your users table
  const user = {}; // Placeholder for fetched user
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});


export default router;
