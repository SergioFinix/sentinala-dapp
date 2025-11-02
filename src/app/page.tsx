'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SecurityVisualization } from '@/components/security/SecurityVisualization';
import { SecurityIndicators } from '@/components/security/SecurityIndicators';
import { ProtectionLayers } from '@/components/security/ProtectionLayers';
import { LaserSecurityGrid } from '@/components/security/LaserSecurityGrid';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              DeFi Trading Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Deposit your funds in professional trading vaults and let expert traders 
              manage your portfolio. Earn passive returns while maintaining full control.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/simulator"
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Try Simulator
              </Link>
            </div>
          </div>
        </section>

        {/* Security Section - Featured Prominently */}
        <section className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  Máxima Seguridad para tu Inversión
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Tu dinero está protegido por sistemas avanzados de seguridad con monitoreo 24/7
                </p>
              </motion.div>

              {/* Security Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-30">
                          <span className="text-4xl">🛡️</span>
                        </div>
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-bold mb-2">Sistema de Seguridad Activo</h3>
                        <p className="text-green-100 text-lg">Monitoreo avanzado protegiendo tu inversión en tiempo real</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl"
                    >
                      ✓
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Laser Security Grid - Main Feature */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-12"
              >
                <LaserSecurityGrid />
              </motion.div>

              {/* Security Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <SecurityVisualization />
              </motion.div>

              {/* Security Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-12"
              >
                <SecurityIndicators />
              </motion.div>

              {/* Protection Layers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <ProtectionLayers />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deposit</h3>
              <p className="text-gray-600">
                Choose a professional trader and deposit your funds into a secure vault
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trade</h3>
              <p className="text-gray-600">
                Watch as your trader executes profitable strategies in real-time
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn</h3>
              <p className="text-gray-600">
                Withdraw your profits anytime with full transparency and security
              </p>
            </motion.div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold mb-2">$0</div>
                <div className="text-blue-100">Total Value Locked</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0%</div>
                <div className="text-blue-100">Average Yield</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join our platform and start your DeFi journey today
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Vaults
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
