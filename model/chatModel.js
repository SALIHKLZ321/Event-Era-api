import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  members: [],
});
export default mongoose.model('Chat', chatSchema);
