'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-color-accent-pink rounded-full -ml-[3px] -mt-[3px]"
        />
      ))}
    </div>
  );
}
