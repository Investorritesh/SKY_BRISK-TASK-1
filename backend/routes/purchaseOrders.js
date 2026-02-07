import express from 'express';
import {
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
} from '../controllers/purchaseOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPurchaseOrders)
    .post(authorize('admin', 'purchase'), createPurchaseOrder);

router.route('/:id')
    .put(authorize('admin', 'purchase'), updatePurchaseOrder);

export default router;
