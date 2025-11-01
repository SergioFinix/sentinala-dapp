// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Vault.sol";

contract VaultFactory {
    Vault[] public vaults;
    mapping(address => uint256[]) public userVaults;
    mapping(address => uint256[]) public traderVaults;
    mapping(uint256 => address) public vaultAddresses;

    event VaultCreated(
        uint256 indexed vaultId,
        address indexed vaultAddress,
        address indexed owner,
        address trader,
        address stablecoin
    );

    function createVault(
        address trader,
        address stablecoin
    ) external returns (address) {
        require(trader != address(0), "Invalid trader address");
        require(stablecoin != address(0), "Invalid stablecoin address");

        uint256 vaultId = vaults.length;
        Vault newVault = new Vault(vaultId, msg.sender, trader, stablecoin);
        
        vaults.push(newVault);
        vaultAddresses[vaultId] = address(newVault);
        userVaults[msg.sender].push(vaultId);
        traderVaults[trader].push(vaultId);

        emit VaultCreated(
            vaultId,
            address(newVault),
            msg.sender,
            trader,
            stablecoin
        );

        return address(newVault);
    }

    function getVaultsByUser(address user) external view returns (uint256[] memory) {
        return userVaults[user];
    }

    function getVaultsByTrader(address trader) external view returns (uint256[] memory) {
        return traderVaults[trader];
    }

    function getVaultAddress(uint256 vaultId) external view returns (address) {
        return vaultAddresses[vaultId];
    }

    function getTotalVaults() external view returns (uint256) {
        return vaults.length;
    }

    function getVault(uint256 vaultId) external view returns (Vault) {
        require(vaultId < vaults.length, "Vault does not exist");
        return vaults[vaultId];
    }
}

