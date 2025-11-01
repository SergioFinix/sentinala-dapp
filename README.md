# Sentinala DApp - DeFi Trading Vaults Platform

A decentralized application (DApp) built on Scroll that allows users to deposit funds into vaults managed by professional traders.

## 🚀 Features

- **Smart Contracts**: Vault system with secure fund management
- **Vault Factory**: Create and manage multiple vaults
- **Trader Registry**: Reputation-based trader system
- **Yield Simulator**: Project potential returns before investing (WOW feature)
- **User Dashboard**: Track investments and performance
- **Trader Panel**: Manage assigned vaults and execute trades
- **Beautiful UI**: Modern design with Tailwind CSS and Framer Motion

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Scroll Sepolia testnet ETH for deployment

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sentinala-dapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Scroll Sepolia Testnet Configuration
SCROLL_SEPOLIA_URL=https://sepolia-rpc.scroll.io
PRIVATE_KEY=your_private_key_here

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract Addresses (update after deployment)
NEXT_PUBLIC_VAULT_FACTORY_ADDRESS=
NEXT_PUBLIC_TRADER_REGISTRY_ADDRESS=
```

## 📦 Smart Contracts

### Contract Structure
- **Vault.sol**: Individual vault contract with deposit, trade execution, and withdrawal
- **VaultFactory.sol**: Factory pattern for creating vaults
- **TraderRegistry.sol**: Trader registration and reputation management
- **MockERC20.sol**: Mock stablecoin for testing

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Scroll Sepolia
```bash
npx hardhat run scripts/deploy.js --network scrollSepolia
```

After deployment, update the contract addresses in `.env` and `src/lib/constants.ts`.

## 🎨 Frontend Development

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## 📱 Usage

1. **Connect Wallet**: Use the header to connect your MetaMask wallet
2. **Simulate Returns**: Visit the Yield Simulator to project potential returns
3. **Create Vault**: Navigate to Dashboard to create your first vault
4. **Deposit Funds**: Fund your vault with stablecoins
5. **Track Performance**: Monitor your vault's performance in real-time

## 🏗️ Architecture

```
sentinala-dapp/
├── contracts/           # Solidity smart contracts
├── scripts/            # Deployment scripts
├── test/               # Contract tests
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/        # User dashboard
│   │   ├── trader/           # Trader panel
│   │   └── simulator/        # Yield simulator
│   ├── components/    # React components
│   │   ├── layout/    # Header, Footer
│   │   ├── providers/ # Web3 providers
│   │   └── ui/        # UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and config
│   └── types/         # TypeScript types
└── public/            # Static assets
```

## 🔒 Security

- Contracts use OpenZeppelin's battle-tested libraries
- ReentrancyGuard protection on critical functions
- Access control with Ownable pattern
- SafeERC20 for secure token transfers
- Testnet deployment recommended for hackathon

## 🧪 Testing

Smart contracts include comprehensive unit tests:
- Vault creation and deposits
- Trade execution and validation
- Withdrawal flows
- Access control
- Trader registry functionality

## 🎯 MVP Features Implemented

- ✅ Smart contracts deployed and tested
- ✅ Wallet connection with RainbowKit
- ✅ Landing page with hero section
- ✅ Yield simulator with projections
- ✅ User dashboard (UI complete)
- ✅ Trader panel (UI complete)
- ✅ Responsive design
- ✅ Modern UI/UX with animations

## 🚧 Future Enhancements

- Real vault creation and management flows
- Live on-chain data integration
- Advanced trading strategies
- Cross-chain compatibility
- DAO governance
- Insurance protocols

## 📄 License

MIT License

## 👥 Contributors

Built for Hackathon 2024

## 🙏 Acknowledgments

- OpenZeppelin for security libraries
- Hardhat for development environment
- Next.js for the frontend framework
- Wagmi and RainbowKit for Web3 integration
