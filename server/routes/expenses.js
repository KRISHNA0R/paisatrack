import express from 'express';
import Expense from '../models/Expense.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.post('/', async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;
    
    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category required' });
    }
    
    const expense = new Expense({
      userId: req.user.uid,
      amount: parseFloat(amount),
      category,
      note: note || '',
      date: date ? new Date(date) : new Date()
    });
    
    await expense.save();
    
    res.status(201).json({
      _id: expense._id,
      userId: expense.userId,
      amount: expense.amount,
      category: expense.category,
      note: expense.note,
      date: expense.date.toISOString()
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    let query = { userId: req.user.uid };
    
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 }).lean();
    
    res.json(expenses.map(exp => ({
      _id: exp._id,
      userId: exp.userId,
      amount: exp.amount,
      category: exp.category,
      note: exp.note || '',
      date: exp.date.toISOString()
    })));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
