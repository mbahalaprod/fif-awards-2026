import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import './globals.css';


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fifawards.gn';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FIF AWARDS 2026 — 4ᵉ édition du Festival International du Film',
    template: '%s | FIF AWARDS 2026',
  },
  description:
    "Festival International du Film AWARDS, 4ᵉ édition. Les 19 et 20 novembre 2026 à Conakry, au Radisson Blu. Célébrer toute la chaîne de valeur du cinéma guinéen.",
  keywords: [
    'FIF AWARDS',
    'cinéma guinéen',
    'festival de film',
    'Conakry',
    'Guinée',
    'Radisson Blu',
    '2026',
  ],
  authors: [{ name: "Comité d'Organisation FIF AWARDS" }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'FIF AWARDS 2026',
    title: 'FIF AWARDS 2026 — 4ᵉ édition',
    description:
      'Festival International du Film AWARDS, 4ᵉ édition. Les 19 et 20 novembre 2026 à Conakry.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIF AWARDS 2026',
    description: '4ᵉ édition du Festival International du Film, Conakry, 19-20 novembre 2026.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background-primary text-text-primary antialiased">
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
