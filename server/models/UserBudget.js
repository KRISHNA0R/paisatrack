import mongoose from 'mongoose';

const userBudgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  totalBudget: {
    type: Number,
    required: true,
    default: 0
  },
  alertThreshold: {
    type: Number,
    default: 1000
  },
  categories: {
    type: [{
      name: { type: String, required: true },
      budget: { type: Number, default: 0 },
      icon: { type: String, default: '📦' }
    }],
    default: []
  }
}, {
  timestamps: true
});

const UserBudget = mongoose.model('UserBudget', userBudgetSchema);

export default UserBudget;
