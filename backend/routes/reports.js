import express from 'express';
import {
    getSalesReport,
    getInventoryReport,
    getProfitReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'inventory'));

router.get('/sales', getSalesReport);
router.get('/inventory', getInventoryReport);
router.get('/profit', getProfitReport);

export default router;
