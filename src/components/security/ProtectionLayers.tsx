'use client';

import { motion } from 'framer-motion';

export function ProtectionLayers() {
  const layers = [
    { name: 'Smart Contract Security', level: 100, color: 'from-green-500 to-emerald-500' },
    { name: 'Multi-Sig Protection', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'Real-Time Monitoring', level: 98, color: 'from-purple-500 to-pink-500' },
    { name: 'Code Auditing', level: 100, color: 'from-teal-500 to-blue-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(0, 255, 0, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="protectionGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00ffff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#protectionGrid)" />
        </svg>
      </div>

      {/* Scanning Lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
        style={{
          boxShadow: '0 0 20px #00ff00',
        }}
        animate={{
          y: [0, 400, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-green-400">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            </svg>
          </motion.div>
          Protection Layers Active
        </h3>

        <div className="space-y-6">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">{layer.name}</span>
                <span className="text-green-400 font-bold">{layer.level}%</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                {/* Animated Fill */}
                <motion.div
                  className={`h-full bg-gradient-to-r ${layer.color} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${layer.level}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.2,
                    }}
                  />
                </motion.div>

                {/* Glowing Pulse */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full"
                  style={{
                    boxShadow: `0 0 10px ${layer.color.includes('green') ? '#00ff00' : layer.color.includes('blue') ? '#0099ff' : '#ff00ff'}`,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status Indicator */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3 p-4 bg-black bg-opacity-50 rounded-lg border-2 border-green-400"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 255, 0, 0.3)',
              '0 0 30px rgba(0, 255, 0, 0.5)',
              '0 0 20px rgba(0, 255, 0, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-green-400 font-bold text-lg tracking-wider">
            ALL SYSTEMS SECURED
          </span>
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.75,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

