'use client';

import { motion } from 'framer-motion';

interface SecurityIndicatorProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'active' | 'secured' | 'monitoring';
}

function SecurityIndicator({ icon, label, value, status }: SecurityIndicatorProps) {
  const statusColors = {
    active: 'text-green-400',
    secured: 'text-blue-400',
    monitoring: 'text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700 overflow-hidden"
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${label}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ffff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${label})`} />
        </svg>
      </div>

      <div className="relative z-10">
        <div className={`flex items-center gap-3 mb-3 ${statusColors[status]}`}>
          <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
          <span className="font-semibold text-sm">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <motion.div
          className="h-1 bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className={`h-full ${
              status === 'active' ? 'bg-green-400' :
              status === 'secured' ? 'bg-blue-400' : 'bg-yellow-400'
            }`}
            animate={{
              boxShadow: [
                `0 0 5px ${status === 'active' ? '#00ff00' : status === 'secured' ? '#0099ff' : '#ffcc00'}`,
                `0 0 15px ${status === 'active' ? '#00ff00' : status === 'secured' ? '#0099ff' : '#ffcc00'}`,
                `0 0 5px ${status === 'active' ? '#00ff00' : status === 'secured' ? '#0099ff' : '#ffcc00'}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SecurityIndicators() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SecurityIndicator
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        label="Smart Contracts"
        value="Verified"
        status="secured"
      />
      <SecurityIndicator
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        label="Encryption"
        value="AES-256"
        status="active"
      />
      <SecurityIndicator
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        }
        label="24/7 Monitoring"
        value="Active"
        status="monitoring"
      />
      <SecurityIndicator
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Audit Status"
        value="Passed"
        status="secured"
      />
    </div>
  );
}

