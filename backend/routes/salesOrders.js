import express from 'express';
import {
    getSalesOrders,
    createSalesOrder,
    updateSalesOrderStatus,
} from '../controllers/salesOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSalesOrders)
    .post(authorize('admin', 'sales'), createSalesOrder);

router.route('/:id/status')
    .put(authorize('admin', 'sales'), updateSalesOrderStatus);

export default router;
