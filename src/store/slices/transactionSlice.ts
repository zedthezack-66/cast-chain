import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionState } from '@/utils/types';

const initialState: TransactionState = {
  loading: false,
  hash: null,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
        state.hash = null;
      }
    },
    setTransactionHash: (state, action: PayloadAction<string>) => {
      state.hash = action.payload;
    },
    setTransactionSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    setTransactionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.hash = null;
    },
    clearTransaction: (state) => {
      state.loading = false;
      state.hash = null;
      state.error = null;
    },
  },
});

export const {
  setTransactionLoading,
  setTransactionHash,
  setTransactionSuccess,
  setTransactionError,
  clearTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;