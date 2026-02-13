import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/suppliers';

const initialState = {
    suppliers: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    total: 0,
};

export const getSuppliers = createAsyncThunk('suppliers/getAll', async (params, thunkAPI) => {
    try {
        const { page = 0, keyword = '', limit = 10 } = params;
        const response = await api.get(`${API_URL}?page=${page}&keyword=${keyword}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createSupplier = createAsyncThunk('suppliers/create', async (data, thunkAPI) => {
    try {
        const response = await api.post(API_URL, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const supplierSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getSuppliers.pending, (state) => { state.isLoading = true; })
            .addCase(getSuppliers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.suppliers = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.suppliers.unshift(action.payload);
            });
    },
});

export const { reset } = supplierSlice.actions;
export default supplierSlice.reducer;
