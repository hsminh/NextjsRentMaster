import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import ClientLayout from './ClientLayout';

// Fonts configuration
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const hb75 = localFont({
  src: [
    {
      path: '../../fonts/HB75.ttf',
      weight: '400',
    },
    {
      path: '../../fonts/HB75.ttf',
      weight: '700',
    },
  ],
  variable: '--font-hb75',
});

export const metadata: Metadata = {
  title: 'RentMaster - Quản lý và tìm kiếm phòng trọ',
  description: 'Nền tảng quản lý và tìm kiếm phòng trọ hàng đầu Việt Nam',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} ${hb75.variable}`}>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
