import Link from 'next/link';
import { Header } from '@/components/layout/Header';

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

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deposit</h3>
              <p className="text-gray-600">
                Choose a professional trader and deposit your funds into a secure vault
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trade</h3>
              <p className="text-gray-600">
                Watch as your trader executes profitable strategies in real-time
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn</h3>
              <p className="text-gray-600">
                Withdraw your profits anytime with full transparency and security
              </p>
            </div>
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
