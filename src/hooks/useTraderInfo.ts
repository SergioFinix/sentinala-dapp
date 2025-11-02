import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { Trader } from '@/types';

// TraderRegistry ABI
const TRADER_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "address", name: "trader", type: "address" }],
    name: "getTraderInfo",
    outputs: [
      {
        components: [
          { internalType: "address", name: "traderAddress", type: "address" },
          { internalType: "uint256", name: "reputationScore", type: "uint256" },
          { internalType: "uint256", name: "totalVaults", type: "uint256" },
          { internalType: "uint256", name: "completedVaults", type: "uint256" },
          { internalType: "uint256", name: "totalVolume", type: "uint256" },
          { internalType: "uint256", name: "averageReturns", type: "uint256" },
          { internalType: "bool", name: "isRegistered", type: "bool" },
          { internalType: "uint256", name: "registrationDate", type: "uint256" },
        ],
        internalType: "struct TraderRegistry.Trader",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "trader", type: "address" }],
    name: "registerTrader",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function useTraderInfo() {
  const { address } = useAccount();

  const { data: traderData, isLoading, refetch, error } = useReadContract({
    address: CONTRACT_ADDRESSES.TRADER_REGISTRY as `0x${string}`,
    abi: TRADER_REGISTRY_ABI,
    functionName: 'getTraderInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESSES.TRADER_REGISTRY && CONTRACT_ADDRESSES.TRADER_REGISTRY !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Debug logging
  if (address) {
    console.log('🔍 useTraderInfo Debug:', {
      address,
      traderRegistryAddress: CONTRACT_ADDRESSES.TRADER_REGISTRY,
      traderData,
      isLoading,
      error: error?.message,
    });
  }

  // If there's an error or no data, return not registered
  if (error || !traderData || !Array.isArray(traderData)) {
    return {
      trader: null,
      isLoading,
      isRegistered: false,
      refetch,
      error,
    };
  }

  const [
    traderAddress,
    reputationScore,
    totalVaults,
    completedVaults,
    totalVolume,
    averageReturns,
    isRegistered,
    registrationDate,
  ] = traderData;

  const trader: Trader = {
    traderAddress: traderAddress.toString(),
    reputationScore: Number(reputationScore),
    totalVaults: Number(totalVaults),
    completedVaults: Number(completedVaults),
    totalVolume,
    averageReturns,
    isRegistered: Boolean(isRegistered),
    registrationDate,
  };

  return {
    trader,
    isLoading,
    isRegistered: Boolean(isRegistered),
    refetch,
    error: undefined,
  };
}

export const TRADER_REGISTRY_ABI_EXPORT = TRADER_REGISTRY_ABI;

