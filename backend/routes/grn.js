import express from 'express';
import { createGRN, getGRNs } from '../controllers/grnController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getGRNs)
    .post(authorize('admin', 'inventory', 'purchase'), createGRN);

export default router;
