"use client";

import React, { useEffect } from "react";
import { useChainId } from "wagmi";
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
import { useWallet } from "@/app/context/WalletContext";
import Avatar from "./Profile/Avatar";

const ConnectWallet: React.FC = () => {
  const { walletStatus, walletAddress } = useWallet();
  const chainId = useChainId();
  const { open } = useWeb3Modal();
  const router = useRouter();

  useEffect(() => {
    console.log("Wallet Status Changed:", walletStatus);
    console.log("Wallet Address:", walletAddress);
  }, [walletStatus, walletAddress]);

  const walletModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Opening wallet modal, Chain ID:", chainId);
    open();
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Navigating to profile");
    router.push("/profile");
  };

  console.log("Current render state - Status:", walletStatus);

  if (walletStatus === "connecting" || walletStatus === "reconnecting") {
    console.log("Rendering skeleton - connecting state");
    return <Skeleton className="h-10 w-24 bg-gray-800" />;
  }

  if (walletStatus === "disconnected") {
    console.log("Rendering login button - disconnected state");
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

  console.log("Rendering connected state dropdown");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-gray-700 gap-2 flex bg-transparent text-white hover:bg-gray-800 hover:text-white"
          onClick={(e) => e.stopPropagation()} // Prevent triggering parent click events
        >
          <Avatar address={walletAddress} size={24} />
          {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}{" "}
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
