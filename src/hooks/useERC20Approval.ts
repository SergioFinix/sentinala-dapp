import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatUnits } from 'viem';

// Standard ERC20 ABI
const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useERC20Approval(tokenAddress: `0x${string}` | undefined, spenderAddress: `0x${string}` | undefined) {
  const { address } = useAccount();
  const { writeContract: approve, data: approveHash, isPending: isApproving, error: approveError, reset: resetApproval } = useWriteContract();
  
  const { isLoading: isApprovingConfirming, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && !!spenderAddress,
    },
  });

  // Read token balance
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  // Read decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const approveToken = (amount: string) => {
    if (!tokenAddress || !spenderAddress || !decimals) return;
    
    const amountWei = parseEther(amount);
    
    approve({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amountWei],
    });
  };

  const checkAndApprove = async (requiredAmount: string) => {
    if (!allowance || !decimals) return false;
    
    const requiredWei = parseEther(requiredAmount);
    const currentAllowance = BigInt(allowance.toString());
    
    if (currentAllowance >= requiredWei) {
      return true; // Already approved
    }
    
    // Need to approve
    approveToken(requiredAmount);
    return false;
  };

  return {
    allowance: allowance ? BigInt(allowance.toString()) : 0n,
    balance: balance ? BigInt(balance.toString()) : 0n,
    decimals: decimals ? Number(decimals) : 18,
    approve: approveToken,
    checkAndApprove,
    isApproving: isApproving || isApprovingConfirming,
    isApproved,
    approveError,
    refetchAllowance,
    resetApproval,
  };
}

