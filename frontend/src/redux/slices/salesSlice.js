import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/sales-orders';

const initialState = {
    orders: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getSalesOrders = createAsyncThunk('sales/getAll', async (params, thunkAPI) => {
    try {
        const { page = 0, limit = 10 } = params || {};
        const response = await api.get(`${API_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createSalesOrder = createAsyncThunk('sales/create', async (orderData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getSalesOrders.pending, (state) => { state.isLoading = true; })
            .addCase(getSalesOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createSalesOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders.unshift(action.payload);
            });
    },
});

export const { reset } = salesSlice.actions;
export default salesSlice.reducer;
