import { configureStore } from '@reduxjs/toolkit'
import { home } from '../features/home/home.slice'
import { plan } from '../features/plan/plan.slice'
import { transactions } from '../features/transactions/transactions.slice';

export const store = configureStore({
  reducer: {
    home: home.reducer,
    plan: plan.reducer,
    transactions: transactions.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch