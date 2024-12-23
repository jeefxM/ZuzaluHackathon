"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { type UseAccountReturnType } from "wagmi";

interface WalletContextType {
  isWalletConnected: boolean;
  walletStatus: "connecting" | "reconnecting" | "connected" | "disconnected";
  walletAddress: string | undefined;
}

const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  walletStatus: "disconnected",
  walletAddress: undefined,
});

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address, status } = useAccount();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(status === "connected");
  }, [status]);

  const value = {
    isWalletConnected,
    walletStatus: status,
    walletAddress: address,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletContextProvider");
  }
  return context;
};
