import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { Toaster } from 'sonner';

const font = Oswald({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Shield AI',
  description:
    'Never compromise on safety using Shield AI, a proactive threat detection and alert system that keeps you and loved ones safe.',
  keywords: ['shield', 'ai', 'safety', 'alert', 'threat', 'app'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon_io/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon_io/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon_io/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
      </head>

      <body
        className={cn(
          'min-w-screen flex min-h-screen flex-col items-center justify-start bg-background font-sans antialiased',
          font.variable
        )}
      >
        <Navbar />
        <main className='flex grow flex-col bg-background px-24 pb-4 pt-8'>
          <div className='opacity-0 animate-in'>{children}</div>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
