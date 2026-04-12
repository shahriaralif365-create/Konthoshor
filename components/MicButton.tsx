'use client';

import { motion } from 'framer-motion';
import { Mic, Square } from 'lucide-react';

interface MicButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function MicButton({ isListening, onStart, onStop, disabled = false }: MicButtonProps) {
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Ripple animations */}
        {isListening &&
          [0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full border-2 border-sky-400/50"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.3,
                repeat: Infinity,
              }}
            />
          ))}

        {/* Main button */}
        <motion.button
          onClick={handleClick}
          disabled={disabled}
          className={`relative w-16 h-16 rounded-full font-semibold text-white flex items-center justify-center transition-all duration-300 shadow-xl ${
            isListening
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50'
              : 'bg-gradient-to-br from-sky-500 to-cyan-500 hover:shadow-lg hover:shadow-sky-500/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          whileHover={!disabled ? { scale: 1.08 } : undefined}
          whileTap={!disabled ? { scale: 0.92 } : undefined}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Square size={24} fill="currentColor" />
            </motion.div>
          ) : (
            <Mic size={24} />
          )}
        </motion.button>
      </div>

      {/* Status text */}
      <motion.p
        className="text-sm font-semibold text-slate-300"
        animate={{ opacity: isListening ? 1 : 0.8 }}
      >
        {isListening ? 'Tap to stop' : 'Tap to start'}
      </motion.p>
    </div>
  );
}
