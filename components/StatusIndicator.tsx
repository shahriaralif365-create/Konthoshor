'use client';

import { motion } from 'framer-motion';
import { Mic, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import { translations, Language } from '@/lib/translations';

interface StatusIndicatorProps {
  status: 'ready' | 'listening' | 'processing' | 'not-supported';
  language?: Language;
}

export function StatusIndicator({ status, language = 'bengali' }: StatusIndicatorProps) {
  const t = translations[language].status;
  
  const getLabel = () => {
    switch(status) {
      case 'ready': return t.ready;
      case 'listening': return t.listening;
      case 'processing': return t.processing;
      case 'not-supported': return t.notSupported;
      default: return t.ready;
    }
  };

  const statusConfig = {
    ready: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      glowColor: 'shadow-emerald-500/20',
    },
    listening: {
      icon: Mic,
      color: 'text-primary',
      dotColor: 'bg-primary',
      glowColor: 'shadow-primary/20',
    },
    processing: {
      icon: Loader2,
      color: 'text-accent',
      dotColor: 'bg-accent',
      glowColor: 'shadow-accent/20',
    },
    'not-supported': {
      icon: AlertCircle,
      color: 'text-red-400',
      dotColor: 'bg-red-400',
      glowColor: 'shadow-red-500/20',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-white/5 ${config.glowColor} shadow-lg`}
    >
      <div className="relative flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full ${config.dotColor} relative z-10`} />
        {(status === 'listening' || status === 'processing') && (
          <motion.div
            className={`absolute inset-0 w-2 h-2 rounded-full ${config.dotColor}`}
            animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${config.color} bengali-text`}>
        {getLabel()}
      </span>
    </motion.div>
  );
}
