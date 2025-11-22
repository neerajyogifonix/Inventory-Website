import { configureStore } from '@reduxjs/toolkit'
import { productSlice } from './slices/productSlice'
import { userSlice } from './slices/userSlice'

export const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    user : userSlice.reducer,
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch