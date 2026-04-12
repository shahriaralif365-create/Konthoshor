'use client';

import { useState } from 'react';
import { VoiceTyper } from '@/components/VoiceTyper';
import { PunctuationGuide } from '@/components/PunctuationGuide';
import { Mic, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [language, setLanguage] = useState<'bengali' | 'english' | 'arabic' | 'urdu'>('bengali');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const getTitle = () => {
    switch (language) {
      case 'english':
        return 'Convert Your Voice to Text';
      case 'arabic':
        return 'تحويل صوتك إلى نص';
      case 'urdu':
        return 'اپنی آواز کو متن میں تبدیل کریں';
      case 'bengali':
      default:
        return 'আপনার ভয়েসকে টেক্সটে রূপান্তরিত করুন';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header/Navigation */}
        <header className="border-b border-slate-700/30 backdrop-blur-sm">
          <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl shadow-lg shadow-sky-500/30">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent bengali-text">
                  কণ্ঠস্বর
                </h1>
                <p className="text-xs sm:text-sm text-cyan-400/70 bengali-text">আপনার কণ্ঠস্বর দিয়ে লিখুন</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsGuideOpen(true)}
                className="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm bg-sky-500/20 text-sky-300 border border-sky-400/50 hover:bg-sky-500/30 hover:border-sky-400/80 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="View punctuation guide"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'bengali' && 'গাইড'}
                  {language === 'english' && 'Guide'}
                  {language === 'arabic' && 'الدليل'}
                  {language === 'urdu' && 'گائیڈ'}
                </span>
              </motion.button>
              <div className="text-sm font-semibold text-sky-400">v1.0</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-start justify-center px-3 py-1">
          <div className="w-full max-w-3xl">
            {/* Title Section */}
            <div className="text-center mb-2 mt-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white/90 bengali-text" style={language === 'arabic' || language === 'urdu' ? { direction: 'rtl' } : {}}>
                {getTitle()}
              </h2>
            </div>

            {/* Main Component */}
            <div className="rounded-2xl border border-sky-400/20 bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-sky-500/10 p-4">
              <VoiceTyper 
                language={language} 
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </div>

        {/* Punctuation Guide Modal */}
        <PunctuationGuide 
          language={language}
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* Footer */}
        <footer className="border-t border-slate-700/30 backdrop-blur-sm mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
            <p className="text-sm sm:text-base text-slate-500/70 text-center bengali-text mb-0">
              © 2026 কণ্ঠস্বর সমস্ত অধিকার সংরক্ষিত। All rights reserved.
            </p>
            <p className="text-sm sm:text-base text-slate-600 text-center bengali-text">
              কণ্ঠস্বর সম্পূর্ণ অফলাইন কাজ করে আপনার ডেটা সংরক্ষণ করা হয় না। । No data is stored and VoiceTyper works entirely offline.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
