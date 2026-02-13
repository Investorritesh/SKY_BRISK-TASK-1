import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/users';

const initialState = {
    users: [],
    total: 0,
    page: 0,
    limit: 10,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getUsers = createAsyncThunk('users/getAll', async (params, thunkAPI) => {
    try {
        const { page = 0, limit = 10 } = params || {};
        const response = await api.get(`${API_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, userData }, thunkAPI) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.map((u) => u._id === action.payload._id ? action.payload : u);
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.filter((u) => u._id !== action.payload);
            });
    },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
