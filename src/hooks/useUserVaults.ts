import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { formatEther } from 'viem';

// VaultFactory ABI
const VAULT_FACTORY_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getVaultsByUser",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "vaultId", type: "uint256" }],
    name: "getVaultAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Vault ABI
const VAULT_ABI = [
  {
    inputs: [],
    name: "vaultData",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "trader", type: "address" },
      { internalType: "uint256", name: "initialAmount", type: "uint256" },
      { internalType: "uint256", name: "currentBalance", type: "uint256" },
      { internalType: "address", name: "stablecoinAddress", type: "address" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "uint256", name: "totalReturns", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useUserVaultsStats() {
  const { address } = useAccount();

  // Get vault IDs for the user
  const { data: vaultIds, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT_FACTORY as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getVaultsByUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESSES.VAULT_FACTORY && CONTRACT_ADDRESSES.VAULT_FACTORY !== '0x0000000000000000000000000000000000000000',
    },
  });

  const vaultIdsArray = vaultIds && Array.isArray(vaultIds) ? vaultIds : [];

  return {
    vaultIds: vaultIdsArray,
    isLoading,
    vaultCount: vaultIdsArray.length,
  };
}

