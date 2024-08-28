"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CasinoDialog } from "./casinoDialog";

import { useCurrentGame } from "@/hooks/useCurrentGame";
import { useGameConfig } from "@/hooks/useGameConfig";
import { useGameData } from "@/hooks/useGameData";
import lotteries from "../../../public/lotteries.json";

const colors = ["#00F2FF", "#7958FF", "#FF00FF"];

interface Organizer {
  [key: string]: string;
}

type Casino = {
  chainId: string;
  address: string;
  name: string;
  description: string;
  location: string;
  details: string;
  organizers: Organizer;
  threshold: string;
  deadline: string;
  token: string;
  tokenDecimals: string;
  tokenSymbol: string;
  status: boolean;
  pricePerTicket: number;
  prizePool: number;
};

const CasinoFunding = () => {
  const [data, setData] = useState<Casino[]>([]);
  const { numPicks } = useGameConfig();
  const { gameState, gameId, refetch: refetchCurrentGame } = useCurrentGame();
  const {
    isActive,
    refetch: refetchGameData,
    roundHasEnded,
    jackpot,
    ticketsSold,
    roundEndTime,
    accruedCommunityFees,
  } = useGameData({ gameId });

  console.log(
    "casino:funding:round",
    gameId,
    gameState,
    isActive,
    roundHasEnded
  );

  useEffect(() => {
    // Transform the object into an array of Casino objects
    const eventArray: Casino[] = Object.values(lotteries);
    setData(eventArray);
  }, []);

  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <p className="text-4xl font-a font-avenir">{`casino`}</p>
          <p className="text-[#7958FF] text-2xl font-spaceMono bg-[rgba(91,91,91,0.5)] px-4 py-1 rounded">
            powered by LottoPGF
          </p>
        </div>
        <p className="font-spaceMono">{`Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum`}</p>
      </div>
      <div className="flex md:flex-row flex-col gap-10">
        {data.length > 0 &&
          data?.map((item, index) => (
            <div
              className="border-2 w-full max-w-md h-auto p-6 md:p-10 font-avenir"
              style={{
                backgroundColor: "rgba(25, 25, 25, 0.2)",
                borderColor: colors[index % colors.length],
              }} // 75% opacity
              key={item.name}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <p className="text-2xl md:text-3xl underline">{item.name}</p>
                {item.status ? (
                  <Button className="bg-black border-2 text-[#00FF1A] border-[#00FF1A] mt-2 md:mt-0">
                    Open
                  </Button>
                ) : (
                  <Button className="bg-black border-2 text-[#FF006B] border-[#FF006B] mt-2 md:mt-0">
                    Closed
                  </Button>
                )}
              </div>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
                <p>{item.location}</p>
              </div>
              <div className="font-spaceMono flex flex-col gap-6">
                <p>{item.description}</p>
                <div>
                  <p className="pt-2">{`Price per ticket: ${item.pricePerTicket}`}</p>
                  <p className="pt-2">{`Price pool: ${item.prizePool}`}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 ">
                  <CasinoDialog
                    Title={"Zuvillage Georgia"}
                    Description={`ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`}
                    Location={`Kachreti, Georgia`}
                    pricePerTicket={item.pricePerTicket}
                    prizePool={item.prizePool}
                    status={item.status}
                    color={colors[index % colors.length]}
                    chainId="534352"
                  />

                  <Button className="bg-[#0D0D0D] px-10 focus:bg-black">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CasinoFunding;
