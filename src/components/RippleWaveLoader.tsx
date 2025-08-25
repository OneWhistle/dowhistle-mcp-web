import React from 'react';
import { motion } from 'framer-motion';

interface RippleWaveLoaderProps {
  barCount?: number;
  className?: string;
  barClassName?: string;
}

export default function RippleWaveLoader({
  barCount = 7,
  className,
  barClassName,
}: RippleWaveLoaderProps) {
  return (
    <div className={`flex items-end justify-center space-x-1 ${className ?? ''}`}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-8 w-2 rounded-full bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-700 ${barClassName ?? ''}`}
          animate={{
            scaleY: [0.6, 1.6, 0.6],
            scaleX: [1, 0.85, 1],
            translateY: ['0%', '-20%', '0%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.08,
          }}
        />
      ))}
    </div>
  );
}


