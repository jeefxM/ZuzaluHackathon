"use client";

import React from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Slider } from "../ui/slider";
import { CasinoDialog } from "./casinoDialog";
import { Line } from "rc-progress";

const data = {
  title: "Zuvillage Georgia",
  location: "Kachreti, Georgia",
  content: `ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`,
  raised: 50000,
  maxParticipants: 100,
  registeredParticipants: 29,
  goal: 60000,
  status: "Open",
  description:
    "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum",
};

const CasinoFunding = () => {
  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <p className="text-4xl font-a font-avenir">{`crowdfunding campaigns`}</p>
        <p className="font-spaceMono">{`Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum`}</p>
      </div>
      <div className="flex ">
        <div
          className="border-2 border-[#00F2FF] w-full max-w-md h-auto p-6 md:p-10 font-avenir"
          style={{ backgroundColor: "rgba(25, 25, 25, 0.2)" }} // 75% opacity
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-2xl md:text-3xl underline">{data.title}</p>
            <Button className="bg-black border-2 border-[#00FF1A] mt-2 md:mt-0">
              Open
            </Button>
          </div>
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
            <p>{data.location}</p>
          </div>
          <div className="font-spaceMono flex flex-col gap-6">
            <p>{data.description}</p>
            <p>{`${data.registeredParticipants}/${data.maxParticipants} registered`}</p>
            <div>
              <Line
                percent={(data.raised / data.goal) * 100}
                strokeWidth={4}
                strokeColor="#00F2FF"
                trailWidth={4}
                trailColor="white"
              />
              <p className="pt-2">{`$${data.raised} / ${data.goal} Raised`}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 ">
              <CasinoDialog
                Title={"Zuvillage Georgia"}
                Description={`ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`}
                Location={`Kachreti, Georgia`}
                AmountRaised={data.raised}
                AmountToRaise={data.goal}
              />

              <Button className="bg-[#0D0D0D] px-10 focus:bg-black">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoFunding;
