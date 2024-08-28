"use client";

import React from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../app/client";

const wallets = [
  createWallet("io.metamask"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("com.coinbase.wallet"),
  createWallet("io.zerion.wallet"),
];

const WalletConnect = () => {
  return (
    <div className="rounded-xl">
      <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{ label: "Login" }}
        theme={darkTheme({
          fontFamily: "monoSpace",
          colors: {
            // connect,
            selectedTextColor: "black",
          },
        })}
        connectModal={{ size: "compact" }}
      />
    </div>
  );
};

export default WalletConnect;
