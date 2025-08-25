import { ethers } from 'ethers';
import { store } from '@/store';
import { 
  setTransactionLoading,
  setTransactionHash,
  setTransactionSuccess,
  setTransactionError
} from '@/store/slices/transactionSlice';
import { updateContestant } from '@/store/slices/pollsSlice';
import addressJson from '@/contracts/DappVotes.address.json';
import abi from '@/contracts/DappVotes.abi.json';
import { loadContestants } from './blockchain';

const CONTRACT_ADDRESS = addressJson.address;

// Get contract with signer
const getContractWithSigner = async (): Promise<ethers.Contract> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  }
  throw new Error('Provider not available');
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

// Access control: Check if user is admin and poll director
export const validateAdminAccess = (userAccount: string, pollDirector: string): void => {
  const state = store.getState();
  if (!state.wallet.isAdmin) {
    throw new Error('Admin access required');
  }
  if (userAccount.toLowerCase() !== pollDirector.toLowerCase()) {
    throw new Error('Only poll director can perform this action');
  }
};

// Update contestant
export const updateContestantData = async (
  pollId: number,
  contestantId: number,
  name: string,
  image: string
): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  // Input validation
  if (!name || !name.trim()) {
    throw new Error('Contestant name is required');
  }
  
  if (name.trim().length > 50) {
    throw new Error('Contestant name must be less than 50 characters');
  }
  
  // Sanitize input
  const sanitizedName = name.trim().replace(/[<>]/g, '');
  
  await handleTransaction(
    contractWithSigner.updateContestant(pollId, contestantId, sanitizedName, image)
  );
  
  // Refresh contestants
  await loadContestants(pollId);
};

// Delete contestant
export const deleteContestant = async (
  pollId: number,
  contestantId: number
): Promise<void> => {
  const contractWithSigner = await getContractWithSigner();
  
  await handleTransaction(
    contractWithSigner.deleteContestant(pollId, contestantId)
  );
  
  // Refresh contestants after deletion
  await loadContestants(pollId);
};

// Get contestant count for a poll
export const getContestantCount = async (pollId: number): Promise<number> => {
  try {
    const contractWithSigner = await getContractWithSigner();
    const contestants = await contractWithSigner.getContestants(pollId);
    return contestants.length;
  } catch (error) {
    console.error('Failed to get contestant count:', error);
    return 0;
  }
};

// Validate poll can be activated (needs at least 2 candidates)
export const validatePollActivation = async (pollId: number): Promise<void> => {
  const contestantCount = await getContestantCount(pollId);
  if (contestantCount < 2) {
    throw new Error('Poll must have at least 2 candidates before activation');
  }
};