'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { ExecuteTradeModal } from './ExecuteTradeModal';
import { TradeHistory } from './TradeHistory';

// VaultFactory ABI
const VAULT_FACTORY_ABI = [
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
  {
    inputs: [],
    name: "getTradeCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface VaultRowProps {
  vaultId: bigint;
  vaultAddress: string;
}

function VaultRow({ vaultId, vaultAddress }: VaultRowProps) {
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Get vault data
  const { data: vaultData, isLoading, refetch } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'vaultData',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Get trade count
  const { data: tradeCount } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getTradeCount',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  if (isLoading || !vaultData) {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading vault data...
          </div>
        </td>
      </tr>
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
  const statusColors = {
    0: 'bg-green-100 text-green-800 border-green-200',
    1: 'bg-blue-100 text-blue-800 border-blue-200',
    2: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusValue = Number(status);
  const isActive = statusValue === 0;
  const returnsDifference = currentBalance - initialAmount;
  const returnsPercentage =
    initialAmount > 0n
      ? ((Number(returnsDifference) / Number(initialAmount)) * 100).toFixed(2)
      : '0.00';
  const isPositive = currentBalance >= initialAmount;
  const hasFunds = currentBalance > 0n;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-gray-200 hover:bg-gray-50 transition"
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">#{id.toString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {owner.toString().slice(0, 6)}...{owner.toString().slice(-4)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{formatEther(initialAmount)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatEther(currentBalance)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{returnsPercentage}%
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{tradeCount?.toString() || '0'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[statusValue as keyof typeof statusColors]}`}>
            {statusLabels[statusValue]}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="flex gap-2">
            {isActive && hasFunds && (
              <button
                onClick={() => setShowTradeModal(true)}
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
              >
                Trade
              </button>
            )}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-600 hover:text-gray-800 hover:underline font-semibold"
            >
              {showHistory ? 'Hide' : 'History'}
            </button>
          </div>
        </td>
      </motion.tr>
      {showHistory && (
        <tr>
          <td colSpan={8} className="px-6 py-4 bg-gray-50">
            <TradeHistory vaultAddress={vaultAddress} />
          </td>
        </tr>
      )}
      {showTradeModal && (
        <ExecuteTradeModal
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          vaultAddress={vaultAddress}
          currentBalance={currentBalance}
          onTradeSuccess={() => {
            refetch();
            setShowTradeModal(false);
          }}
        />
      )}
    </>
  );
}

// Component to load vault address first, then vault data
function VaultAddressLoader({ vaultId }: { vaultId: bigint }) {
  const { data: vaultAddress, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT_FACTORY as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getVaultAddress',
    args: [vaultId],
    query: {
      enabled: !!CONTRACT_ADDRESSES.VAULT_FACTORY && CONTRACT_ADDRESSES.VAULT_FACTORY !== '0x0000000000000000000000000000000000000000',
    },
  });

  if (isLoading) {
    return (
      <tr className="border-b border-gray-200">
        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading...
          </div>
        </td>
      </tr>
    );
  }

  if (!vaultAddress || vaultAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return <VaultRow vaultId={vaultId} vaultAddress={vaultAddress} />;
}

interface TradersVaultsListProps {
  vaultIds: bigint[];
  isLoading: boolean;
}

export function TradersVaultsList({ vaultIds, isLoading }: TradersVaultsListProps) {
  // Debug logging
  console.log('🔍 TradersVaultsList Debug:', {
    vaultIds,
    vaultIdsLength: vaultIds.length,
    isLoading,
    vaultIdsArray: vaultIds.map(id => id.toString()),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Loading Vaults...</h3>
        </div>
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assigned vaults...</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (vaultIds.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-12 rounded-xl shadow-lg text-center border-2 border-gray-200"
      >
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No Assigned Vaults</h2>
        <p className="text-gray-600 mb-6">
          You don't have any vaults assigned yet. Create a vault from the dashboard to get started.
        </p>
      </motion.div>
    );
  }

  // Always show the table when we have vault IDs
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-900">Assigned Vaults</h3>
        <p className="text-sm text-gray-600 mt-1">Total: {vaultIds.length} vault{vaultIds.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vault ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Initial Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Returns
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trades
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaultIds.map((vaultId) => (
              <VaultAddressLoader key={vaultId.toString()} vaultId={vaultId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
