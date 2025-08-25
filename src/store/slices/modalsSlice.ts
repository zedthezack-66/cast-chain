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
  // Backward compatibility
  contest: boolean;
  selectedPollId: number | null;
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
  // Backward compatibility
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
    openUpdatePoll: (state, action: PayloadAction<PollStruct | number>) => {
      state.updatePoll = true;
      if (typeof action.payload === 'number') {
        // Backward compatibility
        state.selectedPollId = action.payload;
      } else {
        state.selectedPoll = action.payload;
      }
    },
    closeUpdatePoll: (state) => {
      state.updatePoll = false;
      state.selectedPoll = null;
      state.selectedPollId = null;
    },
    openDeletePoll: (state, action: PayloadAction<PollStruct | number>) => {
      state.deletePoll = true;
      if (typeof action.payload === 'number') {
        // Backward compatibility
        state.selectedPollId = action.payload;
      } else {
        state.selectedPoll = action.payload;
      }
    },
    closeDeletePoll: (state) => {
      state.deletePoll = false;
      state.selectedPoll = null;
      state.selectedPollId = null;
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
    // Backward compatibility functions
    openContest: (state, action: PayloadAction<number>) => {
      state.contest = true;
      state.addContestant = true;
      state.selectedPollId = action.payload;
    },
    closeContest: (state) => {
      state.contest = false;
      state.addContestant = false;
      state.selectedPollId = null;
      state.selectedPoll = null;
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
  // Backward compatibility exports
  openContest,
  closeContest,
} = modalsSlice.actions;

export default modalsSlice.reducer;