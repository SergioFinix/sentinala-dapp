// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum VaultStatus {
        Active,
        Completed,
        Paused
    }

    struct VaultData {
        uint256 id;
        address owner;
        address trader;
        uint256 initialAmount;
        uint256 currentBalance;
        address stablecoinAddress;
        VaultStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 totalReturns;
    }

    struct Trade {
        uint256 id;
        bool isBuy;
        uint256 amount;
        uint256 timestamp;
        uint256 price;
    }

    VaultData public vaultData;
    Trade[] public trades;
    IERC20 private immutable stablecoin;

    event Deposited(address indexed owner, uint256 amount);
    event TradeExecuted(
        uint256 indexed tradeId,
        bool isBuy,
        uint256 amount,
        uint256 timestamp
    );
    event Withdrawn(address indexed owner, uint256 amount, uint256 returnsAmount);
    event VaultPaused(address indexed vault);
    event VaultResumed(address indexed vault);

    modifier onlyOwnerOrTrader() {
        require(
            msg.sender == vaultData.owner || msg.sender == vaultData.trader,
            "Not authorized"
        );
        _;
    }

    modifier onlyWhenActive() {
        require(vaultData.status == VaultStatus.Active, "Vault not active");
        _;
    }

    constructor(
        uint256 _id,
        address _owner,
        address _trader,
        address _stablecoin
    ) Ownable(_owner) ReentrancyGuard() {
        stablecoin = IERC20(_stablecoin);
        vaultData = VaultData({
            id: _id,
            owner: _owner,
            trader: _trader,
            initialAmount: 0,
            currentBalance: 0,
            stablecoinAddress: _stablecoin,
            status: VaultStatus.Active,
            startTime: block.timestamp,
            endTime: 0,
            totalReturns: 0
        });
    }

    function deposit(uint256 amount) external onlyOwner onlyWhenActive nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            vaultData.currentBalance == 0,
            "Deposit already made"
        );

        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        vaultData.initialAmount = amount;
        vaultData.currentBalance = amount;

        emit Deposited(msg.sender, amount);
    }

    function executeTrade(
        bool isBuy,
        uint256 amount,
        uint256 price
    ) external onlyWhenActive nonReentrant {
        require(msg.sender == vaultData.trader, "Only trader can execute trades");
        require(amount > 0, "Trade amount must be greater than 0");

        if (isBuy) {
            require(
                vaultData.currentBalance >= amount,
                "Insufficient balance for buy"
            );
            vaultData.currentBalance -= amount;
        } else {
            vaultData.currentBalance += amount;
        }

        uint256 tradeId = trades.length;
        trades.push(Trade({
            id: tradeId,
            isBuy: isBuy,
            amount: amount,
            timestamp: block.timestamp,
            price: price
        }));

        emit TradeExecuted(tradeId, isBuy, amount, block.timestamp);
    }

    function withdraw() external onlyOwner nonReentrant {
        require(
            vaultData.status == VaultStatus.Completed || 
            vaultData.status == VaultStatus.Paused,
            "Vault must be completed or paused"
        );
        require(vaultData.currentBalance > 0, "No balance to withdraw");

        uint256 amountToWithdraw = vaultData.currentBalance;
        uint256 returnsAmount = 0;
        
        if (amountToWithdraw > vaultData.initialAmount) {
            returnsAmount = amountToWithdraw - vaultData.initialAmount;
        }

        vaultData.currentBalance = 0;
        vaultData.totalReturns = returnsAmount;

        stablecoin.safeTransfer(msg.sender, amountToWithdraw);

        emit Withdrawn(msg.sender, amountToWithdraw, returnsAmount);
    }

    function completeVault() external onlyOwnerOrTrader {
        require(
            vaultData.status == VaultStatus.Active,
            "Vault must be active"
        );
        vaultData.status = VaultStatus.Completed;
        vaultData.endTime = block.timestamp;
    }

    function pauseVault() external onlyOwner {
        require(
            vaultData.status == VaultStatus.Active,
            "Vault must be active"
        );
        vaultData.status = VaultStatus.Paused;
        emit VaultPaused(address(this));
    }

    function resumeVault() external onlyOwner {
        require(
            vaultData.status == VaultStatus.Paused,
            "Vault must be paused"
        );
        vaultData.status = VaultStatus.Active;
        emit VaultResumed(address(this));
    }

    function calculateReturns() external view returns (int256) {
        if (vaultData.currentBalance >= vaultData.initialAmount) {
            return int256(vaultData.currentBalance - vaultData.initialAmount);
        } else {
            return -int256(vaultData.initialAmount - vaultData.currentBalance);
        }
    }

    function getTradeHistory() external view returns (Trade[] memory) {
        return trades;
    }

    function getTradeCount() external view returns (uint256) {
        return trades.length;
    }
}

