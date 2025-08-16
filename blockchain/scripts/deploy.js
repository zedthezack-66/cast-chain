const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting DappVotes deployment...");
  
  // Deploy the contract
  const DappVotes = await ethers.getContractFactory("DappVotes");
  const dappVotes = await DappVotes.deploy();
  
  await dappVotes.waitForDeployment();
  
  const contractAddress = await dappVotes.getAddress();
  console.log("✅ DappVotes deployed to:", contractAddress);
  
  // Get the artifact for ABI
  const artifactPath = path.join(__dirname, '../artifacts/contracts/DappVotes.sol/DappVotes.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Prepare the files to copy to frontend
  const addressData = {
    address: contractAddress
  };
  
  const abiData = artifact.abi;
  
  // Define paths
  const frontendContractsDir = path.join(__dirname, '../../src/contracts');
  const addressFilePath = path.join(frontendContractsDir, 'DappVotes.address.json');
  const abiFilePath = path.join(frontendContractsDir, 'DappVotes.abi.json');
  
  // Ensure contracts directory exists
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
    console.log("📁 Created frontend contracts directory");
  }
  
  // Write files
  fs.writeFileSync(addressFilePath, JSON.stringify(addressData, null, 2));
  fs.writeFileSync(abiFilePath, JSON.stringify(abiData, null, 2));
  
  console.log("📄 Contract address saved to:", addressFilePath);
  console.log("📄 Contract ABI saved to:", abiFilePath);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Start the frontend: npm run dev");
  console.log("2. Connect MetaMask to http://127.0.0.1:8545 (Chain ID: 31337)");
  console.log("3. Import a Hardhat account into MetaMask");
  console.log("4. Start creating polls and voting!");
  
  // Display some test account info
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("\n🔑 Deployer account:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "ETH");
  
  // Show first few Hardhat accounts for convenience
  const accounts = await ethers.getSigners();
  console.log("\n👥 Available test accounts (import these into MetaMask):");
  for (let i = 0; i < Math.min(3, accounts.length); i++) {
    const balance = await ethers.provider.getBalance(accounts[i].address);
    console.log(`   ${i + 1}. ${accounts[i].address} (${ethers.formatEther(balance)} ETH)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });