import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

import { ThemeProvider } from "@/components/theme-provider";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:text-white">
          {/* <WagmiProvider config={wagmiConfig}> */}
            <ThemeProvider attribute="class" defaultTheme="system">
                <ThirdwebProvider>
                  {children}
                  </ThirdwebProvider>
            </ThemeProvider>
          {/* </WagmiProvider> */}
      </body>
    </html>
  );
}
