# DappVotes - Decentralized Voting Platform

A full-stack decentralized voting application built with React, Vite, Tailwind CSS, Redux Toolkit, Hardhat, Ethers.js v6, and Solidity.

## 🚀 Features

- **Wallet Integration**: Connect with MetaMask to interact with the blockchain
- **Poll Management**: Create, update, and delete polls with time-based voting windows
- **Contest Registration**: Register as a contestant in any active poll
- **Secure Voting**: One vote per address per poll, enforced on-chain
- **Real-time Updates**: Live vote counts and poll status updates
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui components

## 🏗️ Architecture

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Redux Toolkit
- **Smart Contracts**: Solidity ^0.8.20 with OpenZeppelin
- **Development**: Hardhat local blockchain
- **Wallet**: MetaMask integration with Ethers.js v6

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

## 🛠️ Installation & Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd dappvotes
   npm install
   cd blockchain
   npm install
   cd ..
   ```

2. **Start the local blockchain**:
   ```bash
   cd blockchain && npx hardhat node
   ```
   This starts a Hardhat node at `http://127.0.0.1:8545` with Chain ID `31337`.

3. **Deploy the smart contract** (in a new terminal):
   ```bash
   cd blockchain && npx hardhat run scripts/deploy.js --network localhost
   ```
   This deploys the DappVotes contract and automatically copies the ABI and address to the frontend.

4. **Start the frontend**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## 🔧 MetaMask Configuration

1. **Add Hardhat Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account**:
   - Copy a private key from the Hardhat node output
   - Import it into MetaMask
   - The account will have 10,000 ETH for testing

## 📖 Usage Guide

### Creating a Poll
1. Connect your wallet
2. Click "Create Poll" 
3. Fill in poll details (title, description, image URL, start/end times)
4. Confirm the transaction in MetaMask

### Registering as Contestant
1. Navigate to an active poll
2. Click "Join Contest"
3. Enter your name and avatar URL
4. Confirm the transaction

### Voting
1. Go to a poll during its voting period
2. Click "Vote" on your preferred contestant
3. Confirm the transaction
4. You can only vote once per poll

### Managing Your Polls
- Only poll creators can update or delete their polls
- Updates are allowed until the poll ends
- Deleted polls cannot be voted on

## 🏃‍♂️ Development Commands

### Blockchain Commands
```bash
cd blockchain
npm install                   # Install blockchain dependencies
npx hardhat node              # Start local blockchain
npx hardhat compile           # Compile smart contracts
npx hardhat test              # Run contract tests
npx hardhat run scripts/deploy.js --network localhost  # Deploy contracts
```

### Frontend Commands
```bash
npm install                   # Install frontend dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
```

## 📁 Project Structure

```
dappvotes/
├── src/                      # Frontend React application
│   ├── components/           # React components
│   ├── pages/               # Application pages
│   ├── services/            # Blockchain integration
│   ├── store/               # Redux store and slices
│   ├── contracts/           # Auto-generated contract files
│   └── utils/               # Utility functions and types
├── blockchain/              # Hardhat project
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/             # Deployment scripts
│   ├── test/                # Contract tests
│   └── hardhat.config.js    # Hardhat configuration
└── package.json             # Frontend dependencies
```

## 🔐 Smart Contract Details

### DappVotes Contract
- **Network**: Hardhat Local (Chain ID: 31337)
- **Features**: 
  - Time-based voting windows
  - One vote per address enforcement
  - Poll director permissions
  - Contestant registration
  - Vote tracking and counts

### Key Functions
- `createPoll()`: Create a new poll
- `updatePoll()`: Update poll (director only)
- `deletePoll()`: Delete poll (director only)
- `contest()`: Register as contestant
- `vote()`: Cast a vote
- `getPolls()`: Retrieve all active polls
- `getContestants()`: Get poll contestants
- `hasAddressVoted()`: Check if address has voted

## 🧪 Testing

Run the comprehensive test suite:
```bash
cd blockchain && npx hardhat test
```

Tests cover:
- Poll creation, updates, and deletion
- Contest registration
- Voting mechanics and restrictions
- Time window enforcement
- Permission checks
- Edge cases and error handling

## 🔍 Troubleshooting

### Common Issues

1. **MetaMask not connecting**:
   - Ensure you're on the correct network (Chain ID: 31337)
   - Check that Hardhat node is running
   - Try refreshing the page

2. **Transaction failures**:
   - Check if you have enough ETH for gas
   - Verify you're within the poll's voting window
   - Ensure you haven't already voted

3. **Contract not found**:
   - Redeploy the contract: `cd blockchain && npx hardhat run scripts/deploy.js --network localhost`
   - Refresh the frontend

4. **Time-related errors**:
   - Ensure poll start time is in the future
   - Check that end time is after start time
   - Verify current time is within voting window

### Reset Development Environment
```bash
# Stop all processes
# Restart Hardhat node
cd blockchain && npx hardhat node

# Redeploy contracts (in new terminal)
cd blockchain && npx hardhat run scripts/deploy.js --network localhost

# Restart frontend (in new terminal)
npm run dev
```

## 🛡️ Security Features

- **On-chain validation**: All voting rules enforced at contract level
- **Access controls**: Director-only functions for poll management
- **Time constraints**: Voting only allowed within specified windows
- **Double-vote prevention**: Blockchain prevents multiple votes per address
- **Data integrity**: Immutable vote records on blockchain

## 📄 License

This project is licensed under the MIT License.

---

**Happy Voting! 🗳️**
