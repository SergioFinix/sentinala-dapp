'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { CreateVaultModal, type VaultFormData } from '@/components/vault/CreateVaultModal';
import { VaultsTable } from '@/components/vault/VaultsTable';
import { useUserVaultStats } from '@/hooks/useVaultStats';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vaultCount } = useUserVaultStats();

  if (!isConnected) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Connect Your Wallet</h1>
            <p className="text-gray-600">Connect your wallet to view your dashboard</p>
          </div>
        </main>
      </>
    );
  }

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
                  Dashboard
                </h1>
                <p className="text-gray-600">Welcome back! Here's your portfolio overview</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition shadow-lg"
              >
                + Create Vault
              </button>
            </div>
          </motion.div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Total Investment</div>
              <div className="text-2xl font-bold text-gray-900">$0</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Current Balance</div>
              <div className="text-2xl font-bold text-green-600">$0</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Total Returns</div>
              <div className="text-2xl font-bold text-blue-600">$0</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Active Vaults</div>
              <div className="text-2xl font-bold text-teal-600">{vaultCount}</div>
            </motion.div>
          </div>

          {/* Vaults Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <VaultsTable onCreateVaultClick={() => setIsModalOpen(true)} />
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:from-blue-700 hover:to-teal-700 transition z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>

      {/* Create Vault Modal */}
      <CreateVaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateVault={(vaultData: VaultFormData) => {
          console.log('Vault created:', vaultData);
          // The modal already handles the transaction, this is just for UI updates
        }}
      />
    </>
  );
}

