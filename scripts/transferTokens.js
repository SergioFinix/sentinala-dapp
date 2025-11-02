const { ethers } = require("hardhat");

async function main() {
  // Get parameters from environment variables
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  const RECIPIENT = process.env.RECIPIENT;
  const AMOUNT = process.env.AMOUNT;

  // Validate required parameters
  if (!TOKEN_ADDRESS) {
    throw new Error("TOKEN_ADDRESS environment variable is required");
  }
  if (!RECIPIENT) {
    throw new Error("RECIPIENT environment variable is required");
  }
  if (!AMOUNT) {
    throw new Error("AMOUNT environment variable is required");
  }

  const [sender] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  const networkName = network.chainId === 534352n ? "Scroll Mainnet" : 
                      network.chainId === 534351n ? "Scroll Sepolia" : 
                      `Chain ID ${network.chainId.toString()}`;
  
  console.log("🔷 Token Transfer Script");
  console.log("========================");
  console.log("Network:", networkName);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nFrom:", sender.address);
  console.log("To:", RECIPIENT);
  console.log("Token Address:", TOKEN_ADDRESS);
  console.log("Amount:", AMOUNT, "tokens\n");

  // Validate recipient address
  if (!ethers.isAddress(RECIPIENT)) {
    throw new Error(`Invalid recipient address: ${RECIPIENT}`);
  }
  if (!ethers.isAddress(TOKEN_ADDRESS)) {
    throw new Error(`Invalid token address: ${TOKEN_ADDRESS}`);
  }

  // Check ETH balance for gas
  const ethBalance = await ethers.provider.getBalance(sender.address);
  const ethBalanceEth = ethers.formatEther(ethBalance);
  console.log("💰 ETH Balance for gas:", ethBalanceEth, "ETH");
  
  if (ethBalance === 0n) {
    throw new Error("Insufficient ETH balance for gas fees!");
  }

  // Get ERC20 contract instance
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function name() external view returns (string)",
  ];

  const token = await ethers.getContractAt(ERC20_ABI, TOKEN_ADDRESS);

  // Get token info
  let tokenSymbol, tokenName, decimals;
  try {
    tokenSymbol = await token.symbol();
    tokenName = await token.name();
    decimals = await token.decimals();
  } catch (error) {
    console.log("⚠️  Could not fetch token details, assuming 18 decimals");
    decimals = 18;
    tokenSymbol = "TOKEN";
    tokenName = "Token";
  }

  console.log("\n📊 Token Info:");
  console.log("  Name:", tokenName);
  console.log("  Symbol:", tokenSymbol);
  console.log("  Decimals:", decimals.toString());

  // Get sender's token balance before transfer
  const balanceBefore = await token.balanceOf(sender.address);
  const balanceBeforeFormatted = ethers.formatUnits(balanceBefore, decimals);
  console.log("\n💵 Sender Balance (before):", balanceBeforeFormatted, tokenSymbol);

  // Parse amount with correct decimals
  let amountWei;
  try {
    amountWei = ethers.parseUnits(AMOUNT, decimals);
  } catch (error) {
    throw new Error(`Invalid amount format: ${AMOUNT}. Use a number (e.g., 1000)`);
  }

  // Validate sufficient balance
  if (balanceBefore < amountWei) {
    throw new Error(
      `Insufficient balance! You have ${balanceBeforeFormatted} ${tokenSymbol}, but trying to transfer ${AMOUNT} ${tokenSymbol}`
    );
  }

  // Get recipient balance before
  const recipientBalanceBefore = await token.balanceOf(RECIPIENT);
  const recipientBalanceBeforeFormatted = ethers.formatUnits(recipientBalanceBefore, decimals);

  console.log("📥 Recipient Balance (before):", recipientBalanceBeforeFormatted, tokenSymbol);
  console.log("\n🚀 Transferring", AMOUNT, tokenSymbol, "to", RECIPIENT, "...");

  // Execute transfer
  const tx = await token.transfer(RECIPIENT, amountWei);
  console.log("📝 Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get balances after transfer
  const balanceAfter = await token.balanceOf(sender.address);
  const balanceAfterFormatted = ethers.formatUnits(balanceAfter, decimals);
  
  const recipientBalanceAfter = await token.balanceOf(RECIPIENT);
  const recipientBalanceAfterFormatted = ethers.formatUnits(recipientBalanceAfter, decimals);

  console.log("\n📊 Transfer Summary:");
  console.log("  ✅ Successfully transferred", AMOUNT, tokenSymbol);
  console.log("\n💵 Sender Balance (after):", balanceAfterFormatted, tokenSymbol);
  console.log("📥 Recipient Balance (after):", recipientBalanceAfterFormatted, tokenSymbol);

  // Show explorer link
  const explorerBase = network.chainId === 534352n 
    ? "https://scrollscan.com/tx/"
    : network.chainId === 534351n
    ? "https://sepolia-blockscout.scroll.io/tx/"
    : "";
  
  if (explorerBase) {
    console.log("\n🔗 View transaction:", explorerBase + tx.hash);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });

