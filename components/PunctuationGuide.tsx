'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface PunctuationGuideProps {
  language: 'bengali' | 'english' | 'arabic' | 'urdu';
  isOpen: boolean;
  onClose: () => void;
}

interface GuideItem {
  command: string;
  result: string;
  description: string;
}

export function PunctuationGuide({ language, isOpen, onClose }: PunctuationGuideProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const guides: Record<string, { title: string; subtitle: string; items: GuideItem[] }> = {
    bengali: {
      title: 'বাংলা বিশেষ চিহ্ন গাইড',
      subtitle: 'কথা বলার সময় এই শব্দগুলো ব্যবহার করুন',
      items: [
        {
          command: 'কমা',
          result: ',',
          description: 'যখন আপনি কথা বলতে বলতে "কমা" বলবেন, সেটি কমা চিহ্নে (,) রূপান্তরিত হবে।'
        },
        {
          command: 'দাড়ি',
          result: '।',
          description: 'যখন আপনি "দাড়ি" বলবেন, সেটি বাংলা দাড়ি চিহ্নে (।) পরিণত হবে।'
        },
        {
          command: 'প্রশ্নবোধক',
          result: '?',
          description: 'যখন আপনি "প্রশ্নবোধক" বলবেন, সেটি প্রশ্নবোধক চিহ্নে (?) রূপান্তরিত হবে।'
        },
        {
          command: 'আশ্চর্য বোধক',
          result: '!',
          description: 'যখন আপনি "আশ্চর্য বোধক" বলবেন, সেটি আশ্চর্য চিহ্নে (!) রূপান্তরিত হবে।'
        },
      ]
    },
    english: {
      title: 'English Punctuation Guide',
      subtitle: 'Use these voice commands while speaking',
      items: [
        {
          command: 'comma',
          result: ',',
          description: 'Say "comma" to insert a comma (,) at the cursor position. Works with any capitalization (Comma, COMMA, etc.).'
        },
        {
          command: 'period',
          result: '.',
          description: 'Say "period" to insert a full stop (.) to end your sentence.'
        },
        {
          command: 'question mark',
          result: '?',
          description: 'Say "question mark" to insert a question mark (?) for interrogative sentences.'
        },
        {
          command: 'exclamation mark',
          result: '!',
          description: 'Say "exclamation mark" to insert an exclamation mark (!) for emphatic statements.'
        },
      ]
    },
    arabic: {
      title: 'دليل العلامات العربية',
      subtitle: 'استخدم هذه الأوامر الصوتية أثناء الحديث',
      items: [
        {
          command: 'فاصلة',
          result: '،',
          description: 'قل "فاصلة" لإدراج فاصلة عربية (،) - تشبه الفاصلة العادية لكنها معدلة للعربية.'
        },
        {
          command: 'نقطة',
          result: '.',
          description: 'قل "نقطة" لإدراج نقطة (.) لإنهاء جملتك.'
        },
        {
          command: 'علامة استفهام',
          result: '؟',
          description: 'قل "علامة استفهام" لإدراج علامة استفهام عربية (؟) - معكوسة كما هو الحال في اللغة العربية.'
        },
        {
          command: 'علامة تعجب',
          result: '!',
          description: 'قل "علامة تعجب" لإدراج علامة تعجب (!) للتأكيد والدهشة.'
        },
      ]
    },
    urdu: {
      title: 'اردو علامات کی رہنمائی',
      subtitle: 'بات کرتے وقت یہ صوتی احکامات استعمال کریں',
      items: [
        {
          command: 'کوما',
          result: '،',
          description: 'جب آپ "کوما" کہیں تو اردو طریقے کا کوما (،) داخل ہوگا - یہ معیاری کوما سے مختلف ہے۔'
        },
        {
          command: 'مقدس',
          result: '۔',
          description: 'جب آپ "مقدس" کہیں تو اردو کا داڑھی یا مکمل نقطہ (۔) داخل ہوگا - یہ جملے کو ختم کرنے کے لیے ہے۔'
        },
        {
          command: 'سوالیہ نشان',
          result: '؟',
          description: 'جب آپ "سوالیہ نشان" کہیں تو سوالیہ نشان (؟) داخل ہوگا سوالیہ جملوں کے لیے۔'
        },
        {
          command: 'تعجب',
          result: '!',
          description: 'جب آپ "تعجب" کہیں تو حیرت کا نشان (!) داخل ہوگا زور دینے کے لیے۔'
        },
      ]
    }
  };

  const currentGuide = guides[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-80 sm:w-96 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-sky-400/20 shadow-2xl shadow-sky-500/10 z-50 flex flex-col overflow-hidden rounded-l-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {/* Header with Close Button */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-sky-400/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xl font-bold text-white/90 ${language === 'arabic' || language === 'urdu' ? 'bengali-text' : ''}`}>
                  {currentGuide.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-sky-400/10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-sky-400" />
                </button>
              </div>
              <p className={`text-sm text-sky-300/70 ${language === 'arabic' || language === 'urdu' ? 'bengali-text' : ''}`}>
                {currentGuide.subtitle}
              </p>
            </div>

            {/* Scrollable Guide Items */}
            <div className="h-auto max-h-[50vh] overflow-y-auto px-6 py-4 space-y-2">
              {currentGuide.items.map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg border border-sky-400/15 bg-slate-800/30 overflow-hidden"
                  initial={false}
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-sky-400/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-400/30 text-sm font-semibold text-sky-300 ${language === 'arabic' || language === 'urdu' ? 'bengali-text' : ''}`}>
                        {item.command}
                      </div>
                      <span className="text-xl font-bold text-cyan-400">{item.result}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-sky-400/60" />
                    </motion.div>
                  </button>

                  {/* Description */}
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-sky-400/15 overflow-hidden"
                      >
                        <p className={`px-4 py-3 text-sm text-slate-300/80 leading-relaxed ${language === 'arabic' || language === 'urdu' ? 'bengali-text text-right' : ''}`}>
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
