'use client';

import { motion } from 'framer-motion';
import { Mic, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'ready' | 'listening' | 'processing' | 'not-supported';
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
}

export function StatusIndicator({ status, language = 'english' }: StatusIndicatorProps) {
  const getLabel = () => {
    switch(status) {
      case 'ready':
        return language === 'bengali' ? 'প্রস্তুত' : language === 'english' ? 'Ready' : language === 'arabic' ? 'جاهز' : 'تیار';
      case 'listening':
        return language === 'bengali' ? 'শুনছি' : language === 'english' ? 'Listening' : language === 'arabic' ? 'استماع' : 'سن رہے ہیں';
      case 'processing':
        return language === 'bengali' ? 'প্রক্রিয়া করছি' : language === 'english' ? 'Processing' : language === 'arabic' ? 'المعالجة' : 'پروسیس کر رہے ہیں';
      case 'not-supported':
        return language === 'bengali' ? 'বিরত' : language === 'english' ? 'Not Supported' : language === 'arabic' ? 'غير مدعوم' : 'تعاون یافتہ نہیں';
      default:
        return 'Ready';
    }
  };

  const statusConfig = {
    ready: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      dotColor: 'bg-emerald-400',
      borderColor: 'border-emerald-400/30',
    },
    listening: {
      icon: Mic,
      color: 'text-sky-400',
      bgColor: 'bg-sky-400/10',
      dotColor: 'bg-sky-400',
      borderColor: 'border-sky-400/30',
    },
    processing: {
      icon: Loader2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      dotColor: 'bg-cyan-400',
      borderColor: 'border-cyan-400/30',
    },
    'not-supported': {
      icon: AlertCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      dotColor: 'bg-amber-400',
      borderColor: 'border-amber-400/30',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div 
      className={`flex items-center gap-3 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor} backdrop-blur-sm`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
        {status === 'listening' && (
          <motion.div
            className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${config.dotColor}`}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {status === 'processing' && (
          <motion.div
            className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${config.dotColor}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, linear: true }}
          />
        )}
      </div>
      <span className={`text-sm font-semibold ${config.color}`}>{getLabel()}</span>
    </motion.div>
  );
}
