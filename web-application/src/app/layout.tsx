import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { IntlProvider } from "@/contexts/IntlProvider";

// Display face: high-contrast serif for headlines and the wordmark.
// `opsz` lets large sizes pick up the sharper, more dramatic cut.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

// Text face: neutral workhorse for UI chrome, metadata and body copy.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GlobalBites - Discover Culinary Delights",
  description: "Your gateway to discovering culinary delights from around the world",
};

// Import all message files
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import deMessages from '../../messages/de.json';
import frMessages from '../../messages/fr.json';
import itMessages from '../../messages/it.json';
import jaMessages from '../../messages/ja.json';
import zhMessages from '../../messages/zh.json';

const allMessages = {
  en: enMessages,
  es: esMessages,
  de: deMessages,
  fr: frMessages,
  it: itMessages,
  ja: jaMessages,
  zh: zhMessages,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `lang` is corrected client-side by IntlProvider once the saved locale loads.
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased">
        <SessionProvider>
          <IntlProvider allMessages={allMessages}>
            {children}
          </IntlProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

