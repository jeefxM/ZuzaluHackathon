"use client";

import React, { useState, useEffect, Dispatch } from "react";

import { ThirdwebProvider } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import WalletConnect from "@/components/WalletConnect";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { useWalletBalance } from "thirdweb/react";
import { useWalletBalance } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { CampaignStatus, ResidentTicketSale } from "@/lib/types";
import useFora from "@/lib/fora";

export const CampaignCard: React.FC<{
  campaign: ResidentTicketSale;
  color: string;
  setHasUsdc: Dispatch<boolean>;
}> = ({ campaign, color, setHasUsdc }) => {
  const account = useActiveAccount();

  const {
    data: useUsdcBalance,
    isLoading,
    isError,
  } = useWalletBalance({
    chain: base, // todo campaign.chainId
    address: account?.address,
    client,
    tokenAddress: campaign.token,
  });
  console.log("balance", useUsdcBalance?.displayValue, useUsdcBalance?.symbol);
  console.log("active account", account);

  const {
    getCampaignStatus,
    getFormattedContributions,
    getRemainingTime,
    getProgressPercentage,
    canUserContribute,
    contribute,
  } = useFora();

  const [status, setStatus] = useState<CampaignStatus>(
    "active"
  );
  const [contributions, setContributions] = useState("");
  const [progress, setProgress] = useState(0);
  const [canContribute, setCanContribute] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setStatus(await getCampaignStatus(campaign));
      setContributions(await getFormattedContributions(campaign));
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
  useEffect(() => {
    const fetchData = async () => {
      const tx = await getCampaignStatus(campaign);
      console.log("errr", tx);
    };
    fetchData();
  }, []);

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
