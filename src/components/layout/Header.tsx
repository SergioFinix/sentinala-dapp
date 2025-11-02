'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Centilena
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
            Dashboard
          </Link>
          <Link href="/trader" className="text-gray-700 hover:text-blue-600 transition">
            Trader Panel
          </Link>
          <Link href="/simulator" className="text-gray-700 hover:text-blue-600 transition">
            Yield Simulator
          </Link>
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
}

