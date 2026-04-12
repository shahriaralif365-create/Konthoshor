'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, FileText, Trash2 } from 'lucide-react';
import { Document, Packer, Paragraph } from 'docx';

interface ControlBarProps {
  text: string;
  onClear: () => void;
}

export function ControlBar({ text, onClear }: ControlBarProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    
    try {
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `bangla-voice-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleDownloadWord = async () => {
    if (!text) return;
    
    try {
      const doc = new Document({
        sections: [
          {
            children: text.split('\n').map(
              (paragraph) =>
                new Paragraph({
                  text: paragraph || ' ',
                })
            ),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = `bangla-voice-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error('Failed to download Word document:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-2">
      {/* Statistics */}
      <div className="flex gap-3 justify-center">
        <motion.div
          className="px-4 py-2 rounded-lg text-center bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-sky-400/20 hover:border-sky-400/40 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Characters</p>
          <p className="text-xl font-bold text-sky-300">{characterCount}</p>
        </motion.div>
        <motion.div
          className="px-4 py-2 rounded-lg text-center bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-sky-400/20 hover:border-sky-400/40 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Words</p>
          <p className="text-xl font-bold text-sky-300">{wordCount}</p>
        </motion.div>
      </div>

      {/* Control buttons */}
      <div className="rounded-xl p-3 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-sky-400/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Copy button */}
          <motion.button
            ref={copyButtonRef}
            onClick={handleCopy}
            disabled={!text}
            className={`px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
              text
                ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-sky-200 border border-sky-400/30 cursor-pointer'
                : 'bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            whileHover={text ? { scale: 1.05 } : undefined}
            whileTap={text ? { scale: 0.95 } : undefined}
            title="Copy to clipboard"
          >
            <Copy size={16} />
            Copy
          </motion.button>

          {/* Download button */}
          <motion.button
            onClick={handleDownload}
            disabled={!text}
            className={`px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
              text
                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-400/30 cursor-pointer'
                : 'bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            whileHover={text ? { scale: 1.05 } : undefined}
            whileTap={text ? { scale: 0.95 } : undefined}
            title="Download as .txt"
          >
            <Download size={16} />
            TXT
          </motion.button>

          {/* Download as Word button */}
          <motion.button
            onClick={handleDownloadWord}
            disabled={!text}
            className={`px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
              text
                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-400/30 cursor-pointer'
                : 'bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            whileHover={text ? { scale: 1.05 } : undefined}
            whileTap={text ? { scale: 0.95 } : undefined}
            title="Download as .docx"
          >
            <FileText size={16} />
            DOCX
          </motion.button>

          {/* Clear button */}
          <motion.button
            onClick={onClear}
            disabled={!text}
            className={`px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
              text
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-400/30 cursor-pointer'
                : 'bg-slate-800/20 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            whileHover={text ? { scale: 1.05 } : undefined}
            whileTap={text ? { scale: 0.95 } : undefined}
            title="Clear all text"
          >
            <Trash2 size={16} />
            Clear
          </motion.button>
        </div>
      </div>
    </div>
  );
}
