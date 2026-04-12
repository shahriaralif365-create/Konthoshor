'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

export function Header() {
  return (
    <motion.div
      className="flex items-center justify-center gap-1 mb-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <Mic className="w-5 h-5 text-blue-400" />
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        কণ্ঠস্বর
      </h1>
    </motion.div>
  );
}
