import { LOOTERY_ABI } from "@/abis/Lootery";
import { CONTRACT_ADDRESS } from "@/casino-config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { readContractQueryOptions } from "wagmi/query";

// See Lootery contract
export enum GameState {
  Purchase,
  DrawPending,
}

export function useCurrentLottery() {
  const config = useConfig();
  const options = readContractQueryOptions(config, {
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "currentGame",
  });

  // @ts-ignore
  const { data, ...rest } = useSuspenseQuery(options);

  const [gameState, gameId] = data;

  return {
    ...rest,
    gameState: gameState as GameState,
    gameId,
  };
}
