"use client";

import CasinoFunding from "@/components/casino/casinoFunding";
import CrowdFundComponent from "@/components/crowdFunding/crowdFundComponent";
import Header from "@/components/header";
import { useState } from "react";

const AppPage = () => {
  const [selectedPage, setSelectedPage] = useState("crowdFunding");
  return (
    <div className="">
      <Header selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div
        className="h h-screen w-screen"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url("/image.png")',
          backgroundSize: "cover", // Ensure the background image covers the entire screen
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {selectedPage === "crowdFunding" ? (
          <CrowdFundComponent />
        ) : (
          <CasinoFunding />
        )}
      </div>
    </div>
  );
};

export default AppPage;
