'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

interface MicButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function MicButton({ isListening, onStart, onStop, disabled = false }: MicButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group flex items-center justify-center">
        {/* Animated Rings - Subtle */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-red-500/30"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                className="absolute inset-0 rounded-full bg-red-500/20"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                className="absolute inset-0 rounded-full bg-red-500/10"
              />
            </>
          )}
        </AnimatePresence>
 
        {/* Glow Effect */}
        <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
          isListening ? 'bg-red-500/10 opacity-30' : 'bg-primary/10'
        }`} />
 
        {/* Main Button - More Compact */}
        <motion.button
          onClick={isListening ? onStop : onStart}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0)",
              "0 0 0 20px rgba(239, 68, 68, 0.1)",
              "0 0 0 0 rgba(239, 68, 68, 0)"
            ]
          } : {}}
          transition={isListening ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
          className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'bg-sky-400 shadow-primary/10 text-slate-900 hover:bg-primary hover:text-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isListening ? (
            <Square size={20} fill="currentColor" />
          ) : (
            <Mic size={24} />
          )}
        </motion.button>
      </div>
    </div>
  );
}
