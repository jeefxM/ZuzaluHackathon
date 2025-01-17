"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LotteryModal } from "./lotteryModal";

import { useCurrentLottery } from "@/hooks/useCurrentLottery";
import { useLotteryConfig } from "@/hooks/useLotteryConfig";
import { useLotteryData } from "@/hooks/useLotteryData";
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
  jackpotTotal: number;
};

const LotteryFunding = () => {
  const [data, setData] = useState<Casino[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { numPicks } = useLotteryConfig();
  const {
    gameState,
    gameId,
    refetch: refetchCurrentGame,
  } = useCurrentLottery();
  const {
    isActive,
    refetch: refetchGameData,
    roundHasEnded,
    jackpot,
    ticketsSold,
    roundEndTime,
    accruedCommunityFees,
  } = useLotteryData({ gameId });

  console.log(
    "casino:funding:round",
    gameId,
    gameState,
    isActive,
    roundHasEnded
  );

  useMemo(() => {
    // Transform the object into an array of Casino objects
    const eventArray: Casino[] = Object.values(lotteries);
    setData(eventArray);
  }, [lotteries]);

  const uniqueCountries = Array.from(
    new Set(data.map((item) => item.location))
  );

  const filteredData = selectedCountry
    ? data.filter((item) => item.location === selectedCountry)
    : data;

  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <p className="text-4xl font-a font-avenir">{`Lotteries`}</p>
          <p className="text-[#7958FF] text-2xl font-spaceMono bg-[rgba(91,91,91,0.5)] px-4 py-1 rounded">
            powered by LottoPGF
          </p>
        </div>
        <p className="font-spaceMono">{`Lotteries play a crucial role in crowdfunding for popup cities.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-spaceMono">Filter by Country:</p>
        <div className="flex flex-wrap gap-2">
          {uniqueCountries.map((country) => (
            <Button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                font-spaceMono px-4 py-2 rounded
                ${
                  selectedCountry === country
                    ? "bg-[#7958FF] text-white border-[#7958FF]"
                    : "bg-[rgba(25,25,25,0.5)] text-gray-300 border-gray-700 hover:border-[#7958FF] hover:text-[#7958FF]"
                }
                border transition-all duration-200
              `}
            >
              {country}
            </Button>
          ))}
          <Button
            onClick={() => setSelectedCountry(null)}
            className={`
              font-spaceMono px-4 py-2 rounded
              ${
                selectedCountry === null
                  ? "bg-[#7958FF] text-white border-[#7958FF]"
                  : "bg-[rgba(25,25,25,0.5)] text-gray-300 border-gray-700 hover:border-[#7958FF] hover:text-[#7958FF]"
              }
              border transition-all duration-200
            `}
          >
            All
          </Button>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-10 h-full">
        {filteredData.length > 0 &&
          filteredData.map((item, index) => (
            <div
              className="border-2 w-full max-w-md h-auto p-6 md:p-10 font-avenir"
              style={{
                backgroundColor: "rgba(25, 25, 25, 0.2)",
                borderColor: colors[index % colors.length],
              }} // 75% opacity
              key={item.name}
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-2xl md:text-3xl underline text-wrap mr-4">
                    {item.name}
                  </p>
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
                <div className="font-spaceMono flex flex-col gap-6 flex-grow">
                  <p className="min-h-[100px]">{item.description}</p>
                  <div>
                    <p className="pt-2">{`Price per ticket: ${item.pricePerTicket}`}</p>
                    <p className="pt-2">{`Price pool: ${item.jackpotTotal}`}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 mt-auto mb-4">
                  <LotteryModal
                    Title={item.name}
                    Description={item.description}
                    Location={item.location}
                    pricePerTicket={item.pricePerTicket}
                    lotteryContract={item.address}
                    jackpotTotal={item.jackpotTotal}
                    paymentTokenSymbol={item.tokenSymbol}
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

export default LotteryFunding;
