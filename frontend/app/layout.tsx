import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DuoLearn — Language Learning',
  description: 'Learn a new language with DuoLearn, your fun and free language learning companion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
