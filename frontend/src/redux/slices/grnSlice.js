import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/grn';

const initialState = {
    grns: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getGRNs = createAsyncThunk('grn/getAll', async (params, thunkAPI) => {
    try {
        const { page = 0, limit = 10 } = params || {};
        const response = await api.get(`${API_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createGRN = createAsyncThunk('grn/create', async (grnData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, grnData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const grnSlice = createSlice({
    name: 'grn',
    initialState,
    reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
    extraReducers: (builder) => {
        builder
            .addCase(getGRNs.pending, (state) => { state.isLoading = true; })
            .addCase(getGRNs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.grns = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
            })
            .addCase(createGRN.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.grns.unshift(action.payload);
            });
    },
});

export const { reset } = grnSlice.actions;
export default grnSlice.reducer;
