'use client';
// Refreshed layout: mobile-optimized layout
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Trash2, Download, FileText } from 'lucide-react';
import { Document, Packer, Paragraph } from 'docx';
import { translations, Language } from '@/lib/translations';

interface ControlBarProps {
  text: string;
  onClear: () => void;
  language?: Language | string;
  children?: React.ReactNode;
}

export const ControlBar = memo(function ControlBar({ text, onClear, language = 'bengali', children }: ControlBarProps) {
  const [copied, setCopied] = useState(false);
  const translationKey = (language in translations) ? (language as Language) : 'english';
  const t = translations[translationKey].ui;
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
    <div className="w-full flex flex-row items-center justify-between gap-1 sm:gap-3 p-1.5 sm:p-3 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
      
      {/* Left: Statistics on Desktop, Download buttons on Mobile */}
      <div className="flex-1 flex items-center justify-start gap-1 sm:gap-2 order-1 min-w-0">
        {/* Desktop Statistics */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <div className="glass-card px-2 sm:px-4 py-1 sm:py-1.5 border border-white/5 flex flex-col items-center sm:items-start min-w-[50px] sm:min-w-[70px]">
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.words}</span>
            <span className="text-xs sm:text-base font-bold text-white tabular-nums leading-none">{wordCount}</span>
          </div>
          <div className="glass-card px-2 sm:px-4 py-1 sm:py-1.5 border border-white/5 flex flex-col items-center sm:items-start min-w-[50px] sm:min-w-[70px]">
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 bengali-text">{t.chars}</span>
            <span className="text-xs sm:text-base font-bold text-white tabular-nums leading-none">{charCount}</span>
          </div>
        </div>

        {/* Mobile Download Buttons */}
        <div className="flex sm:hidden items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('txt')}
            disabled={!text}
            className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download TXT"
          >
            <Download size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('docx')}
            disabled={!text}
            className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download DOCX"
          >
            <FileText size={16} />
          </motion.button>
        </div>
      </div>

      {/* Center: Mic Button */}
      <div className="flex items-center justify-center order-2 shrink-0 px-2 sm:px-4">
        {children}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2 order-3 min-w-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          disabled={!text}
          className={`flex items-center justify-center min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[125px] gap-2 px-3 sm:px-5 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-all font-bold text-[10px] sm:text-xs uppercase tracking-wider ${
            copied 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
        >
          {copied ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
          <span className="bengali-text hidden sm:inline">{copied ? t.copied : t.copy}</span>
        </motion.button>

        {/* Desktop-only Download Buttons Wrapper */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('txt')}
            disabled={!text}
            className="min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download TXT"
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('docx')}
            disabled={!text}
            className="min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center justify-center transition-all disabled:opacity-30"
            title="Download DOCX"
          >
            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
          </motion.button>
        </div>

        {/* Trash button (always visible) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          disabled={!text}
          className="min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center transition-all disabled:opacity-30"
          title="Clear Text"
        >
          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        </motion.button>
      </div>
    </div>
  );
});
