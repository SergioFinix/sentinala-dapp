'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, STABLECOINS } from '@/lib/constants';

// VaultFactory ABI - extract only the functions we need
const VAULT_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        internalType: "address",
        name: "stablecoin",
        type: "address",
      },
    ],
    name: "createVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVault: (vaultData: VaultFormData) => void;
}

export interface Strategy {
  id: string;
  name: string;
  apy: string;
  trader: string;
  duration: number;
  fee: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface VaultFormData {
  stablecoin: 'USDT' | 'USDC' | 'DAI';
  amount: string;
  strategy: Strategy;
}

// Mock traders - these should be replaced with actual trader addresses from TraderRegistry
const MOCK_STRATEGIES: Strategy[] = [
  {
    id: '1',
    name: 'Conservative Growth',
    apy: '8.5%',
    trader: '0xf76A0Af73Df734393ca2684f7e7BB9b446aa0010', // Replace with actual trader address
    duration: 30,
    fee: 15,
    riskLevel: 'Low',
  },
  {
    id: '2',
    name: 'Balanced Portfolio',
    apy: '12.5%',
    trader: '0xf76A0Af73Df734393ca2684f7e7BB9b446aa0010', // Replace with actual trader address
    duration: 30,
    fee: 20,
    riskLevel: 'Medium',
  },
  {
    id: '3',
    name: 'Aggressive Trading',
    apy: '18.2%',
    trader: '0xf76A0Af73Df734393ca2684f7e7BB9b446aa0010', // Replace with actual trader address
    duration: 30,
    fee: 25,
    riskLevel: 'High',
  },
];

// Stablecoins configuration from constants
const STABLECOIN_CONFIG = [
  { symbol: 'USDC' as const, icon: '💵', address: STABLECOINS.USDC },
  { symbol: 'USDT' as const, icon: '💰', address: STABLECOINS.USDT },
  { symbol: 'DAI' as const, icon: '💲', address: STABLECOINS.DAI },
];

export function CreateVaultModal({ isOpen, onClose, onCreateVault }: CreateVaultModalProps) {
  const [formData, setFormData] = useState<VaultFormData>({
    stablecoin: 'USDC',
    amount: '',
    strategy: MOCK_STRATEGIES[1], // Default to Balanced Portfolio
  });

  const { writeContract, data: hash, error: writeError, isPending, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const isCreating = isPending || isConfirming;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount) {
      alert('Please enter an amount to deposit');
      return;
    }

    // Validate contract address
    if (!CONTRACT_ADDRESSES.VAULT_FACTORY || CONTRACT_ADDRESSES.VAULT_FACTORY === '0x0000000000000000000000000000000000000000') {
      alert('Vault Factory contract address is not configured. Please update the contract address in your configuration.');
      return;
    }

    // Get stablecoin address
    const stablecoinConfig = STABLECOIN_CONFIG.find(c => c.symbol === formData.stablecoin);
    if (!stablecoinConfig || !stablecoinConfig.address || stablecoinConfig.address === '0x0000000000000000000000000000000000000000') {
      alert(`${formData.stablecoin} address is not configured. Please update the stablecoin address in your configuration.`);
      return;
    }

    // Validate trader address
    if (!formData.strategy.trader || !formData.strategy.trader.startsWith('0x') || formData.strategy.trader.length !== 42) {
      alert('Invalid trader address. Please select a valid strategy.');
      return;
    }

    try {
      // Call createVault on the contract
      writeContract({
        address: CONTRACT_ADDRESSES.VAULT_FACTORY as `0x${string}`,
        abi: VAULT_FACTORY_ABI,
        functionName: 'createVault',
        args: [
          formData.strategy.trader as `0x${string}`,
          stablecoinConfig.address as `0x${string}`,
        ],
      });
    } catch (error) {
      console.error('Error creating vault:', error);
      alert('Failed to create vault. Please try again.');
    }
  };

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      // Call the callback to notify parent component
      onCreateVault(formData);
      
      // Reset form
      setFormData({
        stablecoin: 'USDC',
        amount: '',
        strategy: MOCK_STRATEGIES[1],
      });
      
      // Close modal and reset transaction state after a delay
      const timer = setTimeout(() => {
        onClose();
        reset();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, hash]);

  // Handle errors
  useEffect(() => {
    if (writeError) {
      console.error('Transaction error:', writeError);
      // Error is displayed via UI, no need to alert
    }
  }, [writeError]);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Create New Vault
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition text-2xl"
                  disabled={isCreating}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Stablecoin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Stablecoin
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {STABLECOIN_CONFIG.map((coin) => {
                      const isConfigured = coin.address && coin.address !== '0x0000000000000000000000000000000000000000';
                      return (
                        <button
                          key={coin.symbol}
                          type="button"
                          onClick={() => setFormData({ ...formData, stablecoin: coin.symbol as any })}
                          disabled={isCreating || !isConfigured}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.stablecoin === coin.symbol
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={!isConfigured ? `${coin.symbol} address not configured` : ''}
                        >
                          <div className="text-3xl mb-2">{coin.icon}</div>
                          <div className="font-semibold text-gray-900">{coin.symbol}</div>
                          {!isConfigured && (
                            <div className="text-xs text-red-500 mt-1">Not configured</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount to Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Deposit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      min="100"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 text-gray-900"
                      required
                      disabled={isCreating}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: '10000' })}
                      disabled={isCreating}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: 100 {formData.stablecoin}
                  </p>
                </div>

                {/* Select Strategy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Strategy
                  </label>
                  <select
                    value={formData.strategy.id}
                    onChange={(e) => {
                      const selected = MOCK_STRATEGIES.find(s => s.id === e.target.value);
                      if (selected) setFormData({ ...formData, strategy: selected });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    disabled={isCreating}
                  >
                    {MOCK_STRATEGIES.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name} - {strategy.apy} APY - {strategy.trader.slice(0, 6)}...{strategy.trader.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strategy Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Trade Duration</div>
                      <div className="text-lg font-bold text-gray-900">{formData.strategy.duration} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Expected APY</div>
                      <div className="text-lg font-bold text-green-600">{formData.strategy.apy}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Trader Fee</div>
                      <div className="text-lg font-bold text-gray-900">{formData.strategy.fee}% of profits</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Risk Level</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(formData.strategy.riskLevel)}`}>
                        {formData.strategy.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {writeError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold">⚠️</span>
                      <div>
                        <div className="text-red-800 font-semibold">Transaction Failed</div>
                        <div className="text-red-600 text-sm mt-1">
                          {writeError.message || 'Failed to create vault. Please check your wallet and try again.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {isConfirmed && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <div>
                        <div className="text-green-800 font-semibold">Vault Created Successfully!</div>
                        <div className="text-green-600 text-sm mt-1">
                          Transaction confirmed. Your vault is being created...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    disabled={isCreating}
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Confirm in Wallet...
                      </span>
                    ) : isConfirming ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Vault...
                      </span>
                    ) : (
                      'Create Vault'
                    )}
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
