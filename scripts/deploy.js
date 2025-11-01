const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

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
  console.log("TraderRegistry:", traderRegistryAddress);
  console.log("VaultFactory:", vaultFactoryAddress);
  console.log("\nSave these addresses for frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

