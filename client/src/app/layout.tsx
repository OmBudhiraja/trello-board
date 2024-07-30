import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import UserProvider from '@/components/UserProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A simple task manager app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <UserProvider>{children}</UserProvider>
          <Toaster position="top-right" />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
