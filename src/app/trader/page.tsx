'use client';

import { useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { useTraderInfo } from '@/hooks/useTraderInfo';
import { useTraderVaults } from '@/hooks/useTraderVaults';
import { TradersVaultsList } from '@/components/vault/TradersVaultsList';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { formatEther } from 'viem';
import { TRADER_REGISTRY_ABI_EXPORT } from '@/hooks/useTraderInfo';

export default function TraderPage() {
  const { address, isConnected } = useAccount();
  const { trader, isLoading: isLoadingTrader, isRegistered, refetch: refetchTrader } = useTraderInfo();
  const { vaultIds, isLoading: isLoadingVaults, vaultCount, refetch: refetchVaults } = useTraderVaults();

  // Debug logging
  console.log('🔍 Trader Page Debug:', {
    address,
    isConnected,
    isRegistered,
    isLoadingTrader,
    vaultIds,
    vaultCount,
    isLoadingVaults,
    traderRegistryAddress: CONTRACT_ADDRESSES.TRADER_REGISTRY,
    vaultFactoryAddress: CONTRACT_ADDRESSES.VAULT_FACTORY,
  });

  const { 
    writeContract: registerTrader, 
    data: registerHash, 
    isPending: isRegistering,
    error: registerError,
    reset: resetRegister,
  } = useWriteContract();
  
  const { isLoading: isRegisteringConfirming, isSuccess: isRegisteredSuccess } = useWaitForTransactionReceipt({
    hash: registerHash,
  });

  const handleRegister = () => {
    if (!address) {
      console.error('No address available');
      return;
    }

    // Validate contract address
    if (!CONTRACT_ADDRESSES.TRADER_REGISTRY || CONTRACT_ADDRESSES.TRADER_REGISTRY === '0x0000000000000000000000000000000000000000') {
      alert('Trader Registry contract address is not configured. Please update the contract address in your configuration.');
      return;
    }

    try {
      registerTrader({
        address: CONTRACT_ADDRESSES.TRADER_REGISTRY as `0x${string}`,
        abi: TRADER_REGISTRY_ABI_EXPORT,
        functionName: 'registerTrader',
        args: [address],
      });
    } catch (error) {
      console.error('Error registering trader:', error);
      alert('Failed to register trader. Please check the console for details.');
    }
  };

  // Refetch when registration is successful
  useEffect(() => {
    if (isRegisteredSuccess) {
      setTimeout(() => {
        refetchTrader();
        refetchVaults();
      }, 2000);
    }
  }, [isRegisteredSuccess, refetchTrader, refetchVaults]);

  if (!isConnected) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Connect Your Wallet</h1>
            <p className="text-gray-600">Connect your trader wallet to access the panel</p>
          </div>
        </main>
      </>
    );
  }

  // Calculate active vaults count (status === 0)
  const activeVaultsCount = vaultCount; // We'll update this when we load vault data

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Trader Panel
                </h1>
                <p className="text-gray-600">Manage your assigned vaults and execute trades</p>
              </div>
              {!isRegistered && !isLoadingTrader && (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering || isRegisteringConfirming}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering || isRegisteringConfirming ? 'Registering...' : 'Register as Trader'}
                </button>
              )}
            </div>
          </motion.div>

          {/* Registration Error Message */}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4"
            >
              <div className="text-red-800 font-semibold">❌ Registration Failed</div>
              <div className="text-red-600 text-sm mt-1">
                {registerError.message || 'Failed to register as trader. Please try again.'}
              </div>
              <button
                onClick={() => resetRegister()}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Registration Success Message */}
          {isRegisteredSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4"
            >
              <div className="text-green-800 font-semibold">✅ Successfully Registered as Trader!</div>
              <div className="text-green-600 text-sm mt-1">You can now manage vaults assigned to you.</div>
            </motion.div>
          )}

          {/* Trader Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100"
            >
              <div className="text-sm text-gray-600 mb-2">Reputation Score</div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoadingTrader ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                ) : (
                  trader?.reputationScore || 'N/A'
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100"
            >
              <div className="text-sm text-gray-600 mb-2">Total Vaults</div>
              <div className="text-2xl font-bold text-gray-900">
                {isLoadingTrader ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                ) : (
                  trader?.totalVaults || vaultCount
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100"
            >
              <div className="text-sm text-gray-600 mb-2">Active Vaults</div>
              <div className="text-2xl font-bold text-green-600">
                {isLoadingVaults ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                ) : (
                  vaultCount
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100"
            >
              <div className="text-sm text-gray-600 mb-2">Average Returns</div>
              <div className="text-2xl font-bold text-teal-600">
                {isLoadingTrader ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                ) : trader?.averageReturns && trader.averageReturns > 0n ? (
                  `${formatEther(trader.averageReturns)}`
                ) : (
                  '0'
                )}
              </div>
            </motion.div>
          </div>

          

          {/* Loading State */}
          {isLoadingTrader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-12 rounded-xl shadow-lg text-center border-2 border-gray-200"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trader information...</p>
            </motion.div>
          )}

          {/* Vaults List - Show always if wallet is connected, even if not registered */}
          {isConnected && !isLoadingTrader && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Assigned Vaults</h2>
                <button
                  onClick={() => {
                    refetchVaults();
                    refetchTrader();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                  disabled={isLoadingVaults}
                >
                  {isLoadingVaults ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Warning if not registered but has vaults */}
              {!isRegistered && vaultCount > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="text-blue-800 font-semibold mb-2">ℹ️ Not Registered as Trader</div>
                  <div className="text-blue-700 text-sm">
                    You have vaults assigned but you're not registered as a trader. 
                    <button
                      onClick={handleRegister}
                      className="ml-2 underline hover:text-blue-900"
                    >
                      Register now
                    </button>
                    {' '}to manage your reputation and access trader features.
                  </div>
                </div>
              )}
              
              {/* Debug info */}
              {!isLoadingVaults && vaultCount === 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <div className="text-yellow-800 font-semibold mb-2">ℹ️ No Vaults Found</div>
                  <div className="text-yellow-700 text-sm space-y-1">
                    <div><strong>Wallet Address:</strong> {address || 'Not connected'}</div>
                    <div><strong>Trader Registry:</strong> {CONTRACT_ADDRESSES.TRADER_REGISTRY || '⚠️ Not configured'}</div>
                    <div><strong>Vault Factory:</strong> {CONTRACT_ADDRESSES.VAULT_FACTORY || '⚠️ Not configured'}</div>
                    <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                      <div className="font-semibold mb-1">To see your vaults:</div>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        <li>Make sure the contract addresses are configured in your .env file</li>
                        <li>Create vaults with this wallet address as the trader</li>
                        <li>Verify you're connected to the correct network (Scroll Sepolia)</li>
                        <li>Check the browser console for detailed debug information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <TradersVaultsList vaultIds={vaultIds} isLoading={isLoadingVaults} />
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
