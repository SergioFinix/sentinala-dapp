// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TraderRegistry {
    struct Trader {
        address traderAddress;
        uint256 reputationScore;
        uint256 totalVaults;
        uint256 completedVaults;
        uint256 totalVolume;
        uint256 averageReturns;
        bool isRegistered;
        uint256 registrationDate;
    }

    mapping(address => Trader) public traders;
    address[] public registeredTraders;

    event TraderRegistered(address indexed trader);
    event ReputationUpdated(address indexed trader, uint256 newScore);
    event TraderRemoved(address indexed trader);

    modifier onlyRegistered(address trader) {
        require(traders[trader].isRegistered, "Trader not registered");
        _;
    }

    function registerTrader(address trader) external {
        require(trader != address(0), "Invalid trader address");
        require(!traders[trader].isRegistered, "Trader already registered");

        traders[trader] = Trader({
            traderAddress: trader,
            reputationScore: 100, // Starting score
            totalVaults: 0,
            completedVaults: 0,
            totalVolume: 0,
            averageReturns: 0,
            isRegistered: true,
            registrationDate: block.timestamp
        });

        registeredTraders.push(trader);

        emit TraderRegistered(trader);
    }

    function updateReputation(
        address trader,
        int256 performanceChange,
        uint256 volume
    ) external onlyRegistered(trader) {
        Trader storage traderData = traders[trader];

        traderData.totalVaults += 1;
        traderData.totalVolume += volume;

        if (performanceChange > 0) {
            traderData.completedVaults += 1;
            traderData.reputationScore += uint256(performanceChange);
        } else if (performanceChange < 0) {
            traderData.reputationScore -= uint256(-performanceChange);
            if (traderData.reputationScore > 100) {
                traderData.reputationScore = 0;
            }
        }

        if (traderData.completedVaults > 0) {
            traderData.averageReturns = traderData.totalVolume / traderData.completedVaults;
        }

        emit ReputationUpdated(trader, traderData.reputationScore);
    }

    function removeTrader(address trader) external onlyRegistered(trader) {
        traders[trader].isRegistered = false;

        // Remove from registered traders array
        for (uint256 i = 0; i < registeredTraders.length; i++) {
            if (registeredTraders[i] == trader) {
                registeredTraders[i] = registeredTraders[registeredTraders.length - 1];
                registeredTraders.pop();
                break;
            }
        }

        emit TraderRemoved(trader);
    }

    function getTraderInfo(address trader) external view returns (Trader memory) {
        return traders[trader];
    }

    function getAllRegisteredTraders() external view returns (address[] memory) {
        return registeredTraders;
    }

    function getTraderCount() external view returns (uint256) {
        return registeredTraders.length;
    }
}

