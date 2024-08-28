"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { FaMapMarkerAlt } from "react-icons/fa";
import "rc-slider/assets/index.css";
import { Line } from "rc-progress";
import { useEffect, useState } from "react";
import { Campaign } from "@/lib/fora"; // Assuming the hook is in this file
import { CampaignCard } from "./campaign";

const data = {
  "Test Popup #1 Name": {
    chainId: "8453",
    address: "0x0a2503a423deEF425a71d0e2dd4Ff44244E81c75",
    name: "Test Fora Campaign #1",
    description: "pizza parties",
    organizers: { "Kiba Gateaux": "warpcast.com/kiba" },
    threshold: "100000",
    location: "Osaka, Japan",
    details: "https://zuzlau.city/",
    deadline: "timestamp",
    token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    tokenDecimals: 8,
    tokenSymbol: "USDC",
  },
};

interface Props {
  Title: String;
  Description: String;
  Location: String;
  AmountRaised: number;
  AmountToRaise: number;
  status: boolean;
  color: string;
}
interface Campaigns {
  [key: string]: Campaign;
}

export function DialogComponent({
  Title,
  Description,
  Location,
  AmountRaised,
  AmountToRaise,
  status,
  color,
}: Props) {
  const campaign = data["Test Popup #1 Name"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#0D0D0D] px-10 focus:bg-black">Donate</Button>
      </DialogTrigger>
      <DialogContent
        style={{ borderColor: color, maxHeight: "80vh" }}
        className="sm:max-w-[755px] py-8 max-w-full border-2 bg-black font-spaceMono mr-4 overflow-y-auto"
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
            <p className="mb-10 min-h-[180px]">{Description}</p>
            <p>{`Amount to contribute: `}</p>
            <div className="flex flex-row items-center gap-2">
              <Input
                className="max-w-[150px] text-center font-bold"
                value={1000}
                disabled
              />
              <span>in USDC</span>
            </div>
            <CampaignCard campaign={campaign} color={color} />
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
              <Line
                percent={(AmountRaised / AmountToRaise) * 100}
                strokeWidth={4}
                strokeColor={color}
                trailWidth={4}
                trailColor="white"
              />
              <p className="pt-2">{`$${AmountRaised} / $${AmountToRaise} Raised`}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
