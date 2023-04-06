/* eslint-disable import/extensions */
import express from 'express';
import {
  vendorRegister, vendorLogin, vendorProfile, profilePicUpload,
} from '../controller/vendorController.js';
import {
  chatHistory, createConnection, getChatList, saveMessage,
} from '../controller/chatHelper.js';

import {
  eventDetail, eventUpload, vendorEvents, updateEvent, graphValues, eventTickets,
} from '../controller/eventHelper.js';
import { vendorAuth } from '../middleware/authCheck.js';

const router = express.Router();

router.post('/sign-up', vendorRegister);
router.post('/login', vendorLogin);
router.post('/event-upload', vendorAuth, eventUpload);
router.post('/send-message', vendorAuth, saveMessage);
router.post('/connect-user', vendorAuth, createConnection);

router.patch('/profile-pic-upload', vendorAuth, profilePicUpload);

router.put('/event-update', vendorAuth, updateEvent);

router.get('/chat-list', vendorAuth, getChatList);
router.get('/chat-history', vendorAuth, chatHistory);
router.get('/events', vendorAuth, vendorEvents);
router.get('/event-detail', vendorAuth, eventDetail);
router.get('/profile', vendorAuth, vendorProfile);
router.get('/graph-values', vendorAuth, graphValues);
router.get('/event-tickets', vendorAuth, eventTickets);

export default router;
