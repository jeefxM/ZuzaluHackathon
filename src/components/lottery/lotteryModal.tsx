"use client";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Line } from "rc-progress";
import { Loader2Icon, PlusIcon } from "lucide-react";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { erc20Abi, zeroAddress, type Address } from "viem";

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
import { Amount } from "@/components/Amount";

import { useBalanceWithAllowance } from "@/hooks/useBalanceWithAllowance";
import { GameState, useCurrentLottery } from "@/hooks/useCurrentLottery";
import { useLotteryConfig } from "@/hooks/useLotteryConfig";
import { useLotteryData } from "@/hooks/useLotteryData";
import { useLotteryTickets } from "@/hooks/useLotteryTickets";
import { getRandomPicks, getWethAddress } from "@/lib/utils";

import {
  CHAIN,
  CONTRACT_ADDRESS,
  FACTORY_ADDRESS,
  LOOTERY_ETH_ADAPTER_ADDRESS,
  PRIZE_TOKEN_DECIMALS,
  PRIZE_TOKEN_TICKER,
} from "@/casino-config";
import "../../../public/lotteries.json";
import { LOOTERY_ABI } from "@/abis/Lootery";
import { LOOTERY_ETH_ADAPTER_ABI } from "@/abis/LooteryETHAdapter";

interface Props {
  Title: string;
  Description: string;
  Location: string;
  pricePerTicket: number;
  paymentTokenSymbol: string;
  chainId: string;
  jackpotTotal: number;
  lotteryContract: Address;
  status: boolean;
  color: string;
}

export function LotteryModal({
  Title,
  Description,
  Location,
  chainId,
  status,
  pricePerTicket,
  jackpotTotal,
  lotteryContract,
  paymentTokenSymbol,
  color,
}: Props) {
  const [selectedNumber, setSelectedNumber] = useState(1);

  const client = usePublicClient();

  const { address, isConnected } = useAccount();
  const { gameId, gameState } = useCurrentLottery();
  const { isActive } = useLotteryData({ gameId });
  const { numPicks, ticketPrice, prizeToken } = useLotteryConfig();
  const { refetch: refetchTickets } = useLotteryTickets({ address, gameId });

  const {
    balance,
    allowance,
    increaseAllowance,
    refetch: refetchAllowance,
    isPendingAllowance,
  } = useBalanceWithAllowance({
    address,
    target: lotteryContract,
    token: prizeToken,
  });

  const { writeContractAsync, data: hash } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isConfirming || isPendingAllowance;
  
  const totalPrice = ticketPrice * BigInt(selectedNumber);

  const isNativeToken = prizeToken === getWethAddress(chainId)
  const hasEnoughBalance = !!balance && balance >= totalPrice;
  const hasEnoughAllowance = !!allowance && allowance >= totalPrice;

  function onPurchaseComplete() {
    setTimeout(() => refetchTickets(), 2000);
    refetchAllowance();
    // reset();
    // onPurchase?.();
  }

  async function onSubmit(e: any) {
    if (!address || !selectedNumber) return;

    let hash: string;
    const picks = Array.from({ length: selectedNumber }, () => {
      const randomPicks = getRandomPicks(numPicks, 8); // TODO replace 8 with totalNumbers from contract since customizable
      return {
        whomst: address,
        pick: Array.from(randomPicks),
      };
    });

    if (isNativeToken) {
      hash = await writeContractAsync({
        chain: CHAIN,
        type: "eip1559",
        abi: LOOTERY_ETH_ADAPTER_ABI,
        address: LOOTERY_ETH_ADAPTER_ADDRESS,
        functionName: "purchase",
        value: totalPrice,
        args: [lotteryContract, picks, zeroAddress],
      });
    } else {
      if (!hasEnoughAllowance && !isNativeToken) {
        await writeContractAsync({
          chain: CHAIN,
          type: "eip1559",
          abi: erc20Abi,
          address: prizeToken,
          functionName: "approve",
          // args: [picks],
          args: [lotteryContract, totalPrice],
        });

      }
      
      hash = await writeContractAsync({
        chain: CHAIN,
        type: "eip1559",
        abi: LOOTERY_ABI,
        address: lotteryContract,
        functionName: "purchase",
        // args: [picks],
        args: [picks, zeroAddress],
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
              <p>{`${pricePerTicket} ETH X`}</p>
              <Input
                className="max-w-[100px] flex items-center text-base text-center"
                max={100}
                min={1}
                defaultValue={selectedNumber}
                type="number"
                disabled={!status}
                onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
              />
              <span>{` = ${selectedNumber * pricePerTicket} ${paymentTokenSymbol}`}</span>
            </div>
            <Button
              className="border-2 mt-5 w-full"
              disabled={!status}
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
              <p className="pt-2">{`Price pool: ${jackpotTotal}`}</p> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
