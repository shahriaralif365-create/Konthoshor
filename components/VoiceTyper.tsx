'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusIndicator } from './StatusIndicator';
import { MicButton } from './MicButton';
import { TextDisplay } from './TextDisplay';
import { ControlBar } from './ControlBar';
import { ControlBox } from './ControlBox';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextStorage } from '@/hooks/useTextStorage';
import { translations, Language } from '@/lib/translations';
import { Sun } from 'lucide-react';

interface VoiceTyperProps {
  language?: Language | string;
  onLanguageChange?: (language: Language | string) => void;
  isPunctuationEnabled?: boolean;
}

const LANGUAGES = [
  { id: 'bengali', label: 'বাংলা', code: 'bn-BD' },
  { id: 'english', label: 'English', code: 'en-US' },
  { id: 'arabic', label: 'العربية', code: 'ar-SA' },
  { id: 'urdu', label: 'اردو', code: 'ur-PK' },
] as const;

const OTHER_LANGUAGES = [
  { id: 'afrikaans', label: 'Afrikaans (South Africa)', code: 'af-ZA' },
  { id: 'amharic', label: 'አማርኛ (Amharic)', code: 'am-ET' },
  { id: 'armenian', label: 'Հայերեն (Armenian)', code: 'hy-AM' },
  { id: 'azerbaijani', label: 'Azərbaycanca (Azerbaijani)', code: 'az-AZ' },
  { id: 'bulgarian', label: 'Български (Bulgarian)', code: 'bg-BG' },
  { id: 'catalan', label: 'Català (Catalan)', code: 'ca-ES' },
  { id: 'chinese_simplified', label: '简体中文 (Chinese Simplified)', code: 'zh-CN' },
  { id: 'chinese_traditional', label: '繁體中文 (Chinese Traditional)', code: 'zh-TW' },
  { id: 'croatian', label: 'Hrvatski (Croatian)', code: 'hr-HR' },
  { id: 'czech', label: 'Čeština (Czech)', code: 'cs-CZ' },
  { id: 'danish', label: 'Dansk (Danish)', code: 'da-DK' },
  { id: 'dutch', label: 'Nederlands (Dutch)', code: 'nl-NL' },
  { id: 'english_gb', label: 'English (United Kingdom)', code: 'en-GB' },
  { id: 'english_in', label: 'English (India)', code: 'en-IN' },
  { id: 'filipino', label: 'Filipino (Philippines)', code: 'fil-PH' },
  { id: 'finnish', label: 'Suomi (Finnish)', code: 'fi-FI' },
  { id: 'french', label: 'Français (French)', code: 'fr-FR' },
  { id: 'galician', label: 'Galego (Galician)', code: 'gl-ES' },
  { id: 'georgian', label: 'ქართული (Georgian)', code: 'ka-GE' },
  { id: 'german', label: 'Deutsch (German)', code: 'de-DE' },
  { id: 'greek', label: 'Ελληνικά (Greek)', code: 'el-GR' },
  { id: 'gujarati', label: 'ગુજરાતી (Gujarati)', code: 'gu-IN' },
  { id: 'hebrew', label: 'עברית (Hebrew)', code: 'he-IL' },
  { id: 'hindi', label: 'हिन्दी (Hindi)', code: 'hi-IN' },
  { id: 'hungarian', label: 'Magyar (Hungarian)', code: 'hu-HU' },
  { id: 'icelandic', label: 'Íslenska (Icelandic)', code: 'is-IS' },
  { id: 'indonesian', label: 'Bahasa Indonesia (Indonesian)', code: 'id-ID' },
  { id: 'italian', label: 'Italiano (Italian)', code: 'it-IT' },
  { id: 'japanese', label: '日本語 (Japanese)', code: 'ja-JP' },
  { id: 'javanese', label: 'Basa Jawa (Javanese)', code: 'jv-ID' },
  { id: 'kannada', label: 'ಕನ್ನಡ (Kannada)', code: 'kn-IN' },
  { id: 'khmer', label: 'ខ្មែរ (Khmer)', code: 'km-KH' },
  { id: 'korean', label: '한국어 (Korean)', code: 'ko-KR' },
  { id: 'lao', label: 'ລາວ (Lao)', code: 'lo-LA' },
  { id: 'latvian', label: 'Latviešu (Latvian)', code: 'lv-LV' },
  { id: 'lithuanian', label: 'Lietuvių (Lithuanian)', code: 'lt-LT' },
  { id: 'malay', label: 'Bahasa Melayu (Malay)', code: 'ms-MY' },
  { id: 'malayalam', label: 'മലയാളം (Malayalam)', code: 'ml-IN' },
  { id: 'marathi', label: 'मराठी (Marathi)', code: 'mr-IN' },
  { id: 'nepali', label: 'नेपाली (Nepali)', code: 'ne-NP' },
  { id: 'norwegian', label: 'Norsk (Norwegian)', code: 'no-NO' },
  { id: 'persian', label: 'فارسی (Persian)', code: 'fa-IR' },
  { id: 'polish', label: 'Polski (Polish)', code: 'pl-PL' },
  { id: 'portuguese', label: 'Português (Portuguese)', code: 'pt-PT' },
  { id: 'romanian', label: 'Română (Romanian)', code: 'ro-RO' },
  { id: 'russian', label: 'Русский (Russian)', code: 'ru-RU' },
  { id: 'serbian', label: 'Српски (Serbian)', code: 'sr-RS' },
  { id: 'sinhala', label: 'සිංහල (Sinhala)', code: 'si-LK' },
  { id: 'slovak', label: 'Slovenčina (Slovak)', code: 'sk-SK' },
  { id: 'slovenian', label: 'Slovenščina (Slovenian)', code: 'sl-SI' },
  { id: 'spanish', label: 'Español (Spanish)', code: 'es-ES' },
  { id: 'swahili', label: 'Kiswahili (Swahili)', code: 'sw-TZ' },
  { id: 'swedish', label: 'Svenska (Swedish)', code: 'sv-SE' },
  { id: 'tamil', label: 'தமிழ் (Tamil)', code: 'ta-IN' },
  { id: 'telugu', label: 'తెలుగు (Telugu)', code: 'te-IN' },
  { id: 'thai', label: 'ไทย (Thai)', code: 'th-TH' },
  { id: 'turkish', label: 'Türkçe (Turkish)', code: 'tr-TR' },
  { id: 'ukrainian', label: 'Українська (Ukrainian)', code: 'uk-UA' },
  { id: 'vietnamese', label: 'Tiếng Việt (Vietnamese)', code: 'vi-VN' },
  { id: 'zulu', label: 'isiZulu (Zulu)', code: 'zu-ZA' },
] as const;

export function VoiceTyper({
  language: externalLanguage,
  onLanguageChange,
}: VoiceTyperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [internalLanguage, setInternalLanguage] = useState<Language | string>('bengali');
  const [isVoicePunctuationEnabled, setIsVoicePunctuationEnabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<{ start: number; end: number } | null>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    savedSelectionRef.current = savedSelection;
  }, [savedSelection]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastProcessedTextRef = useRef('');
  const lastProcessedTimeRef = useRef(0);

  const language = externalLanguage || internalLanguage;
  const translationKey = (language in translations) ? (language as Language) : 'english';
  const t = translations[translationKey];
  const isOtherLanguage = !LANGUAGES.some(l => l.id === language);

  const currentLangObj = LANGUAGES.find(l => l.id === language) || OTHER_LANGUAGES.find(l => l.id === language) || LANGUAGES[0];
  const languageCode = currentLangObj.code;

  const setLanguage = (lang: Language | string) => {
    setInternalLanguage(lang);
    onLanguageChange?.(lang as any);
  };

  // Listen for clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for 'Alt + L' keyboard shortcut to quickly cycle languages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        
        // Cycle: bengali -> english -> arabic -> urdu -> [other language]
        const mainIds = ['bengali', 'english', 'arabic', 'urdu'];
        const isMain = mainIds.includes(language);
        
        let nextLang: string;
        if (isMain) {
          const currentIndex = mainIds.indexOf(language);
          if (currentIndex === mainIds.length - 1) {
            nextLang = isOtherLanguage ? language : OTHER_LANGUAGES[0].id;
          } else {
            nextLang = mainIds[currentIndex + 1];
          }
        } else {
          nextLang = 'bengali';
        }
        
        setLanguage(nextLang);
        setIsDropdownOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language, isOtherLanguage]);



  const storageKey = 'konthoshor-universal-text';

  const { text, setText, clearText } = useTextStorage(storageKey);

  const handleFinalResult = useCallback((newText: string) => {
    if (!isMounted) return;

    // Advanced Mobile/Chrome cumulative overlap de-duplication to prevent repeating words
    const now = Date.now();
    let trimmedNew = newText.trim();
    if (!trimmedNew) return;

    const lastText = lastProcessedTextRef.current;
    const timeDiff = now - lastProcessedTimeRef.current;

    if (lastText && timeDiff < 3000) {
      if (trimmedNew.toLowerCase().startsWith(lastText.toLowerCase())) {
        // Strip the duplicate prefix that was already committed
        const suffix = trimmedNew.substring(lastText.length).trim();
        if (!suffix) {
          // If the entire text is a duplicate, ignore it
          return;
        }
        trimmedNew = suffix;
      } else if (lastText.toLowerCase() === trimmedNew.toLowerCase()) {
        // Exact duplicate within 3 seconds, ignore it
        return;
      }
    }

    lastProcessedTextRef.current = newText.trim(); // Save the raw committed phrase for the next cycle
    lastProcessedTimeRef.current = now;

    let processedSegment = trimmedNew;

    if (isVoicePunctuationEnabled) {
      if (language === 'bengali') {
        processedSegment = processedSegment.replace(/দাঁড়ি|দাড়ি/g, '।');
        processedSegment = processedSegment.replace(/কমা/g, ',');
        processedSegment = processedSegment.replace(/প্রশ্নবোধক/g, '?');
        processedSegment = processedSegment.replace(/বিস্ময়বোধক/g, '!');
      } else if (language === 'english') {
        processedSegment = processedSegment.replace(/full stop/gi, '.');
        processedSegment = processedSegment.replace(/comma/gi, ',');
        processedSegment = processedSegment.replace(/question mark/gi, '?');
        processedSegment = processedSegment.replace(/exclamation mark/gi, '!');
        processedSegment = processedSegment.replace(/colon/gi, ':');
        processedSegment = processedSegment.replace(/semicolon/gi, ';');
        processedSegment = processedSegment.replace(/dash/gi, '-');
        processedSegment = processedSegment.replace(/open quote/gi, '“');
        processedSegment = processedSegment.replace(/close quote/gi, '”');
        processedSegment = processedSegment.replace(/quote/gi, '"');
      } else if (language === 'arabic') {
        processedSegment = processedSegment.replace(/fasila/gi, '،');
        processedSegment = processedSegment.replace(/istifham/gi, '؟');
        processedSegment = processedSegment.replace(/colon arabic/gi, '؛');
        // Also keep native terms
        processedSegment = processedSegment.replace(/فاصلة/g, '،');
        processedSegment = processedSegment.replace(/علامة استفهام/g, '؟');
      } else if (language === 'urdu') {
        processedSegment = processedSegment.replace(/comma urdu/gi, '،');
        processedSegment = processedSegment.replace(/question urdu/gi, '؟');
        // Also keep native terms
        processedSegment = processedSegment.replace(/کوما/g, '،');
        processedSegment = processedSegment.replace(/سوالیہ نشان/g, '؟');
      } else if (language === 'japanese') {
        processedSegment = processedSegment.replace(/maru|まる|マル/g, '。');
        processedSegment = processedSegment.replace(/ten|てん|テン/g, '、');
      }
    }

    const start = savedSelectionRef.current?.start ?? textareaRef.current?.selectionStart ?? text.length;
    const end = savedSelectionRef.current?.end ?? textareaRef.current?.selectionEnd ?? text.length;
    const before = text.substring(0, start);
    const after = text.substring(end);

    // Trim the segment to handle spacing manually and avoid doubles
    const trimmedSegment = processedSegment.trim();
    if (!trimmedSegment) return;

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

    // Calculate new position
    const newPos = before.length + (needsLeadingSpace ? 1 : 0) + trimmedSegment.length;

    // Keep the cursor selection lock active at the new cursor position after insertion!
    // This completely prevents the cursor from resetting to the end of the text on subsequent words!
    setSavedSelection({ start: newPos, end: newPos });
    savedSelectionRef.current = { start: newPos, end: newPos };

    setText(final);

    // Update cursor position after the text is updated
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newPos, newPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [isMounted, language, text, setText, isVoicePunctuationEnabled]);

  const { interimText, status, startListening, stopListening } = useSpeechRecognition(languageCode, handleFinalResult);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  const insertTextAtCursor = useCallback((insertText: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = text;

    const newText = currentText.substring(0, start) + insertText + currentText.substring(end);
    setText(newText);

    // Set cursor position after insertion
    const newPos = start + insertText.length;
    setSavedSelection({ start: newPos, end: newPos });
    savedSelectionRef.current = { start: newPos, end: newPos };

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newPos, newPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [text, setText]);

  const handleBackspace = useCallback(() => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = text;

    if (start === end && start > 0) {
      // Remove character before cursor
      const newText = currentText.substring(0, start - 1) + currentText.substring(end);
      setText(newText);

      const newPos = start - 1;
      setSavedSelection({ start: newPos, end: newPos });
      savedSelectionRef.current = { start: newPos, end: newPos };

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newPos, newPos);
          textareaRef.current.focus();
        }
      }, 0);
    } else if (start !== end) {
      // Remove selection
      const newText = currentText.substring(0, start) + currentText.substring(end);
      setText(newText);

      setSavedSelection({ start: start, end: start });
      savedSelectionRef.current = { start: start, end: start };

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start, start);
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [text, setText]);

  const handleDeleteWord = useCallback(() => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = text;

    if (start !== end) {
      // Remove selection if exists
      const newText = currentText.substring(0, start) + currentText.substring(end);
      setText(newText);
      setSavedSelection({ start: start, end: start });
      savedSelectionRef.current = { start: start, end: start };
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start, start);
          textareaRef.current.focus();
        }
      }, 0);
      return;
    }

    if (start === 0) return;

    const before = currentText.substring(0, start);
    const after = currentText.substring(start);

    // Modern regex to handle words across languages. 
    // We target a sequence of non-spaces optionally followed by spaces.
    // For Japanese, where spaces are rare, this will delete the entire block until a space,
    // which effectively deletes the nearest "group".
    const match = before.match(/(\S+\s*)$/);
    
    if (match) {
      const deletedLength = match[0].length;
      const newBefore = before.substring(0, before.length - deletedLength);
      const newText = newBefore + after;
      setText(newText);

      const newPos = newBefore.length;
      setSavedSelection({ start: newPos, end: newPos });
      savedSelectionRef.current = { start: newPos, end: newPos };
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newPos, newPos);
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      // If only spaces are before the cursor, delete those spaces
      const spaceMatch = before.match(/(\s+)$/);
      if (spaceMatch) {
        const newBefore = before.substring(0, before.length - spaceMatch[0].length);
        const newText = newBefore + after;
        setText(newText);
        const newPos = newBefore.length;
        setSavedSelection({ start: newPos, end: newPos });
        savedSelectionRef.current = { start: newPos, end: newPos };
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newPos, newPos);
            textareaRef.current.focus();
          }
        }, 0);
      }
    }
  }, [text, setText]);

  const handleEnter = useCallback(() => {
    insertTextAtCursor('\n');
  }, [insertTextAtCursor]);

  const handleSpace = useCallback(() => {
    insertTextAtCursor(' ');
  }, [insertTextAtCursor]);

  if (!isMounted) return null;

  const isListening = status === 'listening' || status === 'restarting';

  const handleClear = () => {
    clearText();
    setSavedSelection(null);
    savedSelectionRef.current = null;
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-1 sm:gap-1.5 min-h-0" dir="ltr">
      {/* Top Bar: Language Switcher + Status Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0 px-1" dir="ltr">
        <div className="flex flex-wrap justify-center p-0.5 bg-white/5 rounded-xl w-full sm:w-auto border border-white/5 shadow-inner" dir="ltr">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setIsDropdownOpen(false);
              }}
              className={`relative flex items-center justify-center min-h-[32px] sm:min-h-[36px] px-3 sm:px-4 py-1 text-xs font-bold transition-all duration-300 rounded-lg ${
                language === lang.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === lang.id && (
                <motion.div
                  layoutId="active-lang"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 bengali-text">{lang.label}</span>
            </button>
          ))}

          {/* Dynamic 5th Button: Other Language Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`relative flex items-center justify-center min-h-[32px] sm:min-h-[36px] px-3 sm:px-4 py-1 text-xs font-bold transition-all duration-300 rounded-lg gap-1 ${
                isOtherLanguage ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isOtherLanguage && (
                <motion.div
                  layoutId="active-lang"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 bengali-text flex items-center gap-1">
                {isOtherLanguage 
                  ? OTHER_LANGUAGES.find(l => l.id === language)?.label 
                  : (language === 'bengali' ? 'অন্যান্য ভাষা' : 'Other Language')
                }
                <svg
                  className={`w-3 h-3 transition-transform duration-300 relative z-10 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {/* Other Languages Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 sm:left-0 mt-2 w-56 z-50 rounded-xl bg-slate-950/95 border border-white/10 shadow-2xl p-1.5 backdrop-blur-2xl max-h-[280px] overflow-y-auto custom-scrollbar"
                >
                  {OTHER_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-bold transition-all duration-200 ${
                        language === lang.id
                          ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.id && (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {/* Voice Punctuation Toggle */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bengali-text">
                {language === 'bengali' ? 'বিরামচিহ্ন' : 'Punctuation'}
              </span>
              <button
                onClick={() => setIsVoicePunctuationEnabled(!isVoicePunctuationEnabled)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none flex items-center p-0.5 cursor-pointer border ${
                  isVoicePunctuationEnabled 
                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                    : 'bg-slate-800 border-slate-700/80'
                }`}
              >
                {/* ON / OFF Text inside the track */}
                <span className={`absolute text-[7px] font-black uppercase tracking-wider text-white transition-all duration-300 ${
                  isVoicePunctuationEnabled 
                    ? 'left-2 opacity-100' 
                    : 'right-2 opacity-40 text-slate-400'
                }`}>
                  {isVoicePunctuationEnabled ? 'ON' : 'OFF'}
                </span>

                {/* Sliding Knob containing the Sun */}
                <motion.div
                  layout
                  className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shadow-md z-10"
                  animate={{
                    x: isVoicePunctuationEnabled ? 22 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Sun 
                    size={10} 
                    className={`transition-all duration-300 ${
                      isVoicePunctuationEnabled 
                        ? 'text-amber-500 drop-shadow-[0_0_2px_rgba(245,158,11,0.8)] animate-[spin_4s_linear_infinite]' 
                        : 'text-slate-400'
                    }`}
                  />
                </motion.div>
              </button>
            </div>
            <AnimatePresence>
              {isVoicePunctuationEnabled && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[8px] font-bold text-emerald-400 uppercase tracking-[0.2em] animate-pulse mr-1"
                >
                  Voice Control Active
                </motion.span>
              )}
            </AnimatePresence>
          </div>
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
          savedSelection={savedSelection}
          onSelectionChange={setSavedSelection}
        />
        

      </div>

      {/* Bottom Compact Toolbar */}
      <div className="shrink-0 w-full">
        <ControlBar text={text} onClear={handleClear} language={language}>
          <MicButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            disabled={status === 'not-supported'}
          />
        </ControlBar>
      </div>

      {/* Modern Control Box - Sticky at bottom */}
      <div className="shrink-0 w-full mt-1 hidden sm:block">
        <ControlBox
          language={language}
          onInsertText={insertTextAtCursor}
          onBackspace={handleBackspace}
          onDeleteWord={handleDeleteWord}
          onEnter={handleEnter}
          onSpace={handleSpace}
        />
      </div>

      <AnimatePresence>
        {status === 'not-supported' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm w-full shrink-0"
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
