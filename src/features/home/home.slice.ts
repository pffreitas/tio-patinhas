import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Bucket, Transaction } from '../../models';
import BucketRepository from '../../repository/bucket.repo';
import TransactionRepository from '../../repository/transaction.repo';
import TransactionService from '../../service/transaction.service';

type HomePageState = {
    buckets: Bucket[];
    transactions: Transaction[];
    monthTransactions: Transaction[];
    loading: boolean;
    error: string | null;
    loadingSetBucket: string | undefined;
}

const initialState: HomePageState = {
    buckets: [],
    transactions: [],
    monthTransactions: [],
    loading: false,
    error: null,
    loadingSetBucket: undefined,
}

export const fetchBuckets = createAsyncThunk(
    'home/fetchBuckets',
    async (_, { rejectWithValue }) => {
        try {
            const buckets = await BucketRepository.findAll();
            return buckets;
        } catch (e) {
            console.error("Error fetching documents: ", e);
            return rejectWithValue('Failed to fetch data');
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    'home/fetchTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const transactions = await TransactionRepository.findAll();
            return transactions;
        } catch (e) {
            console.error("Error fetching documents: ", e);
            return rejectWithValue('Failed to fetch data');
        }
    }
);

export const fetchTransactionsByMonth = createAsyncThunk(
    'home/fetchTransactionsByMonth',
    async (month: string) => {
        const transactions = await TransactionRepository.findAllByMonth(month);
        return transactions;

    }
);

export const setBucket = createAsyncThunk(
    'home/setBucket',
    async (params: { transactionId: string, bucketSlug: string }) => {
        await TransactionService.setBucket(params.transactionId, params.bucketSlug);
        return params.transactionId;
    }
);

export const deleteTransaction = createAsyncThunk(
    'home/deleteTransaction',
    async (params: { transactionId: string }) => {
        await TransactionRepository.deleteTransaction(params.transactionId);
    }
);

export const home = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuckets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBuckets.fulfilled, (state, action: PayloadAction<Bucket[]>) => {
                state.buckets = action.payload;
                state.loading = false;
            })
            .addCase(fetchBuckets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch buckets';
            });

        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.transactions = action.payload;
                state.loading = false;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch buckets';
            });

        builder
            .addCase(fetchTransactionsByMonth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsByMonth.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.monthTransactions = action.payload;
                state.loading = false;
            })
            .addCase(fetchTransactionsByMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch buckets';
            });

        builder
            .addCase(setBucket.pending, (state, action) => {
                state.loadingSetBucket = action.meta.arg.transactionId;
            })
            .addCase(setBucket.fulfilled, (state) => {
                state.loadingSetBucket = undefined;
            })
            .addCase(setBucket.rejected, (state) => {
                state.loadingSetBucket = undefined;
            });

        builder
            .addCase(deleteTransaction.pending, (state, action) => {
                state.loadingSetBucket = action.meta.arg.transactionId;
            })
            .addCase(deleteTransaction.fulfilled, (state) => {
                state.loadingSetBucket = undefined;
            })
            .addCase(deleteTransaction.rejected, (state) => {
                state.loadingSetBucket = undefined;
            });
    },
})
