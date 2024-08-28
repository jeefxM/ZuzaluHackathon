'use client'

import "./globals.css";
import { Inter, Space_Mono } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";

import { ThemeProvider } from "@/components/theme-provider";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
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
            <ThemeProvider attribute="class" defaultTheme="system">
                <ThirdwebProvider>
                  {children}
                  </ThirdwebProvider>
            </ThemeProvider>
          </WagmiProvider>
      </body>
    </html>
  );
}
