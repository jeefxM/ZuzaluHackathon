"use client";

import "./globals.css";
import { Inter, Space_Mono } from "next/font/google";
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, gqlQueryClient } from "@/lib/wagmi";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:text-white">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={gqlQueryClient}>
            <ThemeProvider attribute="class" defaultTheme="system">
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
        <Toaster />
      </body>
    </html>
  );
}
