import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KONTHOSHOR',
  description: 'A premium voice-to-text application for Bengali language with a modern, minimalist interface.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn-BD" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Shonar+Bangla:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="preload" as="style" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Shonar+Bangla:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 antialiased overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
