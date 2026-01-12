import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalBites - Discover Culinary Delights",
  description: "Your gateway to discovering culinary delights from around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
