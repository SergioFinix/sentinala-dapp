'use client';

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';

// Date formatting helper
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
};

// Vault ABI
const VAULT_ABI = [
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
] as const;

interface TradeHistoryProps {
  vaultAddress: string;
}

export function TradeHistory({ vaultAddress }: TradeHistoryProps) {
  const { data: trades, isLoading } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getTradeHistory',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trades || !Array.isArray(trades) || trades.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Trades Yet</h3>
        <p className="text-gray-500">Trades will appear here once executed</p>
      </div>
    );
  }

  // Reverse to show latest first
  const tradesReversed = [...trades].reverse();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade History</h3>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {tradesReversed.map((trade, index) => {
          const tradeData = trade as unknown as {
            id: bigint;
            isBuy: boolean;
            amount: bigint;
            timestamp: bigint;
            price: bigint;
          };

          const isBuy = tradeData.isBuy;
          const amount = formatEther(tradeData.amount);
          const price = formatEther(tradeData.price);
          const total = (parseFloat(amount) * parseFloat(price)).toFixed(4);
          const date = new Date(Number(tradeData.timestamp) * 1000);

          return (
            <motion.div
              key={Number(tradeData.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border-2 ${
                isBuy
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isBuy
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {isBuy ? 'BUY' : 'SELL'}
                  </div>
                  <span className="text-sm text-gray-600">
                    #{Number(tradeData.id)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(Number(tradeData.timestamp) * 1000)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 text-xs">Amount</div>
                  <div className="font-semibold text-gray-900">{amount}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Price</div>
                  <div className="font-semibold text-gray-900">{price}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Total</div>
                  <div className="font-semibold text-blue-600">{total}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

