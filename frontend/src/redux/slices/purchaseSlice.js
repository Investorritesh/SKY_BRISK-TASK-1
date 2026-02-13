import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/purchase-orders';

const initialState = {
    orders: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getPurchaseOrders = createAsyncThunk('purchase/getAll', async (params, thunkAPI) => {
    try {
        const { page = 0, limit = 10 } = params || {};
        const response = await api.get(`${API_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createPurchaseOrder = createAsyncThunk('purchase/create', async (orderData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseOrders.pending, (state) => { state.isLoading = true; })
            .addCase(getPurchaseOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createPurchaseOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders.unshift(action.payload);
            });
    },
});

export const { reset } = purchaseSlice.actions;
export default purchaseSlice.reducer;
