"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Slider } from "../ui/slider";
import { DialogComponent } from "./dialogComponent";
import { Line } from "rc-progress";
import { Campaign } from "@/lib/fora"; // Assuming the hook is in this file
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { base } from "thirdweb/chains";
import CrowdFundingData from "./CrowdFundingData";

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

const data1 = [
  {
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
    status: true,
  },
];

const colors = ["#00F2FF", "#7958FF", "#FF00FF"];

const CrowdFundComponent = () => {
  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <p className="text-4xl font-a font-avenir">{`crowdfunding campaigns`}</p>
          <p className="text-[#7958FF] text-2xl font-spaceMono bg-[rgba(91,91,91,0.5)] px-4 py-1 rounded">
            powered by fora
          </p>
        </div>
        <p className="font-spaceMono">{`Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum`}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        {data1.map((item, index) => (
          <CrowdFundingData
            item={item}
            // index={index}
            color={"00F2FF"}
          />
        ))}
      </div>
    </div>
  );
};

export default CrowdFundComponent;
