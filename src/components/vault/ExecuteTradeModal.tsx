'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Vault ABI for executeTrade
const VAULT_ABI = [
  {
    inputs: [
      { internalType: "bool", name: "isBuy", type: "bool" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "executeTrade",
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

interface ExecuteTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
  currentBalance: bigint;
  onTradeSuccess?: () => void;
}

export function ExecuteTradeModal({
  isOpen,
  onClose,
  vaultAddress,
  currentBalance,
  onTradeSuccess,
}: ExecuteTradeModalProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; price?: string }>({});

  const { writeContract, data: tradeHash, isPending: isExecuting, error: tradeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isTraded } = useWaitForTransactionReceipt({
    hash: tradeHash,
  });

  const validateForm = () => {
    const newErrors: { amount?: string; price?: string } = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else {
      const amountBigInt = parseEther(amount);
      if (tradeType === 'buy' && amountBigInt > currentBalance) {
        newErrors.amount = `Insufficient balance. Available: ${formatBalance(currentBalance)}`;
      }
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const amountBigInt = parseEther(amount);
    const priceBigInt = parseEther(price);
    const isBuy = tradeType === 'buy';

    writeContract({
      address: vaultAddress as `0x${string}`,
      abi: VAULT_ABI,
      functionName: 'executeTrade',
      args: [isBuy, amountBigInt, priceBigInt],
    });
  };

  const handleClose = () => {
    setAmount('');
    setPrice('');
    setErrors({});
    setTradeType('buy');
    onClose();
  };

  if (isTraded && onTradeSuccess) {
    setTimeout(() => {
      onTradeSuccess();
      handleClose();
    }, 1500);
  }

  if (!isOpen) return null;

  const maxAmount = tradeType === 'buy' ? formatBalance(currentBalance) : '0';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Execute Trade
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition text-2xl"
                  disabled={isExecuting || isConfirming}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Trade Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                        tradeType === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                        tradeType === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USDT)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0000"
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isExecuting || isConfirming}
                    />
                    {tradeType === 'buy' && (
                      <button
                        type="button"
                        onClick={() => setAmount(maxAmount)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Max: {maxAmount}
                      </button>
                    )}
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USDT per unit)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.0000"
                    className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isExecuting || isConfirming}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Summary */}
                {amount && price && !errors.amount && !errors.price && (
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Trade Summary</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Type:</span>
                        <span className={`font-semibold ${tradeType === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {tradeType === 'buy' ? 'BUY' : 'SELL'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Amount:</span>
                        <span className="font-semibold">{amount} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Price:</span>
                        <span className="font-semibold">{price} USDT</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="text-gray-700">Total:</span>
                        <span className="font-bold text-blue-600">
                          {(parseFloat(amount) * parseFloat(price)).toFixed(4)} USDT
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {tradeError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="text-red-800 font-semibold">Trade Failed</div>
                    <div className="text-red-600 text-sm mt-1">
                      {tradeError.message || 'Failed to execute trade'}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {isTraded && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="text-green-800 font-semibold">Trade Executed Successfully!</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isExecuting || isConfirming}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isExecuting || isConfirming || !amount || !price}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExecuting || isConfirming
                      ? 'Processing...'
                      : tradeType === 'buy'
                      ? 'Execute Buy'
                      : 'Execute Sell'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

