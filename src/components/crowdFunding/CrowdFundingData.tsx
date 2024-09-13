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

interface Campaign {
  chainId: string;
  address: string;
  name: string;
  description: string;
  organizers: { [key: string]: string };
  threshold: number;
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

  const { data: totalContribution, isLoading } = useReadContract({
    contract,
    method: `function contributionTransferred() view returns (uint256)`,
  });
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
        <FaMapMarkerAlt className="mr-2" />{" "}
        {/* Location icon *}
        <p>{campaign.location}</p>
      </div>
      <div className="font-spaceMono flex flex-col gap-6">
        <p className="min-h-[100px]">{campaign.description}</p>
        {/* <p>{`${campaign.registeredParticipants}/50 registered`}</p> */}
        <div>
          {isLoading ? (
            <div>
              <Skeleton className="h-[20px] w-full" />
              <Skeleton className="h-[20px] w-[200px]" />
            </div>
          ) : (
            <div>
              <Line
                percent={
                  (Number(totalContribution) /
                    Math.pow(10, campaign.tokenDecimals) /
                    campaign.threshold) *
                  100
                }
                strokeWidth={4}
                strokeColor={color}
                trailWidth={4}
                trailColor="white"
              />
              <p className="pt-2">{`$${totalContribution} / $${campaign.threshold} Raised`}</p>
            </div>
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
          />

          <Button className="bg-[#0D0D0D] px-10 focus:bg-black">Share</Button>
        </div>
      </div>
    </div>
  );
};

export default CrowdFundingData;
