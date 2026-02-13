import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/reports';

const initialState = {
    salesReport: [],
    inventoryReport: [],
    profitReport: { totalRevenue: 0, totalCost: 0, profit: 0 },
    isLoading: false,
    isError: false,
    message: '',
};

export const getSalesReport = createAsyncThunk('reports/sales', async (_, thunkAPI) => {
    try {
        const response = await api.get(`${API_URL}/sales`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getInventoryReport = createAsyncThunk('reports/inventory', async (_, thunkAPI) => {
    try {
        const response = await api.get(`${API_URL}/inventory`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getProfitReport = createAsyncThunk('reports/profit', async (_, thunkAPI) => {
    try {
        const response = await api.get(`${API_URL}/profit`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        reportReset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Sales Report
            .addCase(getSalesReport.pending, (state) => { state.isLoading = true; })
            .addCase(getSalesReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.salesReport = action.payload;
            })
            .addCase(getSalesReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Inventory Report
            .addCase(getInventoryReport.fulfilled, (state, action) => {
                state.inventoryReport = action.payload;
            })
            // Profit Report
            .addCase(getProfitReport.fulfilled, (state, action) => {
                state.profitReport = action.payload;
            });
    },
});

export const { reportReset } = reportSlice.actions;
export default reportSlice.reducer;
