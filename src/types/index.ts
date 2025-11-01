export type VaultStatus = 'Active' | 'Completed' | 'Paused';

export interface VaultData {
  id: number;
  owner: string;
  trader: string;
  initialAmount: bigint;
  currentBalance: bigint;
  stablecoinAddress: string;
  status: VaultStatus;
  startTime: bigint;
  endTime: bigint;
  totalReturns: bigint;
}

export interface Trade {
  id: number;
  isBuy: boolean;
  amount: bigint;
  timestamp: bigint;
  price: bigint;
}

export interface Trader {
  traderAddress: string;
  reputationScore: number;
  totalVaults: number;
  completedVaults: number;
  totalVolume: bigint;
  averageReturns: bigint;
  isRegistered: boolean;
  registrationDate: bigint;
}

export interface UserDashboard {
  totalInvestment: bigint;
  currentBalance: bigint;
  totalReturn: bigint;
  vaultStatus: VaultStatus;
  vaults: VaultData[];
  performanceHistory: PerformanceData[];
  tradeHistory: Trade[];
}

export interface PerformanceData {
  date: Date;
  value: number;
  returns: number;
}

export interface SimulatorInputs {
  investmentAmount: number;
  timePeriod: number; // in months
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
}

export interface SimulatorResult {
  projectedReturns: number;
  scenarios: {
    conservative: number[];
    moderate: number[];
    aggressive: number[];
  };
  comparison: {
    defi: number;
    staking: number;
    vault: number;
  };
}

