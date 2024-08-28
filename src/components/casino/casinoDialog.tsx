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

interface Props {
  Title: String;
  Description: String;
  Location: String;
  pricePerTicket: number;
  prizePool: number;
  status: boolean;
  color: string;
}

export function CasinoDialog({
  Title,
  Description,
  Location,
  pricePerTicket,
  prizePool,
  status,
  color,
}: Props) {
  const [selectedNumber, setSelectedNumber] = useState(1);

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
                max={10}
                min={1}
                defaultValue={1}
                type="number"
                disabled={!status}
                onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
              />
              <span>{` = ${selectedNumber * pricePerTicket} ETH`}</span>
            </div>
            <Button
              className="border-2 mt-5 w-full"
              disabled={status == false}
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
              <p className="pt-2">{`Price per ticket: ${pricePerTicket}`}</p>
              <p className="pt-2">{`Price pool: ${prizePool}`}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
