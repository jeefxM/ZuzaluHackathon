import { LOOTERY_ABI } from "@/abis/Lootery";
import { CONTRACT_ADDRESS } from "@/casino-config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { readContractsQueryOptions } from "wagmi/query";

export function useLotteryConfig() {
  const config = useConfig();
  console.log('useLotteryConfig', config);

  const options = readContractsQueryOptions(config, {
    contracts: [
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "maxBallValue",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "pickLength",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "gamePeriod",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "ticketPrice",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "prizeToken",
      },
    ] as const,
    allowFailure: false,
  });

  // @ts-ignore
  const { data, ...rest } = useSuspenseQuery(options);

  const [maxBallValue, numPicks, gamePeriod, ticketPrice, prizeToken] = data;

  return {
    maxBallValue,
    numPicks,
    gamePeriod,
    ticketPrice,
    prizeToken,
    ...rest,
  };
}
