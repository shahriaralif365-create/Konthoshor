'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextDisplayProps {
  text: string;
  interimText: string;
  onChange: (text: string) => void;
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
}

export function TextDisplay({ text, interimText, onChange, language = 'bengali' }: TextDisplayProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = language === 'arabic' || language === 'urdu';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text, interimText]);

  return (
    <div className="relative w-full h-full flex flex-col group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
      <div className="relative flex-1 flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/10 group-focus-within:border-primary/30 group-focus-within:bg-slate-900/60 shadow-2xl min-h-[200px] sm:min-h-0">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            language === 'arabic'
              ? 'راجع الكلمات التي ذكرتها هنا وقم بتحريرها...'
              : language === 'urdu'
                ? 'اپنے کہے ہوئے الفاظ یہاں دیکھیں اور ان میں ترمیم کریں...'
                : language === 'english'
                  ? 'Review and edit your spoken words here...'
                  : 'আপনার বলা কথাগুলো এখানে দেখুন এবং প্রয়োজনে তা সম্পাদনা করুন...'
          }
          className={`w-full h-full p-5 sm:p-7 bg-transparent text-white text-lg sm:text-xl resize-none focus:outline-none custom-scrollbar bengali-text placeholder:text-slate-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />

        {/* Interim Text Overlay */}
        <AnimatePresence>
          {interimText && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`absolute bottom-6 ${isRTL ? 'right-6 left-6 text-right' : 'left-6 right-6 text-left'} p-4 rounded-xl bg-primary/10 border border-primary/20 text-base text-primary bengali-text pointer-events-none shadow-lg backdrop-blur-md`}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <span className="inline-block animate-pulse mr-2 text-xs">●</span>
              {interimText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
