import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import BucketRepository from '../../repository/bucket.repo';
import { Bucket } from '../../models';
import slugify from 'slugify';
import { trim } from 'lodash';

export const fetchBuckets = createAsyncThunk(
  'plan/fetchBuckets',
  async () => {
    const data = await BucketRepository.findAll();
    return data;
  }
);

export const addBucket = createAsyncThunk(
  'plan/addBucket',
  async (bucket: { id: string | null, group: string, name: string, amount: number, patterns: string }) => {
    await BucketRepository.put({
      id: bucket.id,
      group: trim(bucket.group),
      amount: bucket.amount,
      name: trim(bucket.name),
      slug: slugify(trim(bucket.name), { lower: true }),
      baseline: true,
      patterns: bucket.patterns.split(',').map((pattern: string) => trim(pattern))
    });

    return await BucketRepository.findAll();
  }
);

export const deleteBucket = createAsyncThunk(
  'plan/deleteBucket',
  async (bucketId: string) => {
    await BucketRepository.deleteBucket(bucketId);
    return await BucketRepository.findAll();
  }
);

const initialState: { buckets: Bucket[] } = {
  buckets: [],
};

export const plan = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuckets.fulfilled, (state, action: PayloadAction<Bucket[]>) => {
        state.buckets = action.payload;
      })
      .addCase(addBucket.fulfilled, (state, action: PayloadAction<Bucket[]>) => {
        state.buckets = action.payload;
      })
      .addCase(deleteBucket.fulfilled, (state, action: PayloadAction<Bucket[]>) => {
        state.buckets = action.payload;
      });
  },
});
