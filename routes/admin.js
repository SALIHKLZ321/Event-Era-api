/* eslint-disable import/extensions */
import express from 'express';
import adminLogin from '../controller/adminController.js';
import {
  nonVerified, fetchAllVendors, blockVendor, unblockVendor, verifyVendor, vendorEvents,
} from '../controller/vendorController.js';
import { allEvents } from '../controller/eventHelper.js';
// import { adminAuth } from '../middleware/authCheck.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/non-verified-vendor', nonVerified);
router.get('/fetch-vendors', fetchAllVendors);
router.get('/fetch-all-events', allEvents);
router.get('/fetch-vendors-event', vendorEvents);

router.patch('/block-vendor', blockVendor);
router.patch('/unblock-vendor', unblockVendor);
router.patch('/verify-vendor', verifyVendor);
export default router;
