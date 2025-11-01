import { type Chain } from 'wagmi/chains';

// Scroll Sepolia configuration
const scrollSepolia = {
  id: 534351,
  name: 'Scroll Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
    public: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scroll Blockscout',
      url: 'https://sepolia-blockscout.scroll.io',
    },
  },
  testnet: true,
} as const satisfies Chain;

// Chain configuration
export const supportedChains: Chain[] = [scrollSepolia];
export const defaultChain = scrollSepolia;

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  VAULT_FACTORY: process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
  TRADER_REGISTRY: process.env.NEXT_PUBLIC_TRADER_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Stablecoin addresses - can be mock ERC20 contracts or real stablecoin addresses
// Set these in your .env file or deploy MockERC20 contracts
export const STABLECOINS = {
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '0x0000000000000000000000000000000000000000',
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x0000000000000000000000000000000000000000',
  DAI: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// App metadata
export const APP_NAME = 'Sentinela';
export const APP_DESCRIPTION = 'DeFi Trading Vaults Platform';

// API endpoints (if any)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Configuration
export const CONFIG = {
  defaultGasLimit: 500000,
  defaultGasPrice: '20', // gwei
  maxVaultAmount: 1000000, // in stablecoin decimals
  minVaultAmount: 100,
};

