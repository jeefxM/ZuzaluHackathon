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
import { Loader } from "lucide-react";
import { CowSwapWidget } from "@cowprotocol/widget-react";

import { ResidentTicketSale } from '@/lib/types';

interface Props {
  Title: String;
  Description: String;
  Location: String;
  AmountRaised: number;
  AmountToRaise: number;
  status: boolean;
  color: string;
  campaign: ResidentTicketSale;
}

export function DialogComponent({
  Title,
  Description,
  Location,
  AmountRaised,
  AmountToRaise,
  status,
  color,
  campaign,
}: Props) {
  const [hasUsdc, setHasUsdc] = useState<boolean>(true);

  // useEffect(() => {
  // }, [hasUsdc]);

  // const cowSwapWidgetParams: any = {
  //   appCode: "Popup Capital", // Add here the name of your app. e.g. "Pig Swap"
  //   width: "full",
  //   height: "full",
  //   tradeType: "swap",
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#0D0D0D] px-10 hover:bg-black">Pay</Button>
      </DialogTrigger>
      <DialogContent
        style={{ borderColor: color, maxHeight: "80vh" }}
        className="sm:max-w-[755px] py-8 max-w-full border-2 bg-black font-spaceMono mr-4 overflow-y-auto"
      >
        {/* {hasUsdc ? ( */}
        <div>
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
              <CampaignCard
                campaign={campaign}
                color={color}
                setHasUsdc={setHasUsdc}
              />
            </div>
            <div
              className="border-2 flex flex-col gap-4 min-w-[300px] p-3"
              style={{ borderColor: color }}
            >
              <p className="underline font-bold">Details</p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
                {/** ADD GOOGLE MAPS LOCATION LINK */}
                <span className="font-light">{`${Location}`}</span>
              </p>
              <p className="underline font-spaceMono">Contributors</p>
              <p className="p-2 text-sm">{`No Contributors yet`}</p>
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
        </div>
        {/* ) : (
          <CowSwapWidget params={cowSwapWidgetParams} />
        )} */}
      </DialogContent>
    </Dialog>
  );
}
