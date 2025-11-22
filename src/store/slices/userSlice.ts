
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  name: string;
  email: string;
  password: string;
}

export interface user {
  isAuthenticated: boolean;
  token: string;
  userInfo: UserInfo | null;
}

const initialState: user = {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || '',
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; userInfo: UserInfo }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = '';
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    },  
  },
})




export const { login, logout } = userSlice.actions

export default userSlice.reducer