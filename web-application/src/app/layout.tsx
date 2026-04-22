import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { IntlProvider } from "@/contexts/IntlProvider";

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
    <html lang="en">
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

