import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customFetch } from '../utils/api';

// Tranzakciók lekérése a backendről
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const data = await customFetch('/transactions');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Új tranzakció hozzáadása
export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (transactionData, { rejectWithValue }) => {
        try {
            const data = await customFetch('/transactions', {
                method: 'POST',
                body: JSON.stringify(transactionData),
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Lekérés állapatai
            .addCase(fetchTransactions.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Hozzáadás állapatai
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default transactionSlice.reducer;