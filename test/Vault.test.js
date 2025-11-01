const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Vault System", function () {
  // Deploy mock ERC20 token for testing
  async function deployMockERC20() {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("Test Token", "TTK", ethers.parseEther("1000000"));
    return { mockToken };
  }

  // Deploy Vault, Factory and Registry
  async function deployContractsFixture() {
    const [owner, trader, otherUser] = await ethers.getSigners();

    // Deploy Mock ERC20
    const { mockToken } = await deployMockERC20();

    // Deploy TraderRegistry
    const TraderRegistry = await ethers.getContractFactory("TraderRegistry");
    const traderRegistry = await TraderRegistry.deploy();

    // Deploy VaultFactory
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const vaultFactory = await VaultFactory.deploy();

    return { owner, trader, otherUser, mockToken, traderRegistry, vaultFactory };
  }

  describe("Vault Creation", function () {
    it("Should create a vault successfully", async function () {
      const { owner, trader, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      await expect(vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress()))
        .to.emit(vaultFactory, "VaultCreated");

      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      expect(vaultAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("Should revert when creating vault with zero address trader", async function () {
      const { mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      await expect(
        vaultFactory.createVault(ethers.ZeroAddress, await mockToken.getAddress())
      ).to.be.revertedWith("Invalid trader address");
    });
  });

  describe("Vault Deposits", function () {
    it("Should allow owner to deposit funds", async function () {
      const { owner, trader, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      // Create vault
      await vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress());
      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      const Vault = await ethers.getContractFactory("Vault");
      const vault = Vault.attach(vaultAddress);

      // Mint tokens to owner
      const depositAmount = ethers.parseEther("1000");
      await mockToken.mint(await owner.getAddress(), depositAmount);
      await mockToken.approve(vaultAddress, depositAmount);

      // Deposit
      await expect(vault.deposit(depositAmount))
        .to.emit(vault, "Deposited")
        .withArgs(await owner.getAddress(), depositAmount);

      const vaultData = await vault.vaultData();
      expect(vaultData.initialAmount).to.equal(depositAmount);
      expect(vaultData.currentBalance).to.equal(depositAmount);
    });

    it("Should revert when non-owner tries to deposit", async function () {
      const { trader, otherUser, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      await vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress());
      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      const Vault = await ethers.getContractFactory("Vault");
      const vault = Vault.attach(vaultAddress);

      const depositAmount = ethers.parseEther("1000");
      await mockToken.mint(await otherUser.getAddress(), depositAmount);
      await mockToken.connect(otherUser).approve(vaultAddress, depositAmount);

      await expect(vault.connect(otherUser).deposit(depositAmount))
        .to.be.reverted;
    });
  });

  describe("Trade Execution", function () {
    it("Should allow trader to execute trades", async function () {
      const { owner, trader, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      // Create vault and deposit
      await vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress());
      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      const Vault = await ethers.getContractFactory("Vault");
      const vault = Vault.attach(vaultAddress);

      const depositAmount = ethers.parseEther("1000");
      await mockToken.mint(await owner.getAddress(), depositAmount);
      await mockToken.approve(vaultAddress, depositAmount);
      await vault.deposit(depositAmount);

      // Execute buy trade
      const tradeAmount = ethers.parseEther("100");
      await expect(vault.connect(trader).executeTrade(true, tradeAmount, ethers.parseEther("1")))
        .to.emit(vault, "TradeExecuted");

      const vaultData = await vault.vaultData();
      expect(vaultData.currentBalance).to.equal(depositAmount - tradeAmount);
    });

    it("Should revert when non-trader tries to execute trade", async function () {
      const { owner, trader, otherUser, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      await vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress());
      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      const Vault = await ethers.getContractFactory("Vault");
      const vault = Vault.attach(vaultAddress);

      const depositAmount = ethers.parseEther("1000");
      await mockToken.mint(await owner.getAddress(), depositAmount);
      await mockToken.approve(vaultAddress, depositAmount);
      await vault.deposit(depositAmount);

      await expect(vault.connect(otherUser).executeTrade(true, ethers.parseEther("100"), ethers.parseEther("1")))
        .to.be.revertedWith("Only trader can execute trades");
    });
  });

  describe("Vault Withdrawal", function () {
    it("Should allow owner to withdraw after completion", async function () {
      const { owner, trader, mockToken, vaultFactory } = await loadFixture(deployContractsFixture);

      await vaultFactory.createVault(await trader.getAddress(), await mockToken.getAddress());
      const vaultId = 0;
      const vaultAddress = await vaultFactory.vaultAddresses(vaultId);
      const Vault = await ethers.getContractFactory("Vault");
      const vault = Vault.attach(vaultAddress);

      const depositAmount = ethers.parseEther("1000");
      await mockToken.mint(await owner.getAddress(), depositAmount);
      await mockToken.approve(vaultAddress, depositAmount);
      await vault.deposit(depositAmount);

      // Complete vault
      await vault.connect(trader).completeVault();

      // Withdraw
      await expect(vault.withdraw())
        .to.emit(vault, "Withdrawn");

      const vaultData = await vault.vaultData();
      expect(vaultData.currentBalance).to.equal(0);
    });
  });

  describe("TraderRegistry", function () {
    it("Should register a new trader", async function () {
      const { trader, traderRegistry } = await loadFixture(deployContractsFixture);

      await expect(traderRegistry.registerTrader(await trader.getAddress()))
        .to.emit(traderRegistry, "TraderRegistered")
        .withArgs(await trader.getAddress());

      const traderInfo = await traderRegistry.getTraderInfo(await trader.getAddress());
      expect(traderInfo.isRegistered).to.be.true;
      expect(traderInfo.reputationScore).to.equal(100);
    });

    it("Should update trader reputation", async function () {
      const { trader, traderRegistry } = await loadFixture(deployContractsFixture);

      await traderRegistry.registerTrader(await trader.getAddress());
      await traderRegistry.updateReputation(
        await trader.getAddress(),
        ethers.parseEther("50"), // positive performance
        ethers.parseEther("1000")
      );

      const traderInfo = await traderRegistry.getTraderInfo(await trader.getAddress());
      expect(traderInfo.reputationScore).to.be.greaterThan(100);
    });
  });
});

