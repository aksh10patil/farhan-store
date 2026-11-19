import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const brigold = localFont({
  src: './fonts/Brigold-DEMO.otf',
  variable: '--font-brigold',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZAID® — TRAIL SEASON',
  description: 'Trail Season Drop 01 — Engineered Outerwear & Layering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${brigold.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col studio-backdrop text-[#EAEAE6] selection:bg-[#FF5E00] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
