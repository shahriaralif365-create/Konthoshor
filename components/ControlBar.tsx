'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Trash2, Download, FileText } from 'lucide-react';
import { Document, Packer, Paragraph } from 'docx';
import { translations } from '@/lib/translations';

interface ControlBarProps {
  text: string;
  onClear: () => void;
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
}

export function ControlBar({ text, onClear, language = 'bengali' }: ControlBarProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[language].ui;
  const isRTL = language === 'arabic' || language === 'urdu';

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (type: 'txt' | 'docx') => {
    if (!text) return;
    
    if (type === 'txt') {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `konthoshor-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const doc = new Document({
        sections: [{
          properties: {},
          children: text.split('\n').map(line => new Paragraph({ text: line || ' ' })),
        }],
      });

      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `konthoshor-${new Date().getTime()}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${isRTL ? 'items-end' : 'items-start'}`}>
      <div className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        {/* Statistics Cards - Restored for Premium Look */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none glass-card px-2 sm:px-4 py-1.5 sm:py-2 border border-white/5 flex flex-col items-center sm:items-start min-w-[60px] sm:min-w-[80px]">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.words}</span>
            <span className="text-lg sm:text-xl font-bold text-white tabular-nums">{wordCount}</span>
          </div>
          <div className="flex-1 sm:flex-none glass-card px-2 sm:px-4 py-1.5 sm:py-2 border border-white/5 flex flex-col items-center sm:items-start min-w-[60px] sm:min-w-[80px]">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.chars}</span>
            <span className="text-lg sm:text-xl font-bold text-white tabular-nums">{charCount}</span>
          </div>
        </div>

        {/* Action Buttons - All Options Restored */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            disabled={!text}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
              copied 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="bengali-text">{copied ? t.copied : t.copy}</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload('txt')}
              disabled={!text}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
              title="Download TXT"
            >
              <Download size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload('docx')}
              disabled={!text}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
              title="Download DOCX"
            >
              <FileText size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              disabled={!text}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center transition-all disabled:opacity-30"
              title="Clear Text"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
