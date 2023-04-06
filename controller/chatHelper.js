/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import chatSchema from '../model/chatModel.js';
import messageSchema from '../model/messageModel.js';
import vendorSchema from '../model/vendorModel.js';
import userSchema from '../model/userModel.js';

const createConnection = async (req, res) => {
  const { recieverId, role } = req.body;
  const sender = req.vendor ? req.vendor.vendorId : req.user.userId;
  let [connection] = await chatSchema.find({ members: { $in: [recieverId, sender] } });
  if (!connection) {
    // eslint-disable-next-line no-shadow
    connection = await new chatSchema({
      members: [sender, recieverId],
    }).save();
  }
  let reciever;
  if (role === 'user') {
    reciever = await vendorSchema.findOne({ _id: recieverId });
  } else {
    reciever = await userSchema.findOne({ _id: recieverId });
  }
  return res.json({
    connection, reciever, sender,
  });
};
const saveMessage = async (req, res) => {
  const sender = req.user ? req.user.userId : req.vendor.vendorId;
  const {
    receiver, chatId, data,
  } = req.body;
  try {
    await new messageSchema({
      sender,
      receiver,
      chatId,
      text: data,
    }).save();
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
    });
  }
};

const getChatList = async (req, res) => {
  const id = req.vendor ? req.vendor.vendorId : req.user.userId;
  const connections = await chatSchema.find({ members: { $in: [id] } });
  const chats = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < connections.length; i++) {
    const reciever = connections[i].members[0] !== id
      ? connections[i].members[0]
      : connections[i].members[1];
    const profile = await vendorSchema.findById(reciever)
                  || await userSchema.findById(reciever);
    chats.push(profile);
  }

  return res.json({
    chats, sender: id,
  });
};
const chatHistory = async (req, res) => {
  const senderId = req.vendor ? req.vendor.vendorId : req.user.userId;

  const { id } = req.query;
  console.log('chat history');
  const chats = await messageSchema.find({ chatId: id }).sort({ createdAt: 1 });
  return res.json({
    chats, sender: senderId,
  });
};
export {
  createConnection, saveMessage, getChatList, chatHistory,
};
