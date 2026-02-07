import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/invoices';

const initialState = {
    invoices: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getInvoices = createAsyncThunk('invoices/getAll', async (params, thunkAPI) => {
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

export const createInvoice = createAsyncThunk('invoices/create', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, data, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getInvoices.pending, (state) => { state.isLoading = true; })
            .addCase(getInvoices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.invoices = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.invoices.unshift(action.payload);
            });
    },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
