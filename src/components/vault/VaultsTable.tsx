'use client';

import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DepositModal } from './DepositModal';
import { VaultDetailModal } from './VaultDetailModal';

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

interface VaultRowProps {
  vaultId: bigint;
  vaultAddress: string;
}

function VaultRow({ vaultId, vaultAddress }: VaultRowProps) {
  const { data: vaultData, isLoading, isError } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'vaultData',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  if (isLoading) {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Loading vault data...
          </div>
        </td>
      </tr>
    );
  }

  if (isError || !vaultData) {
    return null;
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
  const initialAmountFormatted = formatEther(initialAmount);
  const currentBalanceFormatted = formatEther(currentBalance);
  const returnsFormatted = formatEther(totalReturns);
  const returnsDifference = currentBalance - initialAmount;
  const returnsPercentage = initialAmount > 0n 
    ? ((Number(returnsDifference) / Number(initialAmount)) * 100).toFixed(2)
    : '0.00';

  const isPositive = currentBalance >= initialAmount;

  return (
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
          {trader.toString().slice(0, 6)}...{trader.toString().slice(-4)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{initialAmountFormatted}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {currentBalanceFormatted}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{returnsPercentage}%
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[statusValue as keyof typeof statusColors]}`}>
          {statusLabels[statusValue]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const event = new CustomEvent('openVaultDetail', { detail: { vaultAddress } });
              window.dispatchEvent(event);
            }}
            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
          >
            Details
          </button>
          {statusValue === 0 && initialAmount === 0n && (
            <button
              onClick={() => {
                const event = new CustomEvent('openDepositModal', { detail: { vaultAddress, stablecoinAddress: stablecoinAddress.toString() } });
                window.dispatchEvent(event);
              }}
              className="text-green-600 hover:text-green-800 hover:underline font-semibold"
            >
              Deposit
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

// Component to load vault address first, then vault data
function VaultAddressLoader({ vaultId }: { vaultId: bigint }) {
  const { data: vaultAddress, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT_FACTORY as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getVaultAddress',
    args: [vaultId],
  });

  if (isLoading) {
    return (
      <tr className="border-b border-gray-200">
        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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

interface VaultsTableProps {
  onCreateVaultClick?: () => void;
}

export function VaultsTable({ onCreateVaultClick }: VaultsTableProps) {
  const { address } = useAccount();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState<string>('');
  const [selectedStablecoinAddress, setSelectedStablecoinAddress] = useState<string>('');

  // Listen for deposit modal events
  useEffect(() => {
    const handleOpenDeposit = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedVaultAddress(customEvent.detail.vaultAddress);
      setSelectedStablecoinAddress(customEvent.detail.stablecoinAddress);
      setDepositModalOpen(true);
    };

    const handleOpenDetail = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedVaultAddress(customEvent.detail.vaultAddress);
      setDetailModalOpen(true);
    };

    window.addEventListener('openDepositModal', handleOpenDeposit);
    window.addEventListener('openVaultDetail', handleOpenDetail);
    return () => {
      window.removeEventListener('openDepositModal', handleOpenDeposit);
      window.removeEventListener('openVaultDetail', handleOpenDetail);
    };
  }, []);

  // Get vault IDs for the user
  const { data: vaultIds, isLoading: isLoadingVaultIds } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT_FACTORY as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getVaultsByUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACT_ADDRESSES.VAULT_FACTORY && CONTRACT_ADDRESSES.VAULT_FACTORY !== '0x0000000000000000000000000000000000000000',
    },
  });

  const vaultIdsArray = vaultIds && Array.isArray(vaultIds) ? vaultIds : [];

  if (!address) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-600">Please connect your wallet to view your vaults</p>
      </div>
    );
  }

  if (!CONTRACT_ADDRESSES.VAULT_FACTORY || CONTRACT_ADDRESSES.VAULT_FACTORY === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-600">Vault Factory contract address is not configured</p>
      </div>
    );
  }

  if (isLoadingVaultIds) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your vaults...</span>
        </div>
      </div>
    );
  }

  if (!vaultIdsArray || vaultIdsArray.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-lg text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-2">No Vaults Yet</h2>
        <p className="text-gray-600 mb-6">
          Start by creating your first vault or exploring the yield simulator
        </p>
        {onCreateVaultClick && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCreateVaultClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition shadow-lg"
            >
              + Create Vault
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Your Vaults</h2>
        <p className="text-sm text-gray-600 mt-1">Total: {vaultIdsArray.length} vault{vaultIdsArray.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vault ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trader
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaultIdsArray.map((vaultId) => (
              <VaultAddressLoader key={vaultId.toString()} vaultId={vaultId} />
            ))}
          </tbody>
        </table>
      </div>
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false);
          setSelectedVaultAddress('');
          setSelectedStablecoinAddress('');
        }}
        vaultAddress={selectedVaultAddress}
        stablecoinAddress={selectedStablecoinAddress}
        onDepositSuccess={() => {
          // Refresh vault data - component will re-render automatically
        }}
      />
      <VaultDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedVaultAddress('');
        }}
        vaultAddress={selectedVaultAddress}
      />
    </div>
  );
}

