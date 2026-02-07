import express from 'express';
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSuppliers)
    .post(authorize('admin', 'purchase'), createSupplier);

router.route('/:id')
    .put(authorize('admin', 'purchase'), updateSupplier)
    .delete(authorize('admin'), deleteSupplier);

export default router;
