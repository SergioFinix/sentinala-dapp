'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useERC20Approval } from '@/hooks/useERC20Approval';
import { parseEther, formatEther } from 'viem';

// Vault ABI
const VAULT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
  stablecoinAddress: string;
  onDepositSuccess?: () => void;
}

export function DepositModal({ isOpen, onClose, vaultAddress, stablecoinAddress, onDepositSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approving' | 'depositing'>('input');

  const { writeContract: deposit, data: depositHash, isPending: isDepositing, error: depositError, reset: resetDeposit } = useWriteContract();
  
  const { isLoading: isDepositingConfirming, isSuccess: isDeposited } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Get vault data to check if already deposited
  const { data: vaultData } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'vaultData',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const {
    balance,
    decimals,
    allowance,
    approve,
    checkAndApprove,
    isApproving,
    isApproved,
    approveError,
    refetchAllowance,
  } = useERC20Approval(
    stablecoinAddress as `0x${string}` | undefined,
    vaultAddress as `0x${string}` | undefined
  );

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!balance || parseEther(amount) > balance) {
      alert('Insufficient balancesss');
      return;
    }

    const requiredAmount = parseEther(amount);
    
    // Check if approval is needed
    if (allowance < requiredAmount) {
      setStep('approving');
      approve(amount);
      return;
    }

    // Proceed with deposit
    setStep('depositing');
    deposit({
      address: vaultAddress as `0x${string}`,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [requiredAmount],
    });
  };

  // Handle approval success -> proceed to deposit
  useEffect(() => {
    if (isApproved && step === 'approving' && amount) {
      setStep('depositing');
      const requiredAmount = parseEther(amount);
      deposit({
        address: vaultAddress as `0x${string}`,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [requiredAmount],
      });
      refetchAllowance();
    }
  }, [isApproved, step, amount, deposit, vaultAddress, refetchAllowance]);

  // Handle deposit success
  useEffect(() => {
    if (isDeposited) {
      if (onDepositSuccess) onDepositSuccess();
      setTimeout(() => {
        onClose();
        setAmount('');
        setStep('input');
        resetDeposit();
      }, 2000);
    }
  }, [isDeposited, onDepositSuccess, onClose, resetDeposit]);

  // Check if vault already has a deposit
  const hasDeposit = vaultData && Array.isArray(vaultData) && vaultData.length >= 5 && vaultData[4] > 0n; // currentBalance > 0

  if (!isOpen) return null;

  const balanceFormatted = balance ? formatEther(balance) : '0';
  const isProcessing = isApproving || isDepositing || isDepositingConfirming;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Deposit to Vault
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition text-2xl"
                  disabled={isProcessing}
                >
                  ×
                </button>
              </div>

              {hasDeposit ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600 font-bold">⚠️</span>
                    <div>
                      <div className="text-yellow-800 font-semibold">Vault Already Has Deposit</div>
                      <div className="text-yellow-600 text-sm mt-1">
                        This vault already has funds deposited. You can only deposit once per vault.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Deposit
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 text-gray-900"
                        disabled={isProcessing}
                      />
                      <button
                        type="button"
                        onClick={() => setAmount(balanceFormatted)}
                        disabled={isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                      >
                        MAX
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: {balanceFormatted}
                    </p>
                  </div>

                  {/* Error Display */}
                  {(approveError || depositError) && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">⚠️</span>
                        <div>
                          <div className="text-red-800 font-semibold">Transaction Failed</div>
                          <div className="text-red-600 text-sm mt-1">
                            {(approveError || depositError)?.message || 'Transaction failed. Please try again.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Display */}
                  {isDeposited && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <div className="text-green-800 font-semibold">Deposit Successful!</div>
                          <div className="text-green-600 text-sm mt-1">
                            Your funds have been deposited to the vault.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeposit}
                      className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                    >
                      {step === 'approving' || isApproving ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Approving...
                        </span>
                      ) : step === 'depositing' || isDepositing || isDepositingConfirming ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Depositing...
                        </span>
                      ) : (
                        'Deposit'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

