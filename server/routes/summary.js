import express from 'express';
import db from '../database.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/:month', (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    const pattern = `${year}-${monthNum.padStart(2, '0')}%`;
    
    const expenses = db.prepare(`
      SELECT * FROM expenses WHERE userId = ? AND date LIKE ?
      ORDER BY date DESC
    `).all(req.user.uid, pattern);
    
    const categoryTotals = {};
    const dailyTotals = {};
    let totalSpent = 0;
    
    expenses.forEach(exp => {
      const dateKey = exp.date.split('T')[0];
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + exp.amount;
      totalSpent += exp.amount;
    });
    
    const daysInMonth = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const cumulativeData = [];
    let cumulative = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${monthNum.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cumulative += dailyTotals[dateKey] || 0;
      cumulativeData.push({ day, date: dateKey, cumulative, budget: 0 });
    }
    
    res.json({ totalSpent, categoryTotals, dailyTotals, cumulativeData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
