import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/grn';

const initialState = {
    grns: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getGRNs = createAsyncThunk('grn/getAll', async (params, thunkAPI) => {
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

export const createGRN = createAsyncThunk('grn/create', async (grnData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, grnData, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
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
