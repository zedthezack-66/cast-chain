import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import pollsReducer from './slices/pollsSlice';
import modalsReducer from './slices/modalsSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    polls: pollsReducer,
    modals: modalsReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;