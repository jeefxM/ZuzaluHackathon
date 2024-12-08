"use client";

import React from "react";
import { useConnect, useChainId } from 'wagmi'
import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectWallet = () => {
  const chainId = useChainId();
  const { open } = useWeb3Modal();
  // const { connectors, connect } = useConnect()

  return (
    <div>
      
        <button  onClick={() => open()} >
          Login
        </button>
      {/* {connectors.map((connector) => (
        <button 
          key={connector.uid} 
          onClick={() => connect({ connector, chainId })}
        >
          {connector.name}
        </button>
      ))} */}
    </div>
  )


  // const { open } = useWeb3Modal();


  // return (
  //   <button onClick={() => open()}>
  //     Login
  //   </button>
  // );
}

export default ConnectWallet;

// import React from "react";
// import { createThirdwebClient } from "thirdweb";
// import { ConnectButton } from "thirdweb/react";
// import { darkTheme } from "thirdweb/react";
// import { createWallet } from "thirdweb/wallets";
// import { client } from "../app/client";

// const wallets = [
//   createWallet("io.metamask"),
//   createWallet("io.rabby"),
//   createWallet("me.rainbow"),
//   createWallet("com.coinbase.wallet"),
//   createWallet("io.zerion.wallet"),
// ];

// const WalletConnect = () => {
//   return (
//     <div className="rounded-xl">
//       <ConnectButton
//         client={client}
//         wallets={wallets}
//         connectButton={{ label: "Login" }}
//         theme={darkTheme({
//           fontFamily: "monoSpace",
//           colors: {
//             // connect,
//             selectedTextColor: "black",
//           },
//         })}
//         connectModal={{ size: "compact" }}
//       />
//     </div>
//   );
// };

// export default WalletConnect;
