'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextDisplayProps {
  text: string;
  interimText: string;
  onChange: (text: string) => void;
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function TextDisplay({ text, interimText, onChange, language = 'bengali', textareaRef }: TextDisplayProps) {
  const isRTL = language === 'arabic' || language === 'urdu';

  useEffect(() => {
    if (textareaRef.current) {
      // Only scroll to bottom when finalized text changes, 
      // so we don't interrupt the user's manual editing or scrolling during speech.
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="relative w-full flex-1 flex flex-col group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
      <div className="relative flex-1 flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/10 group-focus-within:border-primary/30 group-focus-within:bg-slate-900/60 shadow-2xl min-h-0">
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
          className={`w-full flex-1 min-h-0 p-2.5 sm:p-4 pb-20 bg-transparent text-white text-[clamp(1rem,2.5vw,1.375rem)] resize-none focus:outline-none custom-scrollbar bengali-text placeholder:text-slate-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />

        {/* Interim Text Overlay - More Compact */}
        <AnimatePresence>
          {interimText && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`absolute bottom-2 ${isRTL ? 'right-2 left-2 text-right' : 'left-2 right-2 text-left'} p-2.5 rounded-lg bg-primary/20 border border-primary/30 text-sm text-primary bengali-text pointer-events-none shadow-lg backdrop-blur-xl z-20`}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <span className="inline-block animate-pulse mr-1.5 text-[8px]">●</span>
              {interimText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
