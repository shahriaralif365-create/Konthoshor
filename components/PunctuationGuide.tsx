'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Info, Type } from 'lucide-react';

import { translations, Language } from '@/lib/translations';

interface PunctuationGuideProps {
  language: Language;
  onClose: () => void;
}

interface GuideItem {
  command: string;
  result: string;
  description: string;
}

export function PunctuationGuide({ language, onClose }: PunctuationGuideProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = translations[language].guide;

  const guides: Record<string, { title: string; subtitle: string; items: GuideItem[] }> = {
    bengali: {
      title: 'বিরাম চিহ্নের নির্দেশিকা',
      subtitle: 'টাইপ করার সময় এই শব্দগুলো ব্যবহার করুন',
      items: [
        { command: 'কমা দাও / কমা', result: ',', description: 'বাক্যে কমা ব্যবহারের জন্য "কমা দাও" বা "কমা" বলুন।' },
        { command: 'দাঁড়ি দাও / দাঁড়ি', result: '।', description: 'বাক্য শেষ করতে "দাঁড়ি দাও" বা "দাঁড়ি" বলুন।' },
        { command: 'প্রশ্নবোধক চিহ্ন দাও', result: '?', description: 'প্রশ্ন করতে "প্রশ্নবোধক চিহ্ন দাও" বা "প্রশ্নবোধক চিহ্ন" বলুন।' },
        { command: 'বিস্ময়বোধک চিহ্ন দাও', result: '!', description: 'আবেগ প্রকাশে "বিস্ময়বোধক চিহ্ন দাও" বা "বিস্ময়বোধক চিহ্ন" বলুন।' },
      ]
    },
    english: {
      title: 'Punctuation Guide',
      subtitle: 'Use these voice commands while speaking',
      items: [
        { command: 'give comma / comma', result: ',', description: 'Say "give comma" or "comma" to insert a comma.' },
        { command: 'give period / period', result: '.', description: 'Say "give period" or "period" to insert a full stop.' },
        { command: 'give question mark', result: '?', description: 'Say "give question mark" for questions.' },
        { command: 'give exclamation mark', result: '!', description: 'Say "give exclamation mark" for emphasis.' },
      ]
    },
    arabic: {
      title: 'دليل علامات الترقيم',
      subtitle: 'استخدم الأوامر التالية أثناء التحدث',
      items: [
        { command: 'فاصلة', result: '،', description: 'قل "فاصلة" لإدراج فاصلة.' },
        { command: 'نقطة', result: '.', description: 'قل "نقطة" لإنهاء الجملة.' },
        { command: 'علامة استفهام', result: '؟', description: 'قل "علامة استفهام" للسؤال.' },
        { command: 'علامة تعجب', result: '!', description: 'قل "علامة تعجب" للتعجب.' },
      ]
    },
    urdu: {
      title: 'رموز و اوقاف کی رہنمائی',
      subtitle: 'بات کرتے وقت ان الفاظ کا استعمال کریں',
      items: [
        { command: 'کوما', result: '،', description: 'سکتہ کے لیے "کوما" کہیں۔' },
        { command: 'مقدس', result: '۔', description: 'جملہ ختم کرنے کے لیے "مقدس" کہیں۔' },
        { command: 'سوالیہ نشان', result: '؟', description: 'سوال کے لیے "سوالیہ نشان" کہیں۔' },
        { command: 'تعجب', result: '!', description: 'تعجب کے لیے "تعجب" کہیں۔' },
      ]
    }
  };

  const currentGuide = guides[language];
  const isRTL = language === 'arabic' || language === 'urdu';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        className="fixed top-1/2 left-1/2 w-full max-w-lg glass-morphism rounded-3xl border border-white/10 z-[101] overflow-hidden"
        style={{ transform: 'translate(-50%, -50%)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Info size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-bold text-white bengali-text">{t.title}</h3>
              <p className="text-xs text-slate-400 bengali-text">{currentGuide.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Punctuation Toggle Notice */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3 mb-4">
            <div className="mt-0.5 text-primary shrink-0">
              <Type size={16} />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 bengali-text leading-relaxed">
              {language === 'bengali' 
                ? 'বিরাম চিহ্ন ব্যবহারের জন্য উপরের "বিরামচিহ্ন" বাটনটি চালু (On) করুন। এটি বন্ধ থাকলে কথাগুলো সরাসরি টেক্সট হিসেবে যোগ হবে।' 
                : 'To use punctuation marks, please enable the "Punctuation" toggle in the header. If disabled, commands will appear as plain text.'}
            </p>
          </div>

          {currentGuide.items.map((item, i) => (
            <div
              key={i}
              className="glass-card border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all ${isRTL ? 'flex-row-reverse' : ''
                  }`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold bengali-text">
                    {item.command}
                  </span>
                  <span className="text-2xl font-bold text-white">{item.result}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform duration-300 ${expandedIndex === i ? 'rotate-180' : ''
                    }`}
                />
              </button>
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`p-4 pt-0 text-sm text-slate-400 leading-relaxed bengali-text ${isRTL ? 'text-right' : 'text-left'
                      }`}>
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/5 text-center">
          <p className="text-xs text-slate-500 bengali-text">
            {t.tip}
          </p>
        </div>
      </motion.div>
    </>
  );
}
