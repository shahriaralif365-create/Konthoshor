'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TextDisplayProps {
  text: string;
  interimText: string;
  onChange: (text: string) => void;
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
}

// Arabic diacritics - No longer needed
// const HARAKAT = { ... }

export function TextDisplay({ text, interimText, onChange, language = 'bengali' }: TextDisplayProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom and ensure text sync
  useEffect(() => {
    if (textareaRef.current) {
      // Ensure textarea value is synced
      textareaRef.current.value = text;
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text]);

  // Force clear the textarea when text becomes empty
  useEffect(() => {
    if (text === '' && textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.textContent = '';
    }
  }, [text]);

  // Track text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        className="w-full h-64 bg-slate-900/60 backdrop-blur-sm px-2 py-4 text-base leading-relaxed border border-sky-400/30 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all duration-300 resize-none text-slate-100 placeholder-slate-500/50 rounded-xl font-medium"
        style={language === 'arabic' || language === 'urdu' ? { direction: 'rtl', textAlign: 'right' } : { textAlign: 'left' }}
        placeholder={
          language === 'arabic'
            ? 'اكتب أو تحدث هنا...'
            : language === 'urdu'
            ? 'اپنی آواز یہاں لکھیں اور ترمیم کریں...'
            : language === 'english'
            ? 'View and edit your voice here...'
            : 'আপনার কণ্ঠস্বর দেখুন এবং সম্পাদনা করুন...'
        }
      />
      {interimText && (
        <div 
          className="mt-2 p-3 bg-sky-500/10 border border-sky-400/30 text-base text-sky-300/80 animate-pulse rounded-lg w-full backdrop-blur-sm"
          style={language === 'arabic' || language === 'urdu' ? { direction: 'rtl', textAlign: 'right'} : { textAlign: 'left' }}
        >
          {interimText}
        </div>
      )}
    </motion.div>
  );
}
