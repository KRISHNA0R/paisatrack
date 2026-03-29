import express from 'express';
import Expense from '../models/Expense.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split('-');
    
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
    
    const expenses = await Expense.find({
      userId: req.user.uid,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }).lean();
    
    const categoryTotals = {};
    const dailyTotals = {};
    let totalSpent = 0;
    
    expenses.forEach(exp => {
      const dateKey = exp.date.toISOString().split('T')[0];
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
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
