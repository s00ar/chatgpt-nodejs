import express from 'express';
import pool from '../botm360 v1.0.4 conection with db/database.js';
import authenticateToken from './authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  // Fetch ignored numbers
});

router.post('/', authenticateToken, async (req, res) => {
  // Add a new ignored number
});

router.delete('/:id', authenticateToken, async (req, res) => {
  // Remove an ignored number
});

export default router;
