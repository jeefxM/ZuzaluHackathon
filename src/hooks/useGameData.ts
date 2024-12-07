import { LOOTERY_ABI } from "@/abis/Lootery";
import { CONTRACT_ADDRESS } from "@/casino-config";
import { getNowInSeconds } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { hashFn, readContractsQueryOptions } from "wagmi/query";

export function useGameData({
  gameId,
  refetchInterval,
}: {
  gameId: bigint;
  refetchInterval?: number;
}) {
  const config = useConfig();
  const options = readContractsQueryOptions(config, {
    contracts: [
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "jackpot",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "isApocalypseMode",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "isGameActive",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "gamePeriod",
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "gameData",
        args: [gameId],
      },
      {
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "accruedCommunityFees",
      },
    ] as const,
    allowFailure: false,
  });

  // @ts-ignore
  const { data, ...rest } = useSuspenseQuery({
    ...options,
    // See https://github.com/wevm/wagmi/issues/3855
    queryKeyHashFn: hashFn,
    refetchInterval,
  });

  const [
    jackpot,
    // apocalypseGameId,
    isApocalypseMode,
    isActive,
    roundDuration,
    gameData,
    accruedCommunityFees,
  ] = data;

  const [ticketsSold, startedAt, winningPickId] = gameData;
  // const isApocalypse = apocalypseGameId === gameId;

  const roundEndTime = startedAt + roundDuration;
  const roundHasEnded = BigInt(getNowInSeconds()) > roundEndTime;

  return {
    jackpot,
    ticketsSold,
    startedAt,
    winningPickId,
    isActive,
    isApocalypse: isApocalypseMode,
    // apocalypseGameId,
    roundDuration,
    roundEndTime,
    roundHasEnded,
    accruedCommunityFees,
    ...rest,
  };
}
