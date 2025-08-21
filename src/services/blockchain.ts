import { ethers } from 'ethers';
import { store } from '@/store';
import { 
  setWalletConnected, 
  setWalletDisconnected, 
  setConnecting,
  setChainId 
} from '@/store/slices/walletSlice';
import {
  setTransactionLoading,
  setTransactionHash,
  setTransactionSuccess,
  setTransactionError
} from '@/store/slices/transactionSlice';
import {
  setPolls,
  setCurrentPoll,
  setContestants,
  addPoll,
  updatePoll as updatePollInStore,
  removePoll,
  addContestant,
  updateContestant,
  setError
} from '@/store/slices/pollsSlice';
import { CreatePollData, UpdatePollData, ContestData, VoteData, PollStruct, ContestantStruct } from '@/utils/types';
import addressJson from '@/contracts/DappVotes.address.json';
import abi from '@/contracts/DappVotes.abi.json';

const CONTRACT_ADDRESS = addressJson.address;
const HARDHAT_CHAIN_ID = 31337;

declare global {
  interface Window {
    ethereum?: any;
  }
}

let provider: ethers.BrowserProvider | null = null;
let contract: ethers.Contract | null = null;

// Initialize provider and contract
export const initializeProvider = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  }
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
};

// Connect wallet
export const connectWallet = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    store.dispatch(setConnecting(true));
    await initializeProvider();

    if (!provider) throw new Error('Provider not initialized');

    // Request permissions to show account selection dialog
    await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
    
    const accounts = await provider.send('eth_requestAccounts', []);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    store.dispatch(setWalletConnected({
      account: accounts[0],
      chainId
    }));

    // Check if we're on the correct network
    if (chainId !== HARDHAT_CHAIN_ID) {
      await switchToHardhatNetwork();
    }
  } catch (error: any) {
    store.dispatch(setWalletDisconnected());
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

// Switch to Hardhat network
export const switchToHardhatNetwork = async (): Promise<void> => {
  if (!provider) throw new Error('Provider not initialized');

  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}` }
    ]);
  } catch (error: any) {
    // If the network is not added, add it
    if (error.code === 4902) {
      await provider.send('wallet_addEthereumChain', [
        {
          chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}`,
          chainName: 'Hardhat Local',
          rpcUrls: ['http://127.0.0.1:8545'],
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          }
        }
      ]);
    } else {
      throw error;
    }
  }
};

// Disconnect wallet
export const disconnectWallet = (): void => {
  store.dispatch(setWalletDisconnected());
};

// Get signer
const getSigner = async (): Promise<ethers.JsonRpcSigner> => {
  if (!provider) {
    await initializeProvider();
  }
  if (!provider) throw new Error('Provider not initialized');
  
  return await provider.getSigner();
};

// Get contract with signer
const getContractWithSigner = async (): Promise<ethers.Contract> => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

// Helper function to handle transactions
const handleTransaction = async (
  txPromise: Promise<any>,
  successMessage?: string
): Promise<any> => {
  try {
    store.dispatch(setTransactionLoading(true));
    
    const tx = await txPromise;
    store.dispatch(setTransactionHash(tx.hash));
    
    const receipt = await tx.wait();
    store.dispatch(setTransactionSuccess());
    
    return receipt;
  } catch (error: any) {
    store.dispatch(setTransactionError(error.message || 'Transaction failed'));
    throw error;
  }
};

// Convert contract poll to our PollStruct
const formatPoll = (poll: any): PollStruct => ({
  id: Number(poll.id),
  image: poll.image,
  title: poll.title,
  description: poll.description,
  voteCount: Number(poll.voteCount),
  contestantCount: Number(poll.contestantCount),
  deleted: poll.deleted,
  director: poll.director,
  startsAt: Number(poll.startsAt),
  endsAt: Number(poll.endsAt),
  createdAt: Number(poll.createdAt)
});

// Convert contract contestant to our ContestantStruct
const formatContestant = (contestant: any): ContestantStruct => ({
  id: Number(contestant.id),
  image: contestant.image,
  name: contestant.name,
  account: contestant.account,
  votes: Number(contestant.votes)
});

// Security enhancement for poll creation
export const createPoll = async (data: CreatePollData): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  // Input validation
  if (!data.title || !data.title.trim()) {
    throw new Error('Poll title is required');
  }
  
  if (data.title.trim().length > 100) {
    throw new Error('Poll title must be less than 100 characters');
  }
  
  if (!data.description || !data.description.trim()) {
    throw new Error('Poll description is required');
  }
  
  if (data.description.trim().length > 500) {
    throw new Error('Poll description must be less than 500 characters');
  }
  
  // Validate timestamps
  const now = Math.floor(Date.now() / 1000);
  const startsAt = Math.floor(data.startsAt.getTime() / 1000);
  const endsAt = Math.floor(data.endsAt.getTime() / 1000);
  
  if (startsAt <= now) {
    throw new Error('Poll start time must be in the future');
  }
  
  if (endsAt <= startsAt) {
    throw new Error('Poll end time must be after start time');
  }
  
  if (endsAt - startsAt < 3600) { // At least 1 hour
    throw new Error('Poll must run for at least 1 hour');
  }
  
  // Sanitize inputs
  const sanitizedTitle = data.title.trim().replace(/[<>]/g, '');
  const sanitizedDescription = data.description.trim().replace(/[<>]/g, '');
  
  const receipt = await handleTransaction(
    contractWithSigner.createPoll(
      data.image,
      sanitizedTitle,
      sanitizedDescription,
      startsAt,
      endsAt
    )
  );
  
  // Refresh polls after creation
  await loadPolls();
};

export const updatePoll = async (data: UpdatePollData): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  const startsAt = Math.floor(data.startsAt.getTime() / 1000);
  const endsAt = Math.floor(data.endsAt.getTime() / 1000);
  
  await handleTransaction(
    contractWithSigner.updatePoll(
      data.id,
      data.image,
      data.title,
      data.description,
      startsAt,
      endsAt
    )
  );
  
  // Refresh polls after update
  await loadPolls();
};

export const deletePoll = async (pollId: number): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  await handleTransaction(
    contractWithSigner.deletePoll(pollId)
  );
  
  // Remove from store
  store.dispatch(removePoll(pollId));
};

// Add a security enhancement to contest function
export const contest = async (data: ContestData): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  // Basic input validation
  if (!data.name || !data.name.trim()) {
    throw new Error('Contestant name is required');
  }
  
  if (data.name.trim().length > 50) {
    throw new Error('Contestant name must be less than 50 characters');
  }
  
  // Sanitize input
  const sanitizedName = data.name.trim().replace(/[<>]/g, '');
  
  await handleTransaction(
    contractWithSigner.contest(data.pollId, sanitizedName, data.image)
  );
  
  // Refresh contestants
  await loadContestants(data.pollId);
};

export const vote = async (data: VoteData): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  await handleTransaction(
    contractWithSigner.vote(data.pollId, data.contestantId)
  );
  
  // Refresh contestants and poll
  await loadContestants(data.pollId);
  await loadPoll(data.pollId);
};

// View functions
export const loadPolls = async (): Promise<void> => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    const polls = await contract.getPolls();
    const formattedPolls = polls.map(formatPoll);
    
    store.dispatch(setPolls(formattedPolls));
  } catch (error: any) {
    store.dispatch(setError(error.message || 'Failed to load polls'));
  }
};

export const loadPoll = async (pollId: number): Promise<void> => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    const poll = await contract.getPoll(pollId);
    const formattedPoll = formatPoll(poll);
    
    store.dispatch(setCurrentPoll(formattedPoll));
    store.dispatch(updatePollInStore(formattedPoll));
  } catch (error: any) {
    store.dispatch(setError(error.message || 'Failed to load poll'));
  }
};

export const loadContestants = async (pollId: number): Promise<void> => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    const contestants = await contract.getContestants(pollId);
    const formattedContestants = contestants.map(formatContestant);
    
    store.dispatch(setContestants(formattedContestants));
  } catch (error: any) {
    store.dispatch(setError(error.message || 'Failed to load contestants'));
  }
};

export const hasUserVoted = async (pollId: number, userAddress: string): Promise<boolean> => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    return await contract.hasUserVoted(pollId, userAddress);
  } catch (error: any) {
    console.error('Failed to check vote status:', error);
    return false;
  }
};

export const getCurrentTime = async (): Promise<number> => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    const time = await contract.nowTime();
    return Number(time);
  } catch (error: any) {
    console.error('Failed to get current time:', error);
    return Math.floor(Date.now() / 1000);
  }
};

// Get real platform statistics
export const getRealPlatformStats = async () => {
  try {
    if (!contract) await initializeProvider();
    if (!contract) throw new Error('Contract not initialized');
    
    const polls = await contract.getPolls();
    const currentTime = await getCurrentTime();
    
    let activePolls = 0;
    let totalVotes = 0;
    const uniqueVoters = new Set<string>();
    
    for (const poll of polls) {
      if (!poll.deleted && currentTime >= Number(poll.startsAt) && currentTime <= Number(poll.endsAt)) {
        activePolls++;
      }
      totalVotes += Number(poll.voteCount);
      
      // Get contestants for this poll to count unique voters
      try {
        const contestants = await contract.getContestants(Number(poll.id));
        for (const contestant of contestants) {
          if (Number(contestant.votes) > 0) {
            // In a real implementation, we'd track individual voters
            // For now, we'll estimate based on vote patterns
            for (let i = 0; i < Number(contestant.votes); i++) {
              uniqueVoters.add(`${poll.id}-${contestant.id}-${i}`);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to get contestants for poll ${poll.id}:`, error);
      }
    }
    
    return {
      activePolls,
      totalVotes,
      totalVoters: uniqueVoters.size,
      verificationRate: 100 // Always 100% since all votes are on blockchain
    };
  } catch (error: any) {
    console.error('Failed to get real platform stats:', error);
    // Return fallback stats
    return {
      activePolls: 0,
      totalVotes: 0,
      totalVoters: 0,
      verificationRate: 100
    };
  }
};

// Listen for account and network changes
export const setupEventListeners = (): void => {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        store.dispatch(setWalletDisconnected());
      } else {
        const state = store.getState();
        if (state.wallet.chainId) {
          store.dispatch(setWalletConnected({
            account: accounts[0],
            chainId: state.wallet.chainId
          }));
        }
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      store.dispatch(setChainId(newChainId));
    });
  }
};