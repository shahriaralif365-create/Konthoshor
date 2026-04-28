'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusIndicator } from './StatusIndicator';
import { MicButton } from './MicButton';
import { TextDisplay } from './TextDisplay';
import { ControlBar } from './ControlBar';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextStorage } from '@/hooks/useTextStorage';
import { translations, Language } from '@/lib/translations';

interface VoiceTyperProps {
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  isPunctuationEnabled?: boolean;
}

const LANGUAGES = [
  { id: 'bengali', label: 'বাংলা', code: 'bn-BD' },
  { id: 'english', label: 'English', code: 'en-US' },
  { id: 'arabic', label: 'العربية', code: 'ar-SA' },
  { id: 'urdu', label: 'اردو', code: 'ur-PK' },
] as const;

export function VoiceTyper({
  language: externalLanguage,
  onLanguageChange,
  isPunctuationEnabled = false
}: VoiceTyperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [internalLanguage, setInternalLanguage] = useState<Language>('bengali');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const language = externalLanguage || internalLanguage;
  const t = translations[language];
  const isRTL = language === 'arabic' || language === 'urdu';

  const currentLangObj = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];
  const languageCode = currentLangObj.code;

  const storageKey =
    language === 'bengali' ? 'bangla-voice-text' :
      language === 'english' ? 'english-voice-text' :
        language === 'arabic' ? 'arabic-voice-text' :
          'urdu-voice-text';

  const { text, setText, clearText } = useTextStorage(storageKey);

  const handleFinalResult = useCallback((newText: string) => {
    if (!isMounted) return;

    let processedSegment = newText;

    if (isPunctuationEnabled) {
      if (language === 'bengali') {
        processedSegment = processedSegment.replace(/কমা দাও|কমা/g, ',');
        processedSegment = processedSegment.replace(/দাঁড়ি দাও|দাঁড়ি/g, '।');
        processedSegment = processedSegment.replace(/প্রশ্নবোধক চিহ্ন দাও|প্রশ্নবোধক চিহ্ন/g, '?');
        processedSegment = processedSegment.replace(/বিস্ময়বোধক চিহ্ন দাও|বিস্ময়বোধক চিহ্ন/g, '!');
      } else if (language === 'english') {
        processedSegment = processedSegment.replace(/give comma|comma/gi, ',');
        processedSegment = processedSegment.replace(/give period|period/gi, '.');
        processedSegment = processedSegment.replace(/give question mark|question mark/gi, '?');
        processedSegment = processedSegment.replace(/give exclamation mark|exclamation mark/gi, '!');
      } else if (language === 'arabic') {
        processedSegment = processedSegment.replace(/فاصلة/g, '،');
        processedSegment = processedSegment.replace(/نقط/g, '.');
        processedSegment = processedSegment.replace(/علامة استفهام/g, '؟');
        processedSegment = processedSegment.replace(/علامة تعجب/g, '!');
      } else if (language === 'urdu') {
        processedSegment = processedSegment.replace(/کوما/g, '،');
        processedSegment = processedSegment.replace(/مقدس/g, '۔');
        processedSegment = processedSegment.replace(/سوالیہ نشان/g, '؟');
        processedSegment = processedSegment.replace(/تعجب/g, '!');
      }
    }

    setText((prev: string) => {
      const start = textareaRef.current?.selectionStart ?? prev.length;
      const end = textareaRef.current?.selectionEnd ?? prev.length;
      const before = prev.substring(0, start);
      const after = prev.substring(end);

      // Trim the segment to handle spacing manually and avoid doubles
      const trimmedSegment = processedSegment.trim();
      if (!trimmedSegment) return prev;

      // Logic: If there is text before, and it doesn't end with space/newline, add one space.
      const needsLeadingSpace = before && !before.endsWith(' ') && !before.endsWith('\n');

      // Logic: If there is text after, and it doesn't start with space/newline, add one space.
      const needsTrailingSpace = after && !after.startsWith(' ') && !after.startsWith('\n');

      const combined =
        before +
        (needsLeadingSpace ? ' ' : '') +
        trimmedSegment +
        (needsTrailingSpace ? ' ' : '') +
        after;

      // Clean up: Replace multiple spaces with a single space and fix punctuation spacing
      const final = combined.replace(/ +/g, ' ').replace(/\s+([,।?!.،।])/g, '$1');

      // Update cursor position after the text is updated
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = before.length + (needsLeadingSpace ? 1 : 0) + trimmedSegment.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
          textareaRef.current.focus();
        }
      }, 0);

      return final;
    });
  }, [isMounted, language, setText, isPunctuationEnabled]);

  const { interimText, status, startListening, stopListening } = useSpeechRecognition(languageCode, handleFinalResult);

  const setLanguage = (lang: Language) => {
    setInternalLanguage(lang);
    onLanguageChange?.(lang);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (status === 'listening') {
        stopListening();
      }
      clearText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isMounted]);

  if (!isMounted) return null;

  const isListening = status === 'listening';

  const handleClear = () => {
    if (isListening) stopListening();
    clearText();
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-1.5 sm:gap-2 min-h-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar: Language Switcher + Status Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 shrink-0">
        <div className="flex flex-wrap justify-center p-0.5 sm:p-1 bg-white/5 rounded-2xl w-full sm:w-auto border border-white/5 shadow-inner" dir="ltr">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as Language)}
              className={`relative flex items-center justify-center min-h-[36px] sm:min-h-[40px] px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold transition-all duration-300 rounded-xl ${language === lang.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {language === lang.id && (
                <motion.div
                  layoutId="active-lang"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 bengali-text">{lang.label}</span>
            </button>
          ))}
        </div>
        <div className="shrink-0">
          <StatusIndicator status={status} language={language} />
        </div>
      </div>

      {/* Main Text Area - Maximized */}
      <div className="w-full flex-1 flex flex-col min-h-0 relative">
        <TextDisplay
          text={text}
          interimText={interimText}
          onChange={setText}
          language={language}
          textareaRef={textareaRef}
        />
      </div>

      {/* Bottom Compact Toolbar */}
      <div className="shrink-0 w-full pt-1">
        <ControlBar text={text} onClear={handleClear} language={language}>
          <MicButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            disabled={status === 'not-supported'}
          />
        </ControlBar>
      </div>

      <AnimatePresence>
        {status === 'not-supported' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm max-w-md shrink-0"
          >
            <p className="font-bold mb-1 bengali-text">
              {t.ui.notSupportedTitle}
            </p>
            <p className="opacity-80 bengali-text">
              {t.ui.notSupportedDesc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
