import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expensesRouter from './routes/expenses.js';
import budgetRouter from './routes/budget.js';
import summaryRouter from './routes/summary.js';
import connectDB from './mongodb.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'PaisaTrack API is running',
    database: 'MongoDB Atlas',
    status: 'connected'
  });
});

app.use('/api/expenses', expensesRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/summary', summaryRouter);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database: MongoDB Atlas`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
