import React from "react";
import { Button } from "../ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Line } from "rc-progress";
import { DialogComponent } from "./dialogComponent";
import { getContract } from "thirdweb";
import { client } from "@/app/client";
import { base } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

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
  item: Campaign;
  color: string;
  contractAddress: string;
}

const CrowdFundingData = ({ item, color }: Props) => {
  const contract = getContract({
    client,
    chain: base, // Ensure 'base' is correctly defined and imported
    address: "0x0a2503a423deEF425a71d0e2dd4Ff44244E81c75",
  });

  const { data: totalContribution, isLoading } = useReadContract({
    contract,
    method: `function contributionTransferred() view returns (uint256)`,
  });
  console.log(
    "checkThreshold",
    Number(totalContribution) / Math.pow(10, item.tokenDecimals)
  );
  return (
    <div
      className="border-2  w-full max-w-md h-auto p-6 md:p-10 font-avenir"
      style={{
        backgroundColor: "rgba(25, 25, 25, 0.2)",
        borderColor: color,
      }} // 75% opacity
      key={item.name}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <p className="text-2xl md:text-3xl underline">{item.name}</p>
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
        {/* <p>{`${item.registeredParticipants}/50 registered`}</p> */}
        <div>
          {/* <Line
            percent={(item.raised / item.goal) * 100}
            strokeWidth={4}
            strokeColor={color}
            trailWidth={4}
            trailColor="white"
          /> */}
          <p className="pt-2">{`$${totalContribution} / $${item.threshold} Raised`}</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 ">
          <DialogComponent
            Title={item.name}
            Description={item.description}
            Location={item.location}
            AmountRaised={
              Number(totalContribution) / Math.pow(10, item.tokenDecimals)
            }
            AmountToRaise={item.threshold}
            status={item.status}
            color={color}
          />

          <Button className="bg-[#0D0D0D] px-10 focus:bg-black">Share</Button>
        </div>
      </div>
    </div>
  );
};

export default CrowdFundingData;
