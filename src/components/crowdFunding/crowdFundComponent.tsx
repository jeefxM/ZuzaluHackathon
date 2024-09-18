"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import CrowdFundingData from "./CrowdFundingData";
import campaignData from "../../../public/campaigns.json";

const colors = ["#7958FF", "#00F2FF", "#FF00FF"];

const CrowdFundComponent = () => {
  const { data } = campaignData;
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const uniqueCountries = Array.from(
    new Set(data.map((item) => item.location))
  );

  const filteredData = selectedCountry
    ? data.filter((item) => item.location === selectedCountry)
    : data;
  return (
    <div className="p-16 flex flex-col gap-10">
      <div className="mt f font-medium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <p className="text-4xl font-a font-avenir">{`crowdfunding campaigns`}</p>
          <p className="text-[#7958FF] .text-animation text-2xl font-spaceMono bg-[rgba(91,91,91,0.5)] px-4 py-1 rounded">
            powered by fora
          </p>
        </div>
        <p className="font-spaceMono  w-3/4">
          {" "}
          {`Crowdfunding campaigns provide contributors with the opportunity to attend a popup village while organizers receive thier first funds. If the threshold isn't reached in time the funds are returned to the contributors.`}
        </p>
      </div>
      <div className="flex flex-col max-md:flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-spaceMono">Filter by Country:</p>
          <div className="flex flex-wrap gap-2">
            {uniqueCountries.map((country) => (
              <Button
                key={country}
                className={`${
                  selectedCountry === country ? "bg-blue-500" : "bg-gray-500"
                } text-white px-4 py-2 rounded hover:bg-gray-400`}
                onClick={() => setSelectedCountry(country)}
              >
                {country}
              </Button>
            ))}
            <Button
              className={`${
                selectedCountry === null ? "bg-blue-500" : "bg-gray-500"
              } text-white px-4 py-2 rounded hover:bg-gray-400`}
              onClick={() => setSelectedCountry(null)}
            >
              All
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          {filteredData.map((item, index) => (
            <CrowdFundingData
              campaign={item}
              color={colors[index % colors.length]}
              key={item.address}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrowdFundComponent;
