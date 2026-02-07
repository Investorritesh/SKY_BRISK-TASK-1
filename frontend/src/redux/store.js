import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import supplierReducer from './slices/supplierSlice';
import userReducer from './slices/userSlice';
import salesReducer from './slices/salesSlice';
import purchaseReducer from './slices/purchaseSlice';
import grnReducer from './slices/grnSlice';
import invoiceReducer from './slices/invoiceSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        customers: customerReducer,
        suppliers: supplierReducer,
        users: userReducer,
        sales: salesReducer,
        purchase: purchaseReducer,
        grn: grnReducer,
        invoices: invoiceReducer,
        reports: reportReducer,
    },
});
