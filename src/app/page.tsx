"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
// import { client } from "./client";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import WalletConnect from "@/components/WalletConnect";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="">
      <Hero />
    </main>
  );
}
