"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, gqlQueryClient } from "@/lib/wagmi";
import { WalletContextProvider } from "./context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WagmiProvider config={wagmiConfig}>
          <WalletContextProvider>
            <QueryClientProvider client={gqlQueryClient}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </QueryClientProvider>
          </WalletContextProvider>
        </WagmiProvider>
        <Toaster />
      </body>
    </html>
  );
}
