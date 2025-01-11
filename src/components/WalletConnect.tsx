"use client";

import React, { useEffect } from "react";
import { useAccount, useChainId, useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import Avatar from "./Profile/Avatar";

const ConnectWallet: React.FC = () => {
  const { address, isConnecting, isReconnecting, isConnected } = useAccount();
  const chainId = useChainId();
  const { open } = useWeb3Modal();
  const { connectors } = useConnect();
  const router = useRouter();

  // Effect to handle initial connection state
  useEffect(() => {
    const checkConnection = async () => {
      const hasInjectedProvider =
        typeof window !== "undefined" && window.ethereum;
      if (hasInjectedProvider && !isConnected) {
        // Check if MetaMask is installed
        const isMetaMaskInstalled = connectors.some((c) => c.id === "metaMask");
        if (isMetaMaskInstalled) {
          try {
            await window.ethereum.request({ method: "eth_accounts" });
          } catch (error) {
            console.error("Error checking accounts:", error);
          }
        }
      }
    };

    checkConnection();
  }, [isConnected, connectors]);

  const walletModal = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Error opening wallet modal:", error);
    }
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  if (isConnecting || isReconnecting) {
    return <Skeleton className="h-10 w-24 bg-gray-800" />;
  }

  if (!isConnected || !address) {
    return (
      <Button
        onClick={walletModal}
        variant="outline"
        className="border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-gray-700 gap-2 flex bg-transparent text-white hover:bg-gray-800 hover:text-white"
        >
          <Avatar address={address} size={24} />
          {address?.slice(0, 4)}...{address?.slice(-4)}{" "}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-black border border-gray-700 text-white"
        align="end"
      >
        <DropdownMenuItem
          onClick={walletModal}
          className="hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
        >
          Wallet
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={goToProfile}
          className="hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
        >
          Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectWallet;
