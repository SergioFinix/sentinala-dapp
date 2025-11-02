'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LaserBeam {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay: number;
}

export function LaserSecurityGrid() {
  const [beams, setBeams] = useState<LaserBeam[]>([]);

  useEffect(() => {
    // Generate random laser beams
    const generateBeams = () => {
      const newBeams: LaserBeam[] = [];
      const colors = ['#00ff00', '#0099ff', '#ff00ff', '#ffcc00', '#00ffff'];
      
      for (let i = 0; i < 8; i++) {
        newBeams.push({
          id: i,
          x1: Math.random() * 100,
          y1: Math.random() * 100,
          x2: Math.random() * 100,
          y2: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
        });
      }
      setBeams(newBeams);
    };

    generateBeams();
    const interval = setInterval(generateBeams, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden border-2 border-gray-800">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="laserGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ffff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#laserGrid)" />
        </svg>
      </div>

      {/* Laser Beams - Using SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {beams.map((beam) => (
          <motion.line
            key={beam.id}
            x1={`${beam.x1}%`}
            y1={`${beam.y1}%`}
            x2={`${beam.x2}%`}
            y2={`${beam.y2}%`}
            stroke={beam.color}
            strokeWidth="2"
            opacity={0.8}
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: beam.delay,
              ease: 'easeInOut',
            }}
            style={{
              filter: `drop-shadow(0 0 4px ${beam.color}) drop-shadow(0 0 8px ${beam.color})`,
            }}
          />
        ))}
      </svg>

      {/* Scanning Circles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-green-400 rounded-full"
          style={{
            width: '200px',
            height: '200px',
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
            boxShadow: '0 0 20px #00ff00, inset 0 0 20px #00ff00',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Security Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
               style={{
                 boxShadow: '0 0 40px rgba(0, 255, 0, 0.5), 0 0 80px rgba(0, 255, 0, 0.3)',
               }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-white text-5xl font-bold"
            >
              🔒
            </motion.div>
          </div>
          
          {/* Rotating Ring */}
          <motion.div
            className="absolute inset-0 border-4 border-green-400 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              borderStyle: 'dashed',
              boxShadow: '0 0 20px #00ff00',
            }}
          />
        </motion.div>
      </div>

      {/* Corner Detectors */}
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((position, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16"
          style={position}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <motion.path
              d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
              fill="none"
              stroke="#00ff00"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                filter: 'drop-shadow(0 0 5px #00ff00)',
              }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="15"
              fill="#00ff00"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Status Text */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <motion.div
          className="text-green-400 font-bold text-lg tracking-widest flex items-center justify-center gap-3"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <motion.span
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              boxShadow: [
                '0 0 10px #00ff00',
                '0 0 20px #00ff00',
                '0 0 10px #00ff00',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          SECURITY ACTIVE
          <motion.span
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              boxShadow: [
                '0 0 10px #00ff00',
                '0 0 20px #00ff00',
                '0 0 10px #00ff00',
              ],
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

