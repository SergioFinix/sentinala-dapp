'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { DepositModal } from './DepositModal';

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
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "calculateReturns",
    outputs: [{ internalType: "int256", name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTradeHistory",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "bool", name: "isBuy", type: "bool" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
        ],
        internalType: "struct Vault.Trade[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTradeCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface VaultDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
}

export function VaultDetailModal({ isOpen, onClose, vaultAddress }: VaultDetailModalProps) {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  
  const { data: vaultData, isLoading, refetch } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'vaultData',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const { data: returns, isLoading: isLoadingReturns } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'calculateReturns',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const { data: tradeCount } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getTradeCount',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing, error: withdrawError } = useWriteContract();
  
  const { isLoading: isWithdrawingConfirming, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const handleWithdraw = () => {
    withdraw({
      address: vaultAddress as `0x${string}`,
      abi: VAULT_ABI,
      functionName: 'withdraw',
    });
  };

  useEffect(() => {
    if (isWithdrawn) {
      refetch();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isWithdrawn, refetch, onClose]);

  if (!isOpen) return null;

  if (isLoading || !vaultData) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading vault details...</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const [
    id,
    owner,
    trader,
    initialAmount,
    currentBalance,
    stablecoinAddress,
    status,
    startTime,
    endTime,
    totalReturns,
  ] = vaultData as readonly bigint[];

  const statusLabels = ['Active', 'Completed', 'Paused'];
  const statusValue = Number(status);
  const returnsValue = returns ? BigInt(returns.toString()) : 0n;
  const canWithdraw = statusValue === 1 || statusValue === 2; // Completed or Paused
  const canDeposit = statusValue === 0 && initialAmount === 0n; // Active and no deposit yet
  const returnsDifference = currentBalance - initialAmount;
  const returnsPercentage = initialAmount > 0n 
    ? ((Number(returnsDifference) / Number(initialAmount)) * 100).toFixed(2)
    : '0.00';
  const isPositive = currentBalance >= initialAmount;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Vault #{id.toString()}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Vault Info */}
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="text-xs text-gray-600 mb-1">Initial Amount</div>
                      <div className="text-2xl font-bold text-gray-900">{formatEther(initialAmount)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <div className="text-xs text-gray-600 mb-1">Current Balance</div>
                      <div className="text-2xl font-bold text-green-600">{formatEther(currentBalance)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                      <div className="text-xs text-gray-600 mb-1">Returns</div>
                      <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{returnsPercentage}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                      <div className="text-xs text-gray-600 mb-1">Trade Count</div>
                      <div className="text-2xl font-bold text-gray-900">{tradeCount?.toString() || '0'}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Status</div>
                        <div className="font-semibold text-gray-900">{statusLabels[statusValue]}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Trader</div>
                        <div className="font-semibold text-gray-900">{trader.toString().slice(0, 6)}...{trader.toString().slice(-4)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {canDeposit && (
                    <button
                      onClick={() => setDepositModalOpen(true)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Deposit Funds
                    </button>
                  )}
                  {canWithdraw && (
                    <button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing || isWithdrawingConfirming}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isWithdrawing || isWithdrawingConfirming ? 'Withdrawing...' : 'Withdraw Funds'}
                    </button>
                  )}
                </div>

                {withdrawError && (
                  <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="text-red-800 font-semibold">Withdrawal Failed</div>
                    <div className="text-red-600 text-sm mt-1">{withdrawError.message}</div>
                  </div>
                )}

                {isWithdrawn && (
                  <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="text-green-800 font-semibold">Withdrawal Successful!</div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        vaultAddress={vaultAddress}
        stablecoinAddress={stablecoinAddress.toString()}
        onDepositSuccess={() => {
          refetch();
          setDepositModalOpen(false);
        }}
      />
    </>
  );
}

