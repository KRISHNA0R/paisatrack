import express from 'express';
import db from '../database.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.post('/', (req, res) => {
  try {
    const { amount, category, note, date } = req.body;
    
    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category required' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO expenses (userId, amount, category, note, date)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      req.user.uid, 
      parseFloat(amount), 
      category, 
      note || '', 
      date || new Date().toISOString()
    );
    
    res.status(201).json({
      _id: result.lastInsertRowid,
      userId: req.user.uid,
      amount: parseFloat(amount),
      category,
      note: note || '',
      date: date || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  try {
    const { month } = req.query;
    let query = 'SELECT * FROM expenses WHERE userId = ?';
    let params = [req.user.uid];
    
    if (month) {
      const [year, monthNum] = month.split('-');
      query += ` AND date LIKE ?`;
      params.push(`${year}-${monthNum.padStart(2, '0')}%`);
    }
    
    query += ' ORDER BY date DESC';
    
    const expenses = db.prepare(query).all(...params);
    
    res.json(expenses.map(exp => ({
      _id: exp.id,
      userId: exp.userId,
      amount: exp.amount,
      category: exp.category,
      note: exp.note,
      date: exp.date
    })));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM expenses WHERE id = ? AND userId = ?')
      .run(req.params.id, req.user.uid);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
