import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PollStruct, ContestantStruct } from '@/utils/types';

interface ModalsState {
  createPoll: boolean;
  updatePoll: boolean;
  deletePoll: boolean;
  addContestant: boolean;
  updateContestant: boolean;
  deleteContestant: boolean;
  selectedPoll: PollStruct | null;
  selectedContestant: ContestantStruct | null;
}

const initialState: ModalsState = {
  createPoll: false,
  updatePoll: false,
  deletePoll: false,
  addContestant: false,
  updateContestant: false,
  deleteContestant: false,
  selectedPoll: null,
  selectedContestant: null,
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
    openUpdatePoll: (state, action: PayloadAction<PollStruct>) => {
      state.updatePoll = true;
      state.selectedPoll = action.payload;
    },
    closeUpdatePoll: (state) => {
      state.updatePoll = false;
      state.selectedPoll = null;
    },
    openDeletePoll: (state, action: PayloadAction<PollStruct>) => {
      state.deletePoll = true;
      state.selectedPoll = action.payload;
    },
    closeDeletePoll: (state) => {
      state.deletePoll = false;
      state.selectedPoll = null;
    },
    openAddContestant: (state, action: PayloadAction<PollStruct>) => {
      state.addContestant = true;
      state.selectedPoll = action.payload;
    },
    closeAddContestant: (state) => {
      state.addContestant = false;
      state.selectedPoll = null;
    },
    openUpdateContestant: (state, action: PayloadAction<ContestantStruct>) => {
      state.updateContestant = true;
      state.selectedContestant = action.payload;
    },
    closeUpdateContestant: (state) => {
      state.updateContestant = false;
      state.selectedContestant = null;
    },
    openDeleteContestant: (state, action: PayloadAction<ContestantStruct>) => {
      state.deleteContestant = true;
      state.selectedContestant = action.payload;
    },
    closeDeleteContestant: (state) => {
      state.deleteContestant = false;
      state.selectedContestant = null;
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
  openAddContestant,
  closeAddContestant,
  openUpdateContestant,
  closeUpdateContestant,
  openDeleteContestant,
  closeDeleteContestant,
} = modalsSlice.actions;

export default modalsSlice.reducer;