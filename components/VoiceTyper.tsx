'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

const LANGUAGES = [
  { id: 'bengali', label: 'বাংলা', code: 'bn-BD' },
  { id: 'english', label: 'English', code: 'en-US' },
  { id: 'arabic', label: 'العربية', code: 'ar-SA' },
  { id: 'urdu', label: 'اردو', code: 'ur-PK' },
] as const;

export function VoiceTyper({ language: externalLanguage, onLanguageChange }: VoiceTyperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [internalLanguage, setInternalLanguage] = useState<Language>('bengali');
  
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
    
    if (language === 'bengali') {
      processedSegment = processedSegment.replace(/কমা/g, ',');
      processedSegment = processedSegment.replace(/দাড়ি/g, '।');
      processedSegment = processedSegment.replace(/প্রশ্নবোধক/g, '?');
      processedSegment = processedSegment.replace(/আশ্চর্য বোধক/g, '!');
    } else if (language === 'english') {
      processedSegment = processedSegment.replace(/comma/gi, ',');
      processedSegment = processedSegment.replace(/period/gi, '.');
      processedSegment = processedSegment.replace(/question mark/gi, '?');
      processedSegment = processedSegment.replace(/exclamation mark/gi, '!');
    } else if (language === 'arabic') {
      processedSegment = processedSegment.replace(/فاصلة/g, '،');
      processedSegment = processedSegment.replace(/نقطة/g, '.');
      processedSegment = processedSegment.replace(/علامة استفهام/g, '؟');
      processedSegment = processedSegment.replace(/علامة تعجب/g, '!');
    } else if (language === 'urdu') {
      processedSegment = processedSegment.replace(/کوما/g, '،');
      processedSegment = processedSegment.replace(/مقدস/g, '۔');
      processedSegment = processedSegment.replace(/سوالیہ نشان/g, '؟');
      processedSegment = processedSegment.replace(/تعجب/g, '!');
    }

    setText((prev: string) => {
      const combined = prev + (prev ? ' ' : '') + processedSegment;
      // Clean up spaces before punctuation
      return combined.replace(/\s+([,।?!.،۔])/g, '$1');
    });
  }, [isMounted, language, setText]);

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
    <div className="w-full h-full flex flex-col gap-3 sm:gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Language Switcher - Premium Look */}
      <div className="flex justify-center p-1.5 bg-white/5 rounded-2xl w-fit mx-auto border border-white/5 shadow-inner shrink-0" dir="ltr">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id as Language)}
            className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold transition-all duration-300 rounded-xl ${
              language === lang.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
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

      <div className="flex-1 flex flex-col items-center gap-3 sm:gap-6 min-h-[450px] sm:min-h-0">
        <div className="shrink-0">
          <StatusIndicator status={status} language={language} />
        </div>
        
        <div className="w-full flex-1 min-h-0">
          <TextDisplay text={text} interimText={interimText} onChange={setText} language={language} />
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-6 w-full shrink-0">
          <MicButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            disabled={status === 'not-supported'}
          />
          <ControlBar text={text} onClear={handleClear} language={language} />
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
    </div>
  );
}
