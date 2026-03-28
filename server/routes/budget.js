import express from 'express';
import db from '../database.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/', (req, res) => {
  try {
    const budget = db.prepare('SELECT * FROM budgets WHERE userId = ?').get(req.user.uid);
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({
      totalBudget: budget.totalBudget,
      alertThreshold: budget.alertThreshold,
      categories: JSON.parse(budget.categories)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { totalBudget, alertThreshold, categories } = req.body;
    
    const existing = db.prepare('SELECT id FROM budgets WHERE userId = ?').get(req.user.uid);
    
    if (existing) {
      db.prepare(`
        UPDATE budgets SET totalBudget = ?, alertThreshold = ?, categories = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE userId = ?
      `).run(totalBudget, alertThreshold || 1000, JSON.stringify(categories), req.user.uid);
    } else {
      db.prepare(`
        INSERT INTO budgets (userId, totalBudget, alertThreshold, categories)
        VALUES (?, ?, ?, ?)
      `).run(req.user.uid, totalBudget, alertThreshold || 1000, JSON.stringify(categories));
    }
    
    res.json({ totalBudget, alertThreshold: alertThreshold || 1000, categories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
