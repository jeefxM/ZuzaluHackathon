import React from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Line } from "rc-progress";
import { DialogComponent } from "./dialogComponent";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { base } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { Skeleton } from "../ui/skeleton";
import { formatEther } from "viem";

interface Campaign {
  chainId: string;
  address: string;
  name: string;
  description: string;
  organizers: { [key: string]: string };
  threshold: string;
  location: string;
  details: string;
  deadline: string;
  token: string;
  tokenDecimals: number;
  tokenSymbol: string;
  status: boolean;
}

interface Props {
  campaign: Campaign;
  color: string;
}

const CrowdFundingData = ({ campaign, color }: Props) => {
  const contract = getContract({
    client,
    chain: base, // Ensure 'base' is correctly defined and imported
    address: campaign.address,
  });

  const cowSwapWidgetParams: any = {
    appCode: "NAME-OF-YOU-APP", // Add here the name of your app. e.g. "Pig Swap"
    width: "600px",
    height: "700px",
    tradeType: "swap",
  };

  const { data: totalContribution, isLoading: loadingContribution } =
    useReadContract({
      contract,
      method: `function totalContributions() view returns (uint256)`,
    });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  console.log(
    "checkThreshold",
    Number(totalContribution) / Math.pow(10, campaign.tokenDecimals)
  );
  return (
    <div
      className="border-2  w-full max-w-md h-auto p-6 md:p-10 font-avenir"
      style={{
        backgroundColor: "rgba(25, 25, 25, 0.2)",
        borderColor: color,
      }} // 75% opacity
      key={campaign.name}
    >
      <div className="flex flex-col md:flex-row justify-between campaigns-center mb-4">
        <p className="text-2xl md:text-3xl underline">{campaign.name}</p>
        {campaign.status ? (
          <Button className="bg-black border-2 text-[#00FF1A] border-[#00FF1A] mt-2 md:mt-0">
            Open
          </Button>
        ) : (
          <Button className="bg-black border-2 text-[#FF006B] border-[#FF006B] mt-2 md:mt-0">
            Closed
          </Button>
        )}
      </div>
      <div className="flex campaigns-center mb-4">
        <FaMapMarkerAlt className="mr-2" /> {/* Location icon */}
        <p>{campaign.location}</p>
      </div>
      <div className="font-spaceMono flex flex-col gap-6">
        <p className="min-h-[150px] max-h-[200px]">
          {truncateText(
            campaign.description,
            200 // Adjust the max length as needed
          )}
        </p>
        {!loadingContribution && (
          <div className="flex gap-4 mb-4">
            <div className="flex items-center mb-4">
              <div className="relative flex-shrink-0">
                <div
                  className="absolute top-0 left-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#476FFA", zIndex: 3 }}
                ></div>
                <div
                  className="absolute top-0 left-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#FA9898", zIndex: 2 }}
                ></div>
                <div
                  className="absolute top-0 left-4 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#5DCE68", zIndex: 1 }}
                ></div>
              </div>
            </div>

            <p className="ml-6 flex">
              {Math.floor(
                Number(totalContribution) /
                  Math.pow(10, campaign.tokenDecimals) /
                  (parseInt(campaign.threshold) / 100)
              )}
              <span>{`/50 registered`}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <Line
          percent={
            (Number(totalContribution) /
              Math.pow(10, campaign.tokenDecimals) /
              parseInt(campaign.threshold)) *
            100
          }
          strokeWidth={4}
          strokeColor={color}
          trailWidth={4}
          trailColor="white"
        />
        {!loadingContribution && (
          <p className="pt-2">{`$${totalContribution} / $${campaign.threshold} Raised`}</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 ">
        <DialogComponent
          key={campaign.address}
          Title={campaign.name}
          Description={campaign.description}
          Location={campaign.location}
          AmountRaised={
            Number(totalContribution) / Math.pow(10, campaign.tokenDecimals)
          }
          AmountToRaise={Number(campaign.threshold)}
          status={campaign.status}
          color={color}
          campaign={campaign}
        />

        <Button className="bg-[#0D0D0D] px-10 hover:bg-black">Share</Button>
      </div>
    </div>
  );
};

export default CrowdFundingData;
