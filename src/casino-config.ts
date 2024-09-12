import { parseUnits, zeroAddress, type Address } from "viem";
import { scroll } from "viem/chains";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

// Project metadata
export const METADATA = {
  name: "Popup Capital",
  title: "Popup Capital",
  description:
    "Create popup cities around the world with community based funding mechanisms",
  url: APP_URL,
  icon: `${APP_URL}/images/zuvillage-icon.png`,
  logo: `/images/zuvillage-icon.png`,
  bannerImage: "/images/dvibes-cover.png",
};

// The chain where your lottery contract is deployed
export const CHAIN = scroll;

// The ticker of the prize token. Will be used when rendering prizes.
export const PRIZE_TOKEN_TICKER = "ETH";
export const PRIZE_TOKEN_DECIMALS = 18;
// If true the user will pay with native tokens via the ETH adapter,
// otherwise they will pay with the ERC20 token directly
export const PRIZE_TOKEN_IS_NATIVE = true;

// contract address to create new lotteries from
export const FACTORY_ADDRESS: Address =
  "0x1e7ac276cbdae55689df1d99108d69fff444cb88";

// The contract address of the featured lottery
export const CONTRACT_ADDRESS: Address =
  "0xB76e92961554445671d806Bf34068d4ff38e008F";

// The address of the ETH adapter contract
export const LOOTERY_ETH_ADAPTER_ADDRESS: Address =
  "0x87B253ab0a7ba6C7f273d5122C6246C444aDc517";

// The URL of the GraphQL API to get ticket data
export const GRAPHQL_API =
  "https://powerbald-v1-indexer-production-3415.up.railway.app";

// The amount of money you're trying to raise
export const FUNDRAISE_TARGET = parseUnits("0.069", PRIZE_TOKEN_DECIMALS);

// Control if frame functionality should be enabled
export const FRAME_ENABLED = false;

// The farcaster ID the user should follow for a free mint
export const FRAME_FOLLOWING_FID = 0;

// The username of the account the user should follow
export const FRAME_FOLLOWING_USERNAME = "";

// The address and required amount of the token the user should hold to be eligible
export const FRAME_CLAIM_REQUIRED_TOKEN_ADDRESS = zeroAddress;
export const FRAME_CLAIM_REQUIRED_TOKEN_SYMBOL = "";
export const FRAME_CLAIM_REQUIRED_TOKEN_DECIMALS = 0;
export const FRAME_CLAIM_REQUIRED_TOKEN_AMOUNT = parseUnits(
  "0",
  FRAME_CLAIM_REQUIRED_TOKEN_DECIMALS
);

// The interval at which the user can claim a free ticket
export const FRAME_CLAIM_INTERVAL: "per_round" | "daily" = "daily";

// The namespace of the KV store used to track claims. Needs to be unique for the lottery
export const FRAME_CLAIM_KV_NAMESPACE = "dvibes";
