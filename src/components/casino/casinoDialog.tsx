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

interface Props {
  Title: String;
  Description: String;
  Location: String;
  AmountRaised: number;
  AmountToRaise: number;
}

export function CasinoDialog({
  Title,
  Description,
  Location,
  AmountRaised,
  AmountToRaise,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#0D0D0D] px-10 focus:bg-black">Donate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[705px] py-8 max-w-full border-2 border-[#00F2FF] bg-black font-spaceMono mr-4">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col md:flex-row justify-start items-center gap-7">
              <p className="font-avenir underline text-3xl">{Title}</p>
              <Button className="bg-black border-2 border-[#00FF1A] mt-2 md:mt-0">
                Open
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-14 font-spaceMono">
          <div className="flex-1">
            <p className="mb-10">{Description}</p>
            <p>{`Amount to contribute: `}</p>
            <div className="flex flex-row items-center gap-2">
              <Input
                className="max-w-[150px] text-center"
                value={1000}
                disabled
              />
              <span>in USDC</span>
            </div>
            <Button className="border-2 mt-5 border-[#00EAFF] w-full">
              Fund
            </Button>
          </div>
          <div className="border-2 border-[#00F2FF] flex flex-col gap-4 min-w-[300px] p-3">
            <p className="underline font-bold">Details</p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
              <span className="font-light">{`${Location}`}</span>
            </p>
            <div className="mt-auto pt-auto">
              <Line
                percent={(AmountRaised / AmountToRaise) * 100}
                strokeWidth={4}
                strokeColor="#00F2FF"
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
