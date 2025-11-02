'use client';

import { motion } from 'framer-motion';

export function SecurityVisualization() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-xl overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ffff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Laser Scanners */}
      {/* Horizontal Laser */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
        style={{
          boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
        }}
        animate={{
          y: [0, 256, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Vertical Laser */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
        style={{
          boxShadow: '0 0 10px #0099ff, 0 0 20px #0099ff, 0 0 30px #0099ff',
        }}
        animate={{
          x: [0, 512, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
        }}
      />

      {/* Diagonal Lasers */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent origin-top-left"
        style={{
          boxShadow: '0 0 10px #ff0066, 0 0 20px #ff0066',
          transform: 'rotate(45deg)',
        }}
        animate={{
          x: [-100, 500],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-yellow-400 to-transparent origin-top-right"
        style={{
          boxShadow: '0 0 10px #ffcc00, 0 0 20px #ffcc00',
          transform: 'rotate(-45deg)',
        }}
        animate={{
          x: [100, -500],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
          delay: 1.25,
        }}
      />

      {/* Security Shield Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00ff00" />
                <stop offset="50%" stopColor="#0099ff" />
                <stop offset="100%" stopColor="#00ffff" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M60 10 L90 25 L90 50 C90 70 75 85 60 95 C45 85 30 70 30 50 L30 25 Z"
              fill="url(#shieldGradient)"
              fillOpacity="0.8"
              filter="url(#glow)"
            />
            <path
              d="M60 10 L90 25 L90 50 C90 70 75 85 60 95 C45 85 30 70 30 50 L30 25 Z"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />
            <text
              x="60"
              y="65"
              textAnchor="middle"
              fontSize="48"
              fill="#ffffff"
              fontWeight="bold"
            >
              ✓
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Corner Security Indicators */}
      {[
        { top: '10px', left: '10px' },
        { top: '10px', right: '10px' },
        { bottom: '10px', left: '10px' },
        { bottom: '10px', right: '10px' },
      ].map((position, index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 bg-green-400 rounded-full"
          style={{
            ...position,
            boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      ))}

      {/* Security Status Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="text-green-400 font-bold text-sm tracking-wider flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          MAXIMUM SECURITY ACTIVE
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </motion.div>
      </div>
    </div>
  );
}

