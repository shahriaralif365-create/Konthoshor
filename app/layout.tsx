import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true, variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', preload: true, variable: '--font-outfit' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'Konthoshor | Free Bangla Voice Typing & Speech to Text 2026',
  description: 'Experience the most accurate Bangla voice typing tool. Convert your speech to text in real-time with Konthoshor. Best AI dictation app for Bengali, English, Arabic, and Urdu.',
  keywords: [
    'Bangla Voice Typing', 'Bengali Speech to Text', 'Bangla Voice to Text', 
    'বাংলা ভয়েস টাইপিং', 'বাংলা স্পিচ টু টেক্সট', 'কণ্ঠস্বর', 'Konthoshor',
    'Online Bangla Dictation', 'Bangla Voice Writing', 'Free Bangla Typing Tool',
    'speech to text tools 2026', 'best AI dictation apps', 'accurate voice typing for Bangla',
    'fastest voice to text converter', 'AI voice typing software for writers', 'online Bangla dictation'
  ],
  authors: [{ name: 'Konthoshor Team' }],
  openGraph: {
    title: 'Konthoshor | Advanced Bangla Voice Typing & Speech to Text',
    description: 'The ultimate tool for converting Bangla speech to text instantly. Accurate, fast, and free for writers and students.',
    url: 'https://konthoshor.com',
    siteName: 'Konthoshor',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konthoshor | Accurate Bangla Voice Typing Online',
    description: 'Write in Bangla using just your voice. The best free AI-powered speech-to-text tool.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn-BD" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-50 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f615,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#8b5cf610,transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>
        {children}
      </body>
    </html>
  );
}
