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
  children?: React.ReactNode;
}

export function ControlBar({ text, onClear, language = 'bengali', children }: ControlBarProps) {
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
    <div className={`w-full flex flex-col xl:flex-row items-center justify-between gap-3 p-2 sm:p-3 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md ${isRTL ? 'xl:flex-row-reverse' : ''}`}>
      
      {/* Left: Statistics */}
      <div className={`flex items-center justify-center xl:justify-start gap-2 w-full xl:w-1/3 order-2 xl:order-1 ${isRTL ? 'xl:justify-end' : ''}`}>
        <div className="glass-card px-3 sm:px-4 py-1.5 border border-white/5 flex flex-col items-center xl:items-start min-w-[70px]">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.words}</span>
          <span className="text-sm sm:text-base font-bold text-white tabular-nums leading-none">{wordCount}</span>
        </div>
        <div className="glass-card px-3 sm:px-4 py-1.5 border border-white/5 flex flex-col items-center xl:items-start min-w-[70px]">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.chars}</span>
          <span className="text-sm sm:text-base font-bold text-white tabular-nums leading-none">{charCount}</span>
        </div>
      </div>

      {/* Center: Mic Button (passed as children) */}
      <div className="flex items-center justify-center w-full xl:w-1/3 order-1 xl:order-2 shrink-0 py-1">
        {children}
      </div>

      {/* Right: Action Buttons */}
      <div className={`flex flex-wrap items-center justify-center xl:justify-end gap-2 w-full xl:w-1/3 order-3 ${isRTL ? 'xl:justify-start' : ''}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          disabled={!text}
          className={`flex-1 sm:flex-none flex items-center justify-center min-h-[44px] gap-2 px-5 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
            copied 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="bengali-text hidden xs:inline">{copied ? t.copied : t.copy}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('txt')}
            disabled={!text}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download TXT"
          >
            <Download size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('docx')}
            disabled={!text}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download DOCX"
          >
            <FileText size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            disabled={!text}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Clear Text"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
