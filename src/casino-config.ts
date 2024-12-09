import { parseUnits, zeroAddress, type Address } from "viem";
import { base, scroll } from "viem/chains";

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
// BASE
// export const FACTORY_ADDRESS: Address =
//   "0x0f246F0a251664d924002626Db6F856060a6B816";
// // The contract address of the featured lottery
// export const CONTRACT_ADDRESS: Address =
//   "0xB76e92961554445671d806Bf34068d4ff38e008F";
// The address of the ETH adapter contract
// export const LOOTERY_ETH_ADAPTER_ADDRESS: Address =
//   "0xF9aC611be31983EB9030d2F201Af566b59d5BCE2";
// The URL of the GraphQL API to get ticket data
// export const GRAPHQL_API =
//   "https://lootery-v1-indexer-base-prod.up.railway.app";

// SCROLL
export const FACTORY_ADDRESS: Address =
  "0xca90207F3632C27BAeabe381eB5a6772D75C11A5";
// The contract address of the featured lottery
export const CONTRACT_ADDRESS: Address =
  "0x69364277153EB562db8ad189f0A91292AC9A27F5";
export const LOOTERY_ETH_ADAPTER_ADDRESS: Address =
  "0x51A60D80Fa6d5FEDeb87E615Ed1D41661CB42A69";
export const GRAPHQL_API =
  "https://zuzalotto-indexer-production.up.railway.app";


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

export interface LotteryConfig {

}

   // helper for testing by creating new lotteries 
   // TODO in hook/component
  // function create (params: LotteryConfig) {
  //   if(!validateLotteryParams(params)) return null;

  
  //       hash = await writeContractAsync({
  //       chain: CHAIN,
  //       type: "eip1559",
  //       abi: LOOTERY_ABI,
  //       address: FACTORY_ADDRESS,
  //       functionName: "create",
  //       // args: [picks],
  //       args: [picks, address],
  //     });
  // }


export const validateLotteryParams = (params: LotteryConfig): boolean => {
  // Must comply with all of the following in Lootery.init check
  // - 0 < numbers per ticket <= 32
  // - numbers per ticket <= numbers to pick from
  // - lottery time period >= 10 minutes (>= `600` value to contract call)
  // - ticket price > 0
  // - community fee < 95% (there is 500 bps protocol fee) 
  // - minimum jackpot seed and jackpot delay > 0
  // - ticket price should be > 100 so fees can be taken
  return true;
}