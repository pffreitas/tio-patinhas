import { PayloadAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Transaction } from '../../models';
import TransactionService from '../../service/transaction.service';
import { chain } from 'lodash';
import { act } from 'react-dom/test-utils';

type TransactionsPageState = {
    transactions: Transaction[];
    parsedTransactions: Transaction[] | undefined;
    loading: boolean;
}

const initialState: TransactionsPageState = {
    transactions: [],
    parsedTransactions: undefined,
    loading: false,
}

export const pasteTransactions = createAsyncThunk(
    'transactions/pasteTransactions',
    async (params: { data: string }) => {
        return await TransactionService.parseCvsString(params.data);
    }
);

export const saveTransactions = createAsyncThunk(
    'transactions/saveTransactions',
    async (params: { transactions: Transaction[] }) => {
        return await TransactionService.saveTransactions(params.transactions);
    }
);

export const transactions = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        deleteParsedTransaction: (state, action: PayloadAction<{ hashcode: string }>) => {
            const transaction = chain(state.parsedTransactions)
                .find(t => t.hashcode === action.payload.hashcode)
                .value();

            if (transaction) {
                transaction.deleted = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(pasteTransactions.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(pasteTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.parsedTransactions = action.payload;
            })
            .addCase(pasteTransactions.rejected, (state) => {
                state.loading = true;
            });

        builder
            .addCase(saveTransactions.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(saveTransactions.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(saveTransactions.rejected, (state) => {
                state.loading = true;
            });
    },
})

export const { deleteParsedTransaction } = transactions.actions;

