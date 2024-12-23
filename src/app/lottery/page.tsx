"use client";

import LotteryFunding from "@/components/lottery/lotteryFunding";

import Header from "@/components/header";
import { useState } from "react";

const AppPage = () => {
  return (
    <div className="">
      <Header />
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
        <LotteryFunding />
        {/* <LotteryFunding /> */}
      </div>
    </div>
  );
};

export default AppPage;
