"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import useFora, { Campaign } from "@/lib/fora"; // Assuming the hook is in this file
import { ConnectButton } from "thirdweb/react";
import WalletConnect from "@/components/WalletConnect";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
// Define the structure of our campaign data

// Define the structure of our campaigns object
interface Campaigns {
  [key: string]: Campaign;
}

export const CampaignCard: React.FC<{ campaign: Campaign; color: string }> = ({
  campaign,
  color,
}) => {
  const {
    getCampaignStatus,
    getFormattedContributions,
    getRemainingTime,
    getProgressPercentage,
    canUserContribute,
    contribute,
  } = useFora();

  const [status, setStatus] = useState<"active" | "completed" | "expired">(
    "active"
  );
  const [contributions, setContributions] = useState("");
  const [progress, setProgress] = useState(0);
  const [canContribute, setCanContribute] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatus(await getCampaignStatus(campaign));
      setContributions(await getFormattedContributions(campaign));
      setProgress(await getProgressPercentage(campaign));
      setCanContribute(await canUserContribute(campaign));
      setProgress(await getProgressPercentage(campaign));
      setCanContribute(await canUserContribute(campaign));
    };
    fetchData();
  }, [
    campaign,
    getCampaignStatus,
    getFormattedContributions,
    getProgressPercentage,
    canUserContribute,
  ]);

  console.log("Campaign Card", canContribute);
  const handleReserve = async () => {
    if (canContribute) {
      try {
        await contribute(campaign, Number(campaign.threshold) / 100);
        // await contribute(campaign, 0);
        // alert('Reservation successful!');
      } catch (error) {
        console.error("Reservation failed:", error);
        // alert('Reservation failed. Please try again.');
      }
    }
  };

  const activeAccount = useActiveAccount();

  return (
    <div
    // key={campaign.name}
    >
      {/* <h3>{campaign.name}</h3>
      <p>{campaign.description}</p>
      <p>Status: {status}</p>
      <p>Location: {campaign.location}</p>
      <p>Time Remaining: {getRemainingTime(campaign)}</p>
      {/* TODO sliding scale with % */}
      {/* <p>
        Progress: {contributions} ({progress.toFixed(2)}%)
      </p> */}
      {activeAccount ? (
        <button
          onClick={handleReserve}
          disabled={!canContribute}
          className="border-2 mt-5 border-[#00EAFF] w-full py-2"
          style={{ borderColor: color }}
        >
          {canContribute ? "Reserve" : "Already Contributed"}
        </button>
      ) : (
        <div className="mt-5 w-full">
          <WalletConnect />
        </div>
      )}

      {/* <a href={campaign.details} target="_blank" rel="noopener noreferrer">
        See Details
      </a> */}
    </div>
  );
};

export default CampaignCard;
