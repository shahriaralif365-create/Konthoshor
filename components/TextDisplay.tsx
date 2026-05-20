'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/translations';

interface TextDisplayProps {
  text: string;
  interimText: string;
  onChange: (text: string) => void;
  language?: Language | string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  savedSelection: { start: number; end: number } | null;
  onSelectionChange: (selection: { start: number; end: number } | null) => void;
}

export function TextDisplay({
  text,
  interimText,
  onChange,
  language = 'bengali',
  textareaRef,
  savedSelection,
  onSelectionChange
}: TextDisplayProps) {
  const isRTL = language === 'arabic' || language === 'urdu';

  useEffect(() => {
    if (textareaRef.current) {
      // Only scroll to bottom when finalized text changes, 
      // so we don't interrupt the user's manual editing or scrolling during speech.
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text, textareaRef]);

  const getDisplayValue = () => {
    if (interimText && savedSelection) {
      const { start, end } = savedSelection;
      return text.substring(0, start) + interimText + text.substring(end);
    }
    return text + (interimText ? (text && !text.endsWith(' ') && !text.endsWith('\n') ? ' ' : '') + interimText : '');
  };

  // Keep the cursor positioned programmatically exactly at the correct coordinate range in real-time
  useEffect(() => {
    if (savedSelection && textareaRef.current) {
      const { start, end } = savedSelection;
      const targetStart = interimText ? start + interimText.length : start;
      const targetEnd = interimText ? start + interimText.length : end;
      
      if (textareaRef.current.selectionStart !== targetStart || textareaRef.current.selectionEnd !== targetEnd) {
        textareaRef.current.setSelectionRange(targetStart, targetEnd);
      }
    }
  }, [text, interimText, savedSelection, textareaRef]);

  return (
    <div className="relative w-full flex-1 flex flex-col group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
      <div className="relative flex-1 flex flex-col bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/10 group-focus-within:border-primary/30 group-focus-within:bg-slate-900/60 shadow-2xl min-h-0">
        <textarea
          ref={textareaRef}
          value={getDisplayValue()}
          onChange={(e) => {
            const val = e.target.value;
            const targetStart = e.target.selectionStart;
            const targetEnd = e.target.selectionEnd;

            // Sync selection immediately for physical keyboard inputs (like physical Enter)
            onSelectionChange({ start: targetStart, end: targetEnd });

            if (interimText) {
              if (savedSelection) {
                const { start } = savedSelection;
                if (val.substring(start, start + interimText.length) === interimText) {
                  onChange(val.substring(0, start) + val.substring(start + interimText.length));
                } else {
                  onChange(val);
                }
              } else if (val.endsWith(interimText)) {
                onChange(val.substring(0, val.length - interimText.length).trimEnd());
              } else {
                onChange(val);
              }
            } else {
              onChange(val);
            }
          }}
          onClick={(e) => {
            if (interimText) return; // Lock coordinates during speech!
            onSelectionChange({ start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd });
          }}
          onMouseUp={(e) => {
            if (interimText) return; // Lock coordinates during speech!
            onSelectionChange({ start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd });
          }}
          onKeyUp={(e) => {
            if (interimText) return; // Lock coordinates during speech!
            onSelectionChange({ start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd });
          }}
          placeholder={
            language === 'arabic'
              ? 'راجع الكلمات التي ذكرتها هنا وقم بتحريرها...'
              : language === 'urdu'
                ? 'اپنے کہے ہوئے الفاظ یہاں دیکھیں اور ان میں ترمیم کریں...'
                : language === 'japanese'
                  ? 'ここで話した内容を確認・編集してください...'
                  : language === 'bengali'
                    ? 'আপনার বলা কথাগুলো এখানে দেখুন এবং প্রয়োজনে তা সম্পাদনা করুন...'
                    : 'Review and edit your spoken words here...'
          }
          className="w-full flex-1 min-h-0 p-2.5 sm:p-4 pb-10 bg-transparent text-white text-[clamp(1rem,2.5vw,1.375rem)] resize-none focus:outline-none custom-scrollbar bengali-text placeholder:text-slate-600 leading-relaxed"
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
