import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PollsState, PollStruct, ContestantStruct } from '@/utils/types';

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  contestants: [],
  loading: false,
  error: null,
};

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPolls: (state, action: PayloadAction<PollStruct[]>) => {
      state.polls = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPoll: (state, action: PayloadAction<PollStruct>) => {
      state.polls.unshift(action.payload);
    },
    updatePoll: (state, action: PayloadAction<PollStruct>) => {
      const index = state.polls.findIndex(poll => poll.id === action.payload.id);
      if (index !== -1) {
        state.polls[index] = action.payload;
      }
      if (state.currentPoll?.id === action.payload.id) {
        state.currentPoll = action.payload;
      }
    },
    removePoll: (state, action: PayloadAction<number>) => {
      state.polls = state.polls.filter(poll => poll.id !== action.payload);
      if (state.currentPoll?.id === action.payload) {
        state.currentPoll = null;
      }
    },
    setCurrentPoll: (state, action: PayloadAction<PollStruct | null>) => {
      state.currentPoll = action.payload;
    },
    setContestants: (state, action: PayloadAction<ContestantStruct[]>) => {
      state.contestants = action.payload;
    },
    addContestant: (state, action: PayloadAction<ContestantStruct>) => {
      state.contestants.push(action.payload);
    },
    updateContestant: (state, action: PayloadAction<ContestantStruct>) => {
      const index = state.contestants.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contestants[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPolls,
  addPoll,
  updatePoll,
  removePoll,
  setCurrentPoll,
  setContestants,
  addContestant,
  updateContestant,
  clearError,
} = pollsSlice.actions;

export default pollsSlice.reducer;