import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/customers';

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
        const { page = 0, keyword = '', limit = 10 } = params;
        const response = await api.get(`${API_URL}?page=${page}&keyword=${keyword}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createCustomer = createAsyncThunk('customers/create', async (data, thunkAPI) => {
    try {
        const response = await api.post(API_URL, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
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
