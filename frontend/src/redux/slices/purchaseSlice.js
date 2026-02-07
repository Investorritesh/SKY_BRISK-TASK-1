import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/purchase-orders';

const initialState = {
    orders: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getPurchaseOrders = createAsyncThunk('purchase/getAll', async (params, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const { page = 0, limit = 10 } = params || {};
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createPurchaseOrder = createAsyncThunk('purchase/create', async (orderData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, orderData, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
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
