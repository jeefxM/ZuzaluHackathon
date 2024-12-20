import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function getRandomInt(min: number, max: number) {
  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1);
  global.crypto.getRandomValues(byteArray);

  const num = byteArray[0];

  const range = max - min + 1;
  const max_range = 256;
  if (num! >= Math.floor(max_range / range) * range)
    return getRandomInt(min, max);
  return min + (num! % range);
}

export function getRandomPicks(amount: number, max: number) {
  const picks = new Set<number>();
  while (picks.size < amount) {
    picks.add(getRandomInt(1, max));
  }
  return new Set(Array.from(picks).sort((a, b) => (a > b ? 1 : -1)));
}


export function getWethAddress(chainId: string) {
  const contracts: Record<string, string> = {
    "8453": "0x4200000000000000000000000000000000000006",
    "534352": "0x5300000000000000000000000000000000000004",
    // "10": "0x",
    // "1": "0x",
  };
  return contracts[chainId] || "";
};

export function getChainName(chainId: number) {
  const contracts: Record<string, string> = {
    "8453": "Base",
    "534352": "Scroll",
    "10": "OP",
    "1": "ETH",
  };
  return contracts[chainId] || "No Chain";
};
