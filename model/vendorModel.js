import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongooseUniqueValidator from 'mongoose-unique-validator';

const vendorSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

});
vendorSchema.plugin(mongooseUniqueValidator);
export default mongoose.model('Vendor', vendorSchema);
