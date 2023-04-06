import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  vendor: {
    type: mongoose.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
export default mongoose.model('Ticket', ticketSchema);
