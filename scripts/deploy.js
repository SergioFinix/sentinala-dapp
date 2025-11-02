const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceEth = ethers.formatEther(balance);
  console.log("Account balance:", balanceEth, "ETH");
  
  // Check if we have sufficient balance
  if (balance === 0n) {
    throw new Error("Insufficient balance! Please add ETH to your account for gas fees.");
  }

  // Detect network
  const networkName = network.chainId === 534352n ? "Scroll Mainnet" : 
                      network.chainId === 534351n ? "Scroll Sepolia" : 
                      "Unknown Network";
  console.log("Network:", networkName, "(Chain ID:", network.chainId.toString() + ")");

  // Deploy TraderRegistry
  console.log("\nDeploying TraderRegistry...");
  const TraderRegistry = await ethers.getContractFactory("TraderRegistry");
  const traderRegistry = await TraderRegistry.deploy();
  await traderRegistry.waitForDeployment();
  const traderRegistryAddress = await traderRegistry.getAddress();
  console.log("TraderRegistry deployed to:", traderRegistryAddress);

  // Deploy VaultFactory
  console.log("\nDeploying VaultFactory...");
  const VaultFactory = await ethers.getContractFactory("VaultFactory");
  const vaultFactory = await VaultFactory.deploy();
  await vaultFactory.waitForDeployment();
  const vaultFactoryAddress = await vaultFactory.getAddress();
  console.log("VaultFactory deployed to:", vaultFactoryAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", networkName);
  console.log("Chain ID:", network.chainId.toString());
  console.log("TraderRegistry:", traderRegistryAddress);
  console.log("VaultFactory:", vaultFactoryAddress);
  console.log("\n✅ Save these addresses for frontend configuration!");
  
  // Show verification commands if not hardhat network
  if (network.chainId !== 31337n) {
    const networkFlag = network.chainId === 534352n ? "scroll" : "scrollSepolia";
    console.log("\n📝 To verify contracts on explorer, run:");
    console.log(`npx hardhat verify --network ${networkFlag} ${traderRegistryAddress}`);
    console.log(`npx hardhat verify --network ${networkFlag} ${vaultFactoryAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

