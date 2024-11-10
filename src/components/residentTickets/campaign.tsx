"use client";

import React, { useState, useEffect, Dispatch } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import useFora, { Campaign } from "@/lib/fora"; // Assuming the hook is in this file
import { ConnectButton } from "thirdweb/react";
import WalletConnect from "@/components/WalletConnect";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { useWalletBalance } from "thirdweb/react";
import { useWalletBalance } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { getTotalContributed, useUnlockProtocol } from "@/lib/unlock";
import { CampaignStatus } from "@/lib/types";

const tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC token address on Base

// Define the structure of our campaign data

// Define the structure of our campaigns object
interface Campaigns {
  [key: string]: Campaign;
}

export const CampaignCard: React.FC<{
  campaign: Campaign;
  color: string;
  setHasUsdc: Dispatch<boolean>;
}> = ({ campaign, color, setHasUsdc }) => {
  const account = useActiveAccount();

  const {
    data: useUsdcBalance,
    isLoading,
    isError,
  } = useWalletBalance({
    chain: base,
    address: account?.address,
    client,
    tokenAddress,
  });
  console.log("balance", useUsdcBalance?.displayValue, useUsdcBalance?.symbol);
  console.log("active account", account);

  const {
    getCampaignStatus,
    getTotalContributed,
    getCampaignProgress,
    purchase,
  } = useUnlockProtocol();

  const [status, setStatus] = useState<CampaignStatus>(
    "active"
  );
  const [contributions, setContributions] = useState("");
  const [progress, setProgress] = useState(0);
  const [canContribute, setCanContribute] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      console.log('total contributed', await getTotalContributed(campaign.address));
      
      setContributions((await getTotalContributed(campaign.address)).toString());
      setStatus(await getCampaignStatus(campaign.address));
      // setStatus(await getCampaignStatus(campaign));
      setProgress(await getCampaignProgress(campaign.address));
      setCanContribute(true); // no ACL atm like on fora
    };
    fetchData();
  }, [
    campaign,
    getCampaignStatus,
    getTotalContributed,
    getCampaignProgress,
  ]);

  console.log("Campaign Card", canContribute);
  const handleReserve = async () => {
    if (useUsdcBalance?.displayValue! < "1") {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description:
          "You don't have enough USDC on base to complete this transaction. Please add more USDC and try again.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setHasUsdc(false);
    }
    console.log("erihaa");
    setLoading(true);
    if (canContribute) {
      try {
        const tx = await purchase(campaign.address);
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

  return (
    <div>
      {account ? (
        <button
          onClick={handleReserve}
          disabled={!canContribute || loading}
          className="border-2 mt-5 w-full py-2 flex justify-center items-center disabled:cursor-not-allowed"
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
