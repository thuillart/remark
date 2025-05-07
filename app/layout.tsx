import "server-only";

import type { Metadata } from "next";
import { Borel, IBM_Plex_Mono, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const borel = Borel({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-borel",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, borel.variable, plexMono.variable)}>
        <ThemeProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster className="![--width:420px]" />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Get up and running with your users feedbacks.",
};
