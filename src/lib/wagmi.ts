import { CHAIN, CONTRACT_ADDRESS, METADATA } from "@/casino-config";
import { LOOTERY_ABI } from "@/abis/Lootery";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import {
  createClient,
  createPublicClient,
  createWalletClient,
  fallback,
  getContract,
  http as viemHttp,
  parseGwei,
  webSocket,
  type GetContractReturnType,
} from "viem";
import { mainnet, scroll } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const transport = fallback([
  viemHttp(process.env.NEXT_PUBLIC_SCROLL_RPC_HTTP),
  webSocket(process.env.NEXT_PUBLIC_SCROLL_RPC_WS),
  viemHttp(),
  webSocket(),
]);

export const publicClient = createPublicClient({
  chain: CHAIN,
  transport,
});

export const walletClient = createWalletClient({
  chain: CHAIN,
  transport,
});

export const lootery: GetContractReturnType<
  typeof LOOTERY_ABI,
  { public: typeof publicClient; wallet: typeof walletClient },
  typeof CONTRACT_ADDRESS
> = getContract({
  address: CONTRACT_ADDRESS,
  abi: LOOTERY_ABI,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

const SCROLL_MINIMUM_MAX_FEE_PER_GAS = parseGwei("0.3");

export async function estimateFeesPerGas() {
  let { maxFeePerGas, maxPriorityFeePerGas } =
    await publicClient.estimateFeesPerGas();

  if (publicClient.chain.id === scroll.id) {
    maxFeePerGas =
      maxFeePerGas < SCROLL_MINIMUM_MAX_FEE_PER_GAS
        ? SCROLL_MINIMUM_MAX_FEE_PER_GAS
        : maxFeePerGas;
  }

  return { maxFeePerGas, maxPriorityFeePerGas };
}

const metadata = {
  name: METADATA.name,
  description: METADATA.description,
  url: METADATA.url,
  icons: [METADATA.icon],
};

const chains = [CHAIN] as const;

const connectors = [
  injected(),
  walletConnect({ projectId }),
  metaMask(),
  safe(),
];

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  connectors,
  transports: {
    [CHAIN.id]: transport,
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  batch: {
    multicall: true,
  },
});

const web3Modal = createWeb3Modal({
  allowUnsupportedChain: false,
  wagmiConfig,
  projectId,
  enableAnalytics: false,
  enableSwaps: false,
  enableOnramp: false,
});

export const ensConfig = createConfig({
  chains: [mainnet],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

export const gqlQueryClient = new QueryClient();
