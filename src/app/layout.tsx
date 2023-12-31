import './globals.css';
import { Inter } from 'next/font/google';

import Provider from '@/provider/provider';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '体重・体脂肪率管理アプリ',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
