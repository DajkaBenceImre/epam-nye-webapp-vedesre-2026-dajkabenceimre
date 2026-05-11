import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import authReducer from './authSlice'; // <-- ÚJ IMPORT

export const store = configureStore({
    reducer: {
        transactions: transactionReducer,
        auth: authReducer, // <-- BEKERÜLT AZ AUTH
    },
});