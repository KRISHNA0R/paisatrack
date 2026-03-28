import express from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';
import budgetRouter from './routes/budget.js';
import summaryRouter from './routes/summary.js';
import db from './database.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'PaisaTrack API is running',
    database: 'SQLite',
    status: 'connected'
  });
});

app.use('/api/expenses', expensesRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/summary', summaryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: SQLite (${db.name})`);
});
