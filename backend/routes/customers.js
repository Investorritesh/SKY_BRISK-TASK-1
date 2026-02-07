import express from 'express';
import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCustomers)
    .post(authorize('admin', 'sales'), createCustomer);

router.route('/:id')
    .put(authorize('admin', 'sales'), updateCustomer)
    .delete(authorize('admin'), deleteCustomer);

export default router;
