import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Slider } from "../ui/slider";
import { DialogComponent } from "./dialogComponent";
import { Line } from "rc-progress";
import { Campaign } from "@/lib/fora"; // Assuming the hook is in this file

const data = [
  {
    title: "Zuvillage Georgia",
    location: "Kachreti, Georgia",
    content: `ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`,
    raised: 90000,
    maxParticipants: 80,
    registeredParticipants: 23,
    goal: 100000,
    status: true,
    description:
      "Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia",
  },
  {
    title: "Network School ",
    location: "Singapore",
    content: `Network states school`,
    raised: 40000,
    maxParticipants: 80,
    registeredParticipants: 40,
    goal: 100000,
    status: true,
    description:
      "Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia",
  },
  {
    title: "Network School ",
    location: "Singapore",
    content: `Network states school`,
    raised: 40000,
    maxParticipants: 80,
    registeredParticipants: 40,
    goal: 100000,
    status: false,
    description:
      "Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia Zuvillage Georgia",
  },
];

const colors = ["#00F2FF", "#7958FF", "#FF00FF"];

const CrowdFundComponent = () => {
  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <p className="text-4xl font-a font-avenir">{`crowdfunding campaigns`}</p>
        <p className="font-spaceMono">{`Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum`}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        {data.map((item, index) => (
          <div
            className="border-2  w-full max-w-md h-auto p-6 md:p-10 font-avenir"
            style={{
              backgroundColor: "rgba(25, 25, 25, 0.2)",
              borderColor: colors[index % colors.length],
            }} // 75% opacity
            key={item.title}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <p className="text-2xl md:text-3xl underline">{item.title}</p>
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
              <p className="min-h-[100px]">{item.description}</p>
              <p>{`${item.registeredParticipants}/${item.maxParticipants} registered`}</p>
              <div>
                <Line
                  percent={(item.raised / item.goal) * 100}
                  strokeWidth={4}
                  strokeColor={colors[index % colors.length]}
                  trailWidth={4}
                  trailColor="white"
                />
                <p className="pt-2">{`$${item.raised} / $${item.goal} Raised`}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-4 ">
                <DialogComponent
                  Title={item.title}
                  Description={item.content}
                  Location={item.location}
                  AmountRaised={item.raised}
                  AmountToRaise={item.goal}
                  status={item.status}
                  color={colors[index % colors.length]}
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

export default CrowdFundComponent;
