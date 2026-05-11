import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
        },
        logout: (state) => {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;