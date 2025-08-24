import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '@/utils/types';

const initialState: WalletState = {
  account: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setWalletConnected: (state, action: PayloadAction<{ account: string; chainId: number }>) => {
      state.account = action.payload.account;
      state.chainId = action.payload.chainId;
      state.isConnected = true;
      state.isConnecting = false;
    },
    setWalletDisconnected: (state) => {
      state.account = null;
      state.chainId = null;
      state.isConnected = false;
      state.isConnecting = false;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
  },
});

export const { setConnecting, setWalletConnected, setWalletDisconnected, setChainId } = walletSlice.actions;
export default walletSlice.reducer;