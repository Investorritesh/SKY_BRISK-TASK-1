import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const API_URL = `${API_BASE_URL}/customers`;

const initialState = {
    customers: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    total: 0,
};

export const getCustomers = createAsyncThunk('customers/getAll', async (params, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const { page = 0, keyword = '', limit = 10 } = params;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}?page=${page}&keyword=${keyword}&limit=${limit}`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createCustomer = createAsyncThunk('customers/create', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, data, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => { state.isLoading = true; })
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.customers = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.customers.unshift(action.payload);
            });
    },
});

export const { reset } = customerSlice.actions;
export default customerSlice.reducer;
