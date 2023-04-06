/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';
import bookingModel from '../model/bookingModel.js';
import eventModel from '../model/eventModel.js';

const userRegister = async (req, res) => {
  const emailExist = await userModel.findOne({ email: req.body.email });
  const phoneExist = await userModel.findOne({ phone: req.body.phone });
  if (emailExist || phoneExist) {
    res.json({ sign_up: false });
    return;
  }
  const {
    fname, lname, email, phone, password,
  } = req.body;
  let hashPass;
  await bcrypt
    .hash(password, 10)
    .then((hash) => {
      hashPass = hash;
    // eslint-disable-next-line no-console
    }).catch((err) => { console.log(err.message); });
  new userModel({
    firstName: fname,
    lastName: lname,
    email,
    phone,
    password: hashPass,
  }).save();
  res.status(201).json({ sign_up: true });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({
        status: false,
        message: 'auth denied',
      });
    }
    return bcrypt.compare(password, user.password)
      .then((result) => {
        if (!result) {
          return res.json({
            status: false,
            message: 'Auth denied',
          });
        }
        // eslint-disable-next-line no-underscore-dangle
        const token = jwt.sign({ email: user.email, userId: user._id, fullName: user.firstName.concat(' ').concat(user.lastName) }, 'secret_code', { expiresIn: '1h' });
        return res.status(200).json({
          status: 'success',
          token,
          role: 'user',
          expiresIn: 3600,
        });
      }).catch((err) => res.json({
        err,
      }));
  });
};
const fetchProfile = async (req, res) => {
  const { userId } = req.user;
  const user = await userModel.findOne({ _id: userId });
  const tickets = await bookingModel.find({ user: userId }).populate('event');
  return res.json({
    user, tickets,
  });
};
const cancelTicket = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.body;
  try {
    const ticket = await bookingModel.findOne({ _id: id }).populate('event');
    const now = new Date();
    if (ticket.event.date > now) {
      await bookingModel.updateOne({ _id: id }, { $set: { status: 'Cancelled' } })
        .then(async () => {
          await userModel.updateOne({ _id: userId }, { $inc: { wallet: ticket.total } })
            .then(async () => {
              await eventModel.updateOne(
                {
                  _id: ticket.event._id,
                },
                { $inc: { sold: ticket.quantity, slots: -ticket.quantity } },
              );
              res.status(201).json({
                status: true,
              });
            });
        });
    } else {
      return res.json({
        status: false,
        message: 'expired',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export {
  userRegister,
  userLogin,
  fetchProfile,
  cancelTicket,
};
