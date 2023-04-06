/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import vendorModel from '../model/vendorModel.js';
// import eventSchema from '../model/eventModel.js';

const vendorRegister = async (req, res) => {
  const emailExist = await vendorModel.findOne({ email: req.body.email });
  const phoneExist = await vendorModel.findOne({ phone: req.body.phone });
  if (emailExist || phoneExist) {
    res.json({ sign_up_vendor: false });
    return;
  }
  const {
    fname, lname, email, phone, password,
  } = req.body;
  let hashPass;
  await bcrypt.hash(password, 10).then((hash) => {
    hashPass = hash;
  }).catch((err) => { console.log(err.message); });
  // eslint-disable-next-line new-cap
  new vendorModel({
    firstName: fname,
    lastName: lname,
    email,
    phone,
    password: hashPass,
  }).save();
  res.status(201).json({ sign_up_vendor: true });
};
const vendorLogin = (req, res) => {
  const { email, password } = req.body;
  vendorModel.findOne({ email }).then((vendor) => {
    if (!vendor) {
      return res.status(401).json({
        status: false,
        message: 'authDenied',
      });
    }
    return bcrypt.compare(password, vendor.password)
      .then((result) => {
        if (!result) {
          return res.status(200).json({
            status: false,
            message: 'authDenied',
          });
        }
        const fullName = vendor.firstName.concat(' ').concat(vendor.lastName);
        const token = jwt.sign({ email: vendor.email, vendorId: vendor._id, fullName }, 'secret_vendor', { expiresIn: '1h' });
        return res.status(200).json({
          status: true,
          token,
          role: 'vendor',
          expiresIn: 3600,
        });
      });
    // eslint-disable-next-line no-unreachable
  });
};
const nonVerified = async (req, res) => {
  const vendor = await vendorModel.find({ isVerified: false });
  if (!vendor) {
    return null;
  }
  return res.json({
    vendor,
  });
};
const fetchAllVendors = async (req, res) => {
  const vendor = await vendorModel.find();
  if (!vendor) {
    return null;
  }
  return res.json({
    vendor,
  });
};
const activeVendors = async (req, res) => {
  const vendors = await vendorModel.find({ isBlocked: false });
  if (!vendors) {
    return null;
  }
  return res.json({
    vendors,
  });
};
const vendorDetails = async (req, res) => {
  const { id } = req.query;
  const vendor = await vendorModel.findOne({ _id: id });
  return res.json({
    vendor,
  });
};
const blockVendor = async (req, res) => {
  const { id } = req.body;
  await vendorModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    { $set: { isBlocked: true } },
  );
  res.json({
    status: true,
  });
};
const unblockVendor = async (req, res) => {
  const { id } = req.body;
  await vendorModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    { $set: { isBlocked: false } },
  );
  res.json({
    status: true,
  });
};
const verifyVendor = async (req, res) => {
  const { id } = req.body;
  await vendorModel.updateOne(
    { _id: mongoose.Types.ObjectId(id) },
    { $set: { isVerified: true } },
  );
  res.json({
    status: true,
  });
};
const vendorProfile = async (req, res) => {
  const { vendorId } = req.vendor;
  const vendor = await vendorModel.findOne({ _id: vendorId });
  return res.json({ vendor });
};
const profilePicUpload = async (req, res) => {
  const { vendorId } = req.vendor;
  const { url } = req.body;
  await vendorModel.updateOne({ _id: vendorId }, { $set: { image: url } });
  res.json({
    url,
  });
};
const vendorEvents = async (req, res) => {
  const vendors = await vendorModel.find();
  res.json({
    vendors,
  });
};

export {
  vendorRegister,
  vendorLogin,
  nonVerified,
  fetchAllVendors,
  blockVendor,
  unblockVendor,
  verifyVendor,
  vendorProfile,
  profilePicUpload,
  activeVendors,
  vendorDetails,
  vendorEvents,
};
