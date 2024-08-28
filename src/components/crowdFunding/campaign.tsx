"use client";

import React, { useState, useEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import useFora, { Campaign } from "@/lib/fora"; // Assuming the hook is in this file
import { ConnectButton } from "thirdweb/react";
import WalletConnect from "@/components/WalletConnect";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { Loader } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    if (canContribute) {
      try {
        const tx = await contribute(campaign, Number(campaign.threshold) / 100);
        console.log("tx", tx);
        // alert('Reservation successful!');
      } catch (error) {
        console.error("Reservation failed:", error);
        // alert('Reservation failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const activeAccount = useActiveAccount();

  return (
    <div>
      {activeAccount ? (
        <button
          onClick={handleReserve}
          disabled={!canContribute || loading}
          className="border-2 mt-5 w-full py-2 flex justify-center items-center"
          style={{ borderColor: color }}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : canContribute ? (
            "Reserve"
          ) : (
            "Already Contributed"
          )}
        </button>
      ) : (
        <div className="mt-5 w-full">
          <WalletConnect />
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
