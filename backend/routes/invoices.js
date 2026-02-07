import express from 'express';
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getInvoices)
    .post(authorize('admin', 'sales'), createInvoice);

router.route('/:id').get(getInvoiceById);

export default router;
