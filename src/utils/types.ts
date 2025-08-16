// Type definitions for DappVotes

export interface PollStruct {
  id: number;
  image: string;
  title: string;
  description: string;
  totalVotes: number;
  totalContestants: number;
  deleted: boolean;
  director: string;
  startTime: number;
  endTime: number;
  createdAt: number;
}

export interface ContestantStruct {
  id: number;
  image: string;
  name: string;
  voter: string;
  votes: number;
  voters: string[];
}

export interface WalletState {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export interface PollsState {
  polls: PollStruct[];
  currentPoll: PollStruct | null;
  contestants: ContestantStruct[];
  loading: boolean;
  error: string | null;
}

export interface ModalsState {
  createPoll: boolean;
  updatePoll: boolean;
  deletePoll: boolean;
  contest: boolean;
  selectedPollId: number | null;
}

export interface TransactionState {
  loading: boolean;
  hash: string | null;
  error: string | null;
}

export interface GlobalState {
  wallet: WalletState;
  polls: PollsState;
  modals: ModalsState;
  transaction: TransactionState;
}

export interface CreatePollData {
  image: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface UpdatePollData extends CreatePollData {
  id: number;
}

export interface ContestData {
  pollId: number;
  image: string;
  name: string;
}

export interface VoteData {
  pollId: number;
  contestantId: number;
}