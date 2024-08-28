"use client";

import React from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CasinoDialog } from "./casinoDialog";

const data = [
  {
    title: "Zuvillage Georgia",
    location: "Kachreti, Georgia",
    content: `ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`,
    pricePerTicket: 0.005,
    prizePool: 0.02,
    status: true,
    description:
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum",
  },
  {
    title: "ZuBerlin",
    location: "Berlin, Germany",
    content: `ZuVillage Georgia - a popup where you can expand your individual cognitive sovereignty while collectively exploring and building frontier tech guided by cypherpunk and d/acc philosophies.`,
    pricePerTicket: 0.01,
    prizePool: 0.05,
    status: false,
    description:
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsumLorem ipsum",
  },
];

const colors = ["#00F2FF", "#7958FF", "#FF00FF"];

const CasinoFunding = () => {
  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <p className="text-4xl font-a font-avenir">{`casino`}</p>
        <p className="font-spaceMono">{`Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum`}</p>
      </div>
      <div className="flex md:flex-row flex-col gap-10">
        {data.map((item, index) => (
          <div
            className="border-2 w-full max-w-md h-auto p-6 md:p-10 font-avenir"
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
