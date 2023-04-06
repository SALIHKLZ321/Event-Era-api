import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  amount: {
    type: Number,
    default: 0,
  },
  canceledOrders: {
    type: [mongoose.Types.ObjectId],
  },
});
export default mongoose.model('Wallet', walletSchema);
