const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying Mock ERC20 tokens with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceEth = ethers.formatEther(balance);
  console.log("Account balance:", balanceEth, "ETH");
  
  if (balance === 0n) {
    throw new Error("Insufficient balance! Please add ETH for gas fees.");
  }

  const networkName = network.chainId === 534352n ? "Scroll Mainnet" : 
                      network.chainId === 534351n ? "Scroll Sepolia" : 
                      "Unknown Network";
  console.log("Network:", networkName, "(Chain ID:", network.chainId.toString() + ")\n");

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const totalSupply = ethers.parseEther("10000000"); // 10M tokens con 18 decimales

  // Deploy Mock USDC
  console.log("Deploying Mock USDC...");
  const mockUSDC = await MockERC20.deploy("Mata USDC", "USDC", totalSupply);
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ Mock USDC deployed to:", mockUSDCAddress);

  // Deploy Mock USDT
  console.log("\nDeploying Mock USDT...");
  const mockUSDT = await MockERC20.deploy("Mata USDT", "USDT", totalSupply);
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log("✅ Mock USDT deployed to:", mockUSDTAddress);

  // Deploy Mock DAI
  console.log("\nDeploying Mock DAI...");
  const mockDAI = await MockERC20.deploy("Mata DAI", "DAI", totalSupply);
  await mockDAI.waitForDeployment();
  const mockDAIAddress = await mockDAI.getAddress();
  console.log("✅ Mock DAI deployed to:", mockDAIAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", networkName);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nToken Addresses:");
  console.log("Mock USDC:", mockUSDCAddress);
  console.log("Mock USDT:", mockUSDTAddress);
  console.log("Mock DAI:", mockDAIAddress);
  
  console.log("\n📝 Add these to your .env file:");
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${mockUSDCAddress}`);
  console.log(`NEXT_PUBLIC_USDT_ADDRESS=${mockUSDTAddress}`);
  console.log(`NEXT_PUBLIC_DAI_ADDRESS=${mockDAIAddress}`);

  console.log("\n💡 You now have 10,000,000 of each token in your deployer account!");
  console.log("💡 Use the transfer() function to send tokens to other addresses.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });