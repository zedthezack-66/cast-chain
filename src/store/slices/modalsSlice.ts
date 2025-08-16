import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalsState } from '@/utils/types';

const initialState: ModalsState = {
  createPoll: false,
  updatePoll: false,
  deletePoll: false,
  contest: false,
  selectedPollId: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openCreatePoll: (state) => {
      state.createPoll = true;
    },
    closeCreatePoll: (state) => {
      state.createPoll = false;
    },
    openUpdatePoll: (state, action: PayloadAction<number>) => {
      state.updatePoll = true;
      state.selectedPollId = action.payload;
    },
    closeUpdatePoll: (state) => {
      state.updatePoll = false;
      state.selectedPollId = null;
    },
    openDeletePoll: (state, action: PayloadAction<number>) => {
      state.deletePoll = true;
      state.selectedPollId = action.payload;
    },
    closeDeletePoll: (state) => {
      state.deletePoll = false;
      state.selectedPollId = null;
    },
    openContest: (state, action: PayloadAction<number>) => {
      state.contest = true;
      state.selectedPollId = action.payload;
    },
    closeContest: (state) => {
      state.contest = false;
      state.selectedPollId = null;
    },
    closeAllModals: (state) => {
      state.createPoll = false;
      state.updatePoll = false;
      state.deletePoll = false;
      state.contest = false;
      state.selectedPollId = null;
    },
  },
});

export const {
  openCreatePoll,
  closeCreatePoll,
  openUpdatePoll,
  closeUpdatePoll,
  openDeletePoll,
  closeDeletePoll,
  openContest,
  closeContest,
  closeAllModals,
} = modalsSlice.actions;

export default modalsSlice.reducer;