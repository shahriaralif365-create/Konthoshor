'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusIndicator } from './StatusIndicator';
import { MicButton } from './MicButton';
import { TextDisplay } from './TextDisplay';
import { ControlBar } from './ControlBar';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextStorage } from '@/hooks/useTextStorage';

interface VoiceTyperProps {
  language?: 'bengali' | 'english' | 'arabic' | 'urdu';
  onLanguageChange?: (language: 'bengali' | 'english' | 'arabic' | 'urdu') => void;
}

export function VoiceTyper({ language: externalLanguage, onLanguageChange }: VoiceTyperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [internalLanguage, setInternalLanguage] = useState<'bengali' | 'english' | 'arabic' | 'urdu'>('bengali');
  
  const language = externalLanguage || internalLanguage;
  
  const languageCode = 
    language === 'bengali' ? 'bn-BD' : 
    language === 'english' ? 'en-US' : 
    language === 'arabic' ? 'ar-SA' :
    'ur-PK';
  
  const storageKey = 
    language === 'bengali' ? 'bangla-voice-text' : 
    language === 'english' ? 'english-voice-text' : 
    language === 'arabic' ? 'arabic-voice-text' :
    'urdu-voice-text';
  
  const { text: recognizedText, interimText, status, startListening, stopListening, resetText: resetRecognizedText } = useSpeechRecognition(languageCode);
  const { text, setText, clearText } = useTextStorage(storageKey);

  const setLanguage = (lang: 'bengali' | 'english' | 'arabic' | 'urdu') => {
    setInternalLanguage(lang);
    onLanguageChange?.(lang);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear text when language changes
  useEffect(() => {
    if (isMounted) {
      if (status === 'listening') {
        stopListening();
      }
      clearText();
      resetRecognizedText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Sync recognized text with storage and handle voice commands for punctuation
  useEffect(() => {
    if (recognizedText && isMounted) {
      let processedText = recognizedText;
      
      if (language === 'bengali') {
        // Bengali voice commands for punctuation
        processedText = processedText.replace(/কমা/g, ',');
        processedText = processedText.replace(/দাড়ি/g, '।');
        processedText = processedText.replace(/প্রশ্নবোধক/g, '?');
        processedText = processedText.replace(/আশ্চর্য বোধক/g, '!');
        // Remove space before punctuation
        processedText = processedText.replace(/\s+([,।?!])/g, '$1');
      } else if (language === 'english') {
        // English voice commands for punctuation
        processedText = processedText.replace(/comma/gi, ',');
        processedText = processedText.replace(/period/gi, '.');
        processedText = processedText.replace(/question mark/gi, '?');
        processedText = processedText.replace(/exclamation mark/gi, '!');
        // Remove space before punctuation
        processedText = processedText.replace(/\s+([,.?!])/g, '$1');
      } else if (language === 'arabic') {
        // Arabic voice commands for punctuation
        processedText = processedText.replace(/فاصلة/g, '،');
        processedText = processedText.replace(/نقطة/g, '.');
        processedText = processedText.replace(/علامة استفهام/g, '؟');
        processedText = processedText.replace(/علامة تعجب/g, '!');
        // Remove space before punctuation
        processedText = processedText.replace(/\s+([،.؟!])/g, '$1');
      } else if (language === 'urdu') {
        // Urdu voice commands for punctuation
        processedText = processedText.replace(/کوما/g, '،');
        processedText = processedText.replace(/مقدس/g, '۔');
        processedText = processedText.replace(/سوالیہ نشان/g, '؟');
        processedText = processedText.replace(/تعجب/g, '!');
        // Remove space before punctuation
        processedText = processedText.replace(/\s+([،۔؟!])/g, '$1');
      }
      
      setText(processedText);
    }
  }, [recognizedText, isMounted, language, setText]);

  if (!isMounted) {
    return null;
  }

  const isListening = status === 'listening';

  // Handle clear - clears both storage and recognized text
  const handleClear = () => {
    if (isListening) {
      stopListening();
    }
    clearText();
    resetRecognizedText();
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Language Switcher */}
      <div className="flex flex-wrap gap-2 justify-center mb-3 items-center">
        <motion.button
          onClick={() => {
            setLanguage('bengali');
            resetRecognizedText();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            language === 'bengali'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/50'
              : 'bg-slate-800/40 text-slate-300 border border-slate-700/30 hover:border-sky-400/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          বাংলা
        </motion.button>
        
        <motion.button
          onClick={() => {
            setLanguage('english');
            resetRecognizedText();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            language === 'english'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/50'
              : 'bg-slate-800/40 text-slate-300 border border-slate-700/30 hover:border-sky-400/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          English
        </motion.button>

        <motion.button
          onClick={() => {
            setLanguage('arabic');
            resetRecognizedText();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            language === 'arabic'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/50'
              : 'bg-slate-800/40 text-slate-300 border border-slate-700/30 hover:border-sky-400/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          العربية
        </motion.button>

        <motion.button
          onClick={() => {
            setLanguage('urdu');
            resetRecognizedText();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
            language === 'urdu'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/50'
              : 'bg-slate-800/40 text-slate-300 border border-slate-700/30 hover:border-sky-400/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          اردو
        </motion.button>


      </div>

      {/* Main Card Container */}
      <div className="space-y-3 flex flex-col items-center w-full">
        {/* Status Indicator */}
        <div className="flex justify-center">
          <StatusIndicator status={status} language={language} />
        </div>

        {/* Text Display */}
        <div className="flex justify-center w-full px-2">
          <TextDisplay text={text} interimText={interimText} onChange={setText} language={language} />
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center">
          <MicButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            disabled={status === 'not-supported'}
          />
        </div>

        {/* Control Bar */}
        <div className="flex justify-center w-full px-2">
          <ControlBar text={text} onClear={handleClear} />
        </div>

        {/* Info Text */}
        {status === 'not-supported' && (
          <div className="flex justify-center w-full px-2">
            <div
              className="text-center px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm"
            >
              <p className="font-bold text-base mb-2">
                {language === 'bengali' && 'বিরত'}
                {language === 'english' && 'Not Supported'}
                {language === 'arabic' && 'غير مدعوم'}
                {language === 'urdu' && 'تعاون یافتہ نہیں'}
              </p>
              <p className={language === 'arabic' || language === 'urdu' ? 'text-right' : ''}>
                {language === 'bengali' && 'আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়। অনুগ্রহ করে Chrome, Edge বা Safari ব্যবহার করুন।'}
                {language === 'english' && 'Speech Recognition is not supported in your browser. Please use Chrome, Edge, or Safari.'}
                {language === 'arabic' && 'التعرف على الكلام غير مدعوم في متصفحك. يرجى استخدام Chrome أو Edge أو Safari.'}
                {language === 'urdu' && 'آپ کے براؤزر میں تقریر کی شناخت تعاون یافتہ نہیں ہے۔ براہ کرم Chrome، Edge یا Safari استعمال کریں۔'}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
