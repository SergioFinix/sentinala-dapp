import { http, createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

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
} as const;

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id';

export const config = createConfig({
  chains: [scrollSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [scrollSepolia.id]: http('https://sepolia-rpc.scroll.io'),
  },
});

