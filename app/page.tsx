'use client';

import { useState, useEffect } from 'react';
import { VoiceTyper } from '@/components/VoiceTyper';
import { PunctuationGuide } from '@/components/PunctuationGuide';
import { Mic, HelpCircle, Shield, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations, Language } from '@/lib/translations';

export default function Home() {
  const [language, setLanguage] = useState<Language>('bengali');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const t = translations[language];
  const isRTL = language === 'arabic' || language === 'urdu';

  // Dynamic SEO Update
  useEffect(() => {
    document.title = t.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t.seo.description);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t.seo.keywords);
    }
    document.documentElement.lang = language === 'bengali' ? 'bn-BD' : language === 'english' ? 'en-US' : language === 'arabic' ? 'ar-SA' : 'ur-PK';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, t, isRTL]);

  return (
    <main 
      className="relative min-h-screen md:h-screen flex flex-col items-center selection:bg-primary/30 md:overflow-hidden overflow-y-auto overflow-x-hidden" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full animate-pulse-slow" />
      </div>

      {/* Navigation - Fixed Height */}
      <nav className="shrink-0 w-full z-50 glass-morphism border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              <div className="relative p-1 sm:p-1.5 bg-slate-900 rounded-lg border border-white/10">
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white bengali-text">{t.nav.brand}</h1>
              <p className="text-[7px] sm:text-[8px] text-slate-500 font-medium uppercase tracking-widest hidden sm:block">v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] sm:text-xs font-medium"
            >
              <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="bengali-text">{t.nav.guide}</span>
            </motion.button>
            <div className="h-4 sm:h-5 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1 sm:gap-1.5 text-primary font-semibold">
              <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-primary"></span>
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-tighter">{t.nav.status}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section & Interface - Flexible Height Container */}
      <section className="relative z-10 w-full max-w-5xl px-4 flex-1 flex flex-col items-center justify-center min-h-0 py-4 sm:py-4 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3 sm:mb-6 shrink-0"
        >
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-1 sm:mb-2 tracking-tight bengali-text leading-tight px-2">
            <span className="bg-gradient-to-r from-white via-white/90 to-slate-400 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-xl mx-auto bengali-text leading-relaxed px-4 opacity-80">
            {t.hero.subtitle}
          </p>
        </motion.div>

        {/* Main Interface Container - Grows and fills vertical space */}
        <div className="w-full relative max-w-4xl flex-1 flex flex-col min-h-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-[1.5rem] sm:rounded-[2rem] blur-2xl opacity-40" />
          <div className="relative flex-1 flex flex-col glass-morphism rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/10 p-2 sm:p-4 shadow-2xl min-h-0">
            <VoiceTyper 
              language={language} 
              onLanguageChange={setLanguage}
            />
          </div>
        </div>

        {/* Feature Highlights - Compact and Shrinkable */}
        <div className="flex justify-center gap-4 sm:gap-12 mt-4 sm:mt-6 w-full px-4 shrink-0 overflow-x-auto custom-scrollbar-hide py-1">
          {[
            { icon: Shield, ...t.features.secure },
            { icon: Zap, ...t.features.fast },
            { icon: Globe, ...t.features.multi }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-2 shrink-0"
            >
              <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <div className="text-left">
                <h3 className="text-[11px] sm:text-sm font-bold text-white bengali-text leading-none mb-0.5">{feature.title}</h3>
                <p className="text-[8px] sm:text-[10px] text-slate-500 bengali-text leading-none">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer - Shrinkable */}
      <footer className="shrink-0 w-full py-2 sm:py-3 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white text-[8px] sm:text-[10px] mb-0.5 bengali-text font-medium">
            {t.footer.copy}
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 opacity-60 hover:opacity-100 transition-opacity">
            {t.footer.links.map((link, i) => (
              <span key={i} className="text-[7px] sm:text-[9px] uppercase tracking-widest text-white/80 font-bold">{link}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <AnimatePresence>
        {isGuideOpen && (
          <PunctuationGuide 
            language={language}
            onClose={() => setIsGuideOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
