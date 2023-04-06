import mongoose, { Schema } from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slots: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});
export default mongoose.model('Event', eventSchema);
