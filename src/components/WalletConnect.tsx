"use client";

import React from "react";
import { useAccount, useChainId } from 'wagmi';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getChainName } from "@/lib/utils";


interface WalletConnectProps {
  address: string | undefined;
  chainId: number | undefined;
}

const ConnectWallet: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { open } = useWeb3Modal();
  const walletModal = () => {
    console.log('open wallet modal', chainId);
    open();
    
  }

  return (
    <div>
      {isConnected ? (
        <button onClick={walletModal}>
          {getChainName(chainId)} {address?.slice(0,6)}
        </button>
      ) : (
        <button onClick={walletModal}>
          Login
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;