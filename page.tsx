'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const MONTHS = ['Month 0', 'Month 3', 'Month 6', 'Month 9', 'Month 12'];

export default function SimulatorPage() {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [timePeriod, setTimePeriod] = useState(12);
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // Calculate projections based on risk level
  const calculateProjections = () => {
    const monthlyRates = {
      conservative: 0.005, // 0.5% per month
      moderate: 0.01,      // 1% per month
      aggressive: 0.015,   // 1.5% per month
    };

    const rate = monthlyRates[riskLevel];
    const data = [];
    
    for (let i = 0; i <= timePeriod / 3; i++) {
      const months = i * 3;
      const value = investmentAmount * Math.pow(1 + rate, months);
      data.push({
        month: MONTHS[Math.min(i, 4)],
        value: Number(value.toFixed(2)),
      });
    }

    return data;
  };

  const projections = calculateProjections();
  const projectedReturns = projections[projections.length - 1].value - investmentAmount;
  const projectedAPY = (Math.pow(projections[projections.length - 1].value / investmentAmount, 12 / timePeriod) - 1) * 100;

  const comparisonData = [
    {
      name: 'Traditional DeFi',
      value: investmentAmount * 1.05, // 5% APY
    },
    {
      name: 'Staking',
      value: investmentAmount * 1.08, // 8% APY
    },
    {
      name: 'Centinela Vault',
      value: projections[projections.length - 1].value,
    },
  ];

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
              Yield Simulator
            </h1>
            <p className="text-gray-600 mb-8">
              Project your potential returns before investing
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-6">Simulation Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="100"
                    max="1000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period (Months)
                  </label>
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="3"
                    max="24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="conservative">Conservative (6% APY)</option>
                    <option value="moderate">Moderate (12% APY)</option>
                    <option value="aggressive">Aggressive (18% APY)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Projected APY</div>
                <div className="text-2xl font-bold text-blue-600">{projectedAPY.toFixed(2)}%</div>
              </div>
            </motion.div>

            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-6">Projection Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 6 }}
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-2">Initial Investment</div>
              <div className="text-3xl font-bold text-gray-900">${investmentAmount.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-2">Projected Value</div>
              <div className="text-3xl font-bold text-green-600">
                ${projections[projections.length - 1].value.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-sm text-gray-600 mb-2">Total Returns</div>
              <div className="text-3xl font-bold text-blue-600">
                ${projectedReturns.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Comparison Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-6">Comparison with Other DeFi Options</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg"
          >
            <div className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> These projections are for illustrative purposes only and do not guarantee future returns. 
              Past performance does not guarantee future results. Cryptocurrency investments are subject to high volatility and risk.
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

