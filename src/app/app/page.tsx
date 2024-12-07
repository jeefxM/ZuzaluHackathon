"use client";

import CasinoFunding from "@/components/casino/casinoFunding";
import CrowdFundComponent from "@/components/crowdFunding/crowdFundComponent";
import ResidentTicketsComponent from "@/components/residentTickets/crowdFundComponent";

import Header from "@/components/header";
import { useState } from "react";

const AppPage = () => {
  const [selectedPage, setSelectedPage] = useState("lottery");

  const getFundingComponent = (selectedPage: string) => {
    switch (selectedPage) {
      case "crowdfunding":
        return CrowdFundComponent;
      case "resident-tickets":
        return CrowdFundComponent;
      case "lottery":
        return CasinoFunding;
      case "resident-tickets":
      default:
        return CrowdFundComponent;
    }
  };
  const FundingMechanism = getFundingComponent(selectedPage);

  return (
    <div className="">
      <Header selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div
        className="min-h-[70vh] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url("/image.png")',
          backgroundSize: "cover", // Ensure the background image covers the entire screen
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <FundingMechanism />
      </div>
    </div>
  );
};

export default AppPage;
