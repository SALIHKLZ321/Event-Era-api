/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable no-bitwise */
/* eslint-disable import/extensions */

import eventSchema from '../model/eventModel.js';
import userSchema from '../model/userModel.js';
import bookingSchema from '../model/bookingModel.js';

const eventUpload = async (req, res) => {
  const vendor = req.vendor.vendorId;
  const {
    title, venue, description, price, date, slots, image_url,
  } = req.body;
  if (!title | !venue | !description | !price | !date | !slots | !image_url) {
    return res.json({ status: false });
  }
  await new eventSchema({
    title, venue, description, price, date, slots, image_url, vendor,
  }).save();
  return res.json({ status: true });
};
const vendorEvents = async (req, res) => {
  const { vendorId } = req.vendor;
  const events = await eventSchema.find({ vendor: vendorId });
  return res.json({
    events,
  });
};
const vendorEventsId = async (req, res) => {
  const vendorId = req.query.id;
  const events = await eventSchema.find({ vendor: vendorId });
  return res.json({
    events,
  });
};
const allEvents = async (req, res) => {
  // const now = new Date();
  const events = await eventSchema.find().populate('vendor');
  return res.json({
    events,
  });
};
const eventDetail = async (req, res) => {
  const eventId = req.query.id;
  const event = await eventSchema.findOne({ _id: eventId }).populate('vendor');
  return res.json({
    event,
  });
};
const bookingDetails = async (req, res) => {
  const { userId } = req.user;
  const eventId = req.query.id;
  const event = await eventSchema.findOne({ _id: eventId }).populate('vendor');
  const user = await userSchema.findOne({ _id: userId });
  return res.json({
    event, user,
  });
};
const updateEvent = async (req, res) => {
  const {
    _id, title, venue, description, price, date, slots, image_url,
  } = req.body;
  await eventSchema.updateOne({ _id }, {
    $set: {
      title, venue, description, date, slots, price, image_url,
    },
  });
  return res.json({
    status: true,
  });
};
const bookTicket = async (req, res) => {
  const { userId } = req.user;
  const { event, quantity, total } = req.body;
  await new bookingSchema({
    user: userId,
    event,
    quantity,
    total,
  }).save();
  await eventSchema.updateOne(
    { _id: event },
    {
      $inc: { sold: 1, slots: -1 },
    },
  );
  return res.json({
    status: true,
  });
};
const fetctFirstUpcomingEvent = async (req, res) => {
  const now = new Date();
  const event = await eventSchema.find({ date: { $gt: now } }).sort({ date: 1 });
  return res.json({
    event: event[0],
  });
};
const graphValues = async (req, res) => {
  const { vendorId } = req.vendor;
  const event = await eventSchema.find({ vendor: vendorId });
  const eventNames = [];
  const eventSlots = [];
  const eventSold = [];
  const eventCollection = [];
  event.forEach((e) => {
    eventNames.push(e.title);
    eventSlots.push(e.slots.toString());
    eventSold.push(e.sold.toString());
    eventCollection.push((e.price * e.sold).toString());
  });
  return res.json({
    eventNames, eventSlots, eventCollection, eventSold,
  });
};
const eventTickets = async (req, res) => {
  const eventId = req.query.id;
  const tickets = await bookingSchema.find({ event: eventId }).populate('user');
  console.log(tickets);
  return res.json({
    tickets,
  });
};

export {
  // eslint-disable-next-line max-len
  eventUpload, vendorEvents, vendorEventsId, allEvents, eventDetail, bookingDetails, updateEvent, bookTicket, fetctFirstUpcomingEvent, graphValues, eventTickets,
};
