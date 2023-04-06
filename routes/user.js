/* eslint-disable import/extensions */
/* eslint-disable semi */
import express from 'express';
import {
  chatHistory, createConnection, getChatList, saveMessage,
} from '../controller/chatHelper.js';
import {
  activeVendors, vendorDetails,
} from '../controller/vendorController.js';
import {
  allEvents, vendorEventsId, eventDetail, bookingDetails, bookTicket, fetctFirstUpcomingEvent,
} from '../controller/eventHelper.js';
import {
  fetchProfile, userLogin, userRegister, cancelTicket,
} from '../controller/userController.js'

import { userAuth } from '../middleware/authCheck.js';

const router = express.Router();
router.get('/chat-history', userAuth, chatHistory);
router.get('/chat-list', userAuth, getChatList);
router.get('/get-all-vendors', activeVendors);
router.get('/vendor-details', userAuth, vendorDetails);
router.get('/vendor-events', userAuth, vendorEventsId);
router.get('/fetch-active-events', allEvents);
router.get('/event-details', userAuth, eventDetail);
router.get('/booking-details', userAuth, bookingDetails);
router.get('/profile', userAuth, fetchProfile)
router.get('/upcoming-first-event', fetctFirstUpcomingEvent)

router.post('/sign-up', userRegister);
router.post('/sign-in', userLogin);
router.post('/connect-vendor', userAuth, createConnection);
router.post('/send-message', userAuth, saveMessage);
router.post('/book-ticket', userAuth, bookTicket);
router.post('/cancel-ticket', userAuth, cancelTicket)

export default router;
