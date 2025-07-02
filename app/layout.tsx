import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";

import "./globals.css";
import { AppProvider } from "@/contexts";
import { GlobalUIIndicators } from "@/components/global-ui-indicators";

export const metadata: Metadata = {
  title: "Garage Bot",
  description:
    "Garage Bot is a chatbot that uses reasoning models with Next.js and the AI SDK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning>
        <Toaster position="top-center" />
        <AppProvider>
          <GlobalUIIndicators />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
