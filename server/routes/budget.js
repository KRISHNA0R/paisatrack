import express from 'express';
import UserBudget from '../models/UserBudget.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/', async (req, res) => {
  try {
    const budget = await UserBudget.findOne({ userId: req.user.uid }).lean();
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({
      totalBudget: budget.totalBudget,
      alertThreshold: budget.alertThreshold,
      categories: budget.categories
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { totalBudget, alertThreshold, categories } = req.body;
    
    const budget = await UserBudget.findOneAndUpdate(
      { userId: req.user.uid },
      {
        totalBudget,
        alertThreshold: alertThreshold || 1000,
        categories: categories || []
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({ 
      totalBudget: budget.totalBudget, 
      alertThreshold: budget.alertThreshold, 
      categories: budget.categories 
    });
  } catch (error) {
    console.error('Error saving budget:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
