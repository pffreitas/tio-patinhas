import { configureStore } from '@reduxjs/toolkit'
import { home } from '../features/home/home.slice'

export const store = configureStore({
  reducer: {
    home: home.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch