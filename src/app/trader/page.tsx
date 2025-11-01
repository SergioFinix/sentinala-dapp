'use client';

import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TraderPage() {
  const { address, isConnected } = useAccount();

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
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Trader Panel
            </h1>
            <p className="text-gray-600 mb-8">Manage your assigned vaults and execute trades</p>
          </motion.div>

          {/* Trader Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Reputation Score</div>
              <div className="text-2xl font-bold text-blue-600">100</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Total Vaults</div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Active Vaults</div>
              <div className="text-2xl font-bold text-green-600">0</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-gray-600 mb-2">Average Returns</div>
              <div className="text-2xl font-bold text-teal-600">0%</div>
            </motion.div>
          </div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-12 rounded-xl shadow-lg text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No Assigned Vaults</h2>
            <p className="text-gray-600 mb-6">
              Register as a trader to start managing vaults
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}

