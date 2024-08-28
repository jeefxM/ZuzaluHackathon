"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { FaMapMarkerAlt } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Line } from "rc-progress";
import { useState } from "react";

import { LOOTERY_ABI } from "@/abis/Lootery";
import { LOOTERY_ETH_ADAPTER_ABI } from "@/abis/LooteryETHAdapter";

import { Amount } from "@/components/Amount";
import {
  CHAIN,
  CONTRACT_ADDRESS,
  LOOTERY_ETH_ADAPTER_ADDRESS,
  PRIZE_TOKEN_DECIMALS,
  PRIZE_TOKEN_TICKER,
} from "@/casino-config";
import { useBalanceWithAllowance } from "@/hooks/useBalanceWithAllowance";
import { GameState, useCurrentGame } from "@/hooks/useCurrentGame";
import { useGameConfig } from "@/hooks/useGameConfig";
import { useGameData } from "@/hooks/useGameData";
import { useTickets } from "@/hooks/useTickets";
import { Loader2Icon, PlusIcon } from "lucide-react";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { getRandomPicks, getWethAddress } from "@/lib/utils";
import "../../../public/lotteries.json";

interface Props {
  Title: String;
  Description: String;
  Location: String;
  pricePerTicket: number;
  chainId: string;
  prizePool: number;
  status: boolean;
  color: string;
}

export function CasinoDialog({
  Title,
  Description,
  Location,
  chainId,
  status,
  color,
}: Props) {
  const [selectedNumber, setSelectedNumber] = useState(1);

  const client = usePublicClient();

  const { address, isConnected } = useAccount();
  const { gameId, gameState } = useCurrentGame();
  const { isActive } = useGameData({ gameId });
  const { numPicks, ticketPrice, prizeToken } = useGameConfig();
  const { refetch: refetchTickets } = useTickets({ address, gameId });

  const {
    balance,
    allowance,
    increaseAllowance,
    refetch: refetchAllowance,
    isPendingAllowance,
  } = useBalanceWithAllowance({
    address,
    token: prizeToken,
  });

  // console.log('casino:dialogue:price', ticketPrice, prizeToken, numPicks);

  const { writeContractAsync, data: hash } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isConfirming || isPendingAllowance;

  const totalPrice = ticketPrice * BigInt(selectedNumber);

  const hasEnoughBalance = !!balance && balance >= totalPrice;
  const hasEnoughAllowance = !!allowance && allowance >= totalPrice;

  function onPurchaseComplete() {
    setTimeout(() => refetchTickets(), 2000);
    refetchAllowance();
    // reset();
    // onPurchase?.();
  }

  async function onSubmit(e: any) {
    console.log("on submit Ticket", e);

    if (!address || !selectedNumber) return;

    let hash: string;
    const picks = Array.from({ length: selectedNumber }, () => {
      const randomPicks = getRandomPicks(numPicks, 8);
      return {
        whomst: address,
        picks: Array.from(randomPicks),
      };
    });

    // assume
    console.log("casino:weth", getWethAddress(chainId));

    if (prizeToken == getWethAddress(chainId)) {
      hash = await writeContractAsync({
        chain: CHAIN,
        type: "eip1559",
        abi: LOOTERY_ETH_ADAPTER_ABI,
        address: LOOTERY_ETH_ADAPTER_ADDRESS,
        functionName: "purchase",
        value: totalPrice,
        args: [CONTRACT_ADDRESS, picks],
      });
    } else {
      if (!hasEnoughAllowance) return;

      hash = await writeContractAsync({
        chain: CHAIN,
        type: "eip1559",
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "purchase",
        args: [picks],
      });
    }
  }

  // if (gameState === GameState.DrawPending) {
  //   return <p>Draw is pending</p>;
  // }

  // if (!isActive) {
  //   return <p>Game is not active.</p>;
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#0D0D0D] px-10 focus:bg-black">Fund</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[755px] py-8 max-w-full border-2 bg-black font-spaceMono mr-4 overflow-y-auto"
        style={{ borderColor: color, maxHeight: "80vh" }} // Set max height and enable scrolling
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col md:flex-row justify-start items-center gap-7">
              <p className="font-avenir underline text-3xl">{Title}</p>
              {status ? (
                <Button className="bg-black border-2 text-[#00FF1A] border-[#00FF1A] mt-2 md:mt-0">
                  Open
                </Button>
              ) : (
                <Button className="bg-black border-2 text-[#FF006B] border-[#FF006B] mt-2 md:mt-0">
                  Closed
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-14 font-spaceMono">
          <div className="flex-1">
            <p className="mb-10">{Description}</p>
            <p>{`Enter the number of tickets you want to buy: `}</p>
            <div className="flex flex-row items-center gap-2">
              {/* <p>{`${pricePerTicket} ETH X`}</p> */}
              <Input
                className="max-w-[100px] flex items-center text-base text-center"
                max={10}
                min={1}
                defaultValue={1}
                type="number"
                disabled={!status}
                onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
              />
              {/* <span>{` = ${selectedNumber * pricePerTicket} ETH`}</span> */}
            </div>
            <Button
              className="border-2 mt-5 w-full"
              disabled={status == false}
              // onSubmit={onSubmit}
              onClick={onSubmit}
              style={{ borderColor: color }}
            >
              Fund
            </Button>
          </div>
          <div
            className="border-2 flex flex-col gap-4 min-w-[300px] p-3"
            style={{ borderColor: color }}
          >
            <p className="underline font-bold">Details</p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
              <span className="font-light">{`${Location}`}</span>
            </p>
            <div className="mt-auto pt-auto">
              {/* <p className="pt-2">{`Price per ticket: ${pricePerTicket}`}</p>
              <p className="pt-2">{`Price pool: ${prizePool}`}</p> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
