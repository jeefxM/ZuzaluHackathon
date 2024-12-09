import { useEffect, useState, useCallback } from "react";
import { client as web3 } from "@/app/client";

// import { useSDK, useContract, useAddress, useConnectionStatus, useNetwork } from "@thirdweb-/react";

import { useActiveWallet, useSendTransaction } from "thirdweb/react";
import {
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { ethereum } from "thirdweb/chains";

import ERC20ABI from "@/abis/ERC20";
import CampaignERC20V1ContractABI from "@abis/Fora_ERC20Campaign.json";
import CampaignFactoryV1ContractABI from "@abis/Fora_CampaignFactory.json";
import { Wallet } from "thirdweb/wallets";
import { ResidentTicketSale } from "./types";


type Organizers = { [name: string]: string };

const SUPPORTED_CHAIN_IDS = ["8453", "1", "534352", "10"] as const;

const getFactoryAddress = (chainId: string) => {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as any)) return "";
  const contracts: Record<string, string> = {
    "8453": "0x23f77A0480b6ee9dE5f76a1DcA26290C228A29c9",
    "534352": "0x",
    "10": "0x",
    "1": "0x",
  };
  return contracts[chainId] || "0x";
};

const getCampaignContract = (chainId: number, address: string) => {
  return getContract({
    client: web3,
    address,
    chain: defineChain({ id: Number(chainId) }),
    // abi: ResidentTicketSaleERC20V1ContractABI,
  });
};

const getChainName = (chainId: string) => {
  const names: Record<string, string> = {
    "8453": "Base",
    "534352": "Scroll",
    "10": "Optimism",
    "1": "Ethereum Mainnet",
  };
  return names[chainId] || "Ethereum Mainnet";
};

// TBH almost all of this can be extracted to non-react lib.
export default function useFora() {
  const wallet = useActiveWallet();
  const address = wallet?.getAccount()?.address;
  console.log("Fora:address", address);
  //   const { chain } = useNetwork();
  const { mutate: sendTransaction } = useSendTransaction();

  //   const ensureCampaignNetworkConnection = useCallback(async (campaignChainId: string) => {
  //     if (!chain) throw new Error("Not connected to any network");
  //     if (!SUPPORTED_CHAIN_IDS.includes(chain.chainId as any)) {
  //       throw new Error(`Please switch to the ${getChainName(campaignChainId)} network in your wallet.`);
  //     }
  //     return chain.chainId;
  //   }, [chain]);

  // const getTokenDecomals = useCallback(async (chainId: string, token: string) => {
  //     if (!SUPPORTED_CHAIN_IDS.includes(chainId as any)) return 0;
  //     const contract = await sdk?.getContract({ chain: chainId, address: token, abi: ERC20ABI });
  //     return await contract?.decimals();
  // }, [getContract]);

  const contribute = useCallback(
    async (campaign: ResidentTicketSale, amount: number): Promise<string> => {
      if (!address) return "No Active Wallet";
      try {
        const contributeAmount =
          BigInt(amount) * BigInt(10 ** (campaign.tokenDecimals || 18));

        const erc20 = getContract({
          client: web3,
          chain: defineChain(Number(campaign.chainId)),
          address: campaign.token,
        });

        console.log(
          "Fora: :readContract",
          "allowance",
          address,
          campaign.address
        );

        const balance = await readContract({
          contract: erc20,
          method: "function balanceOf(address owner) view returns (uint256)",
          params: [address],
        });

        if (balance < amount) {
          return "Insufficient Balance";
        }

        console.log("Fora: :readContract", "balance", campaign.token, balance);
        const allowance = await readContract({
          contract: erc20,
          method:
            "function allowance(address owner, address spender) view returns (uint256)",
          params: [address, campaign.address],
        });

        console.log(
          "Fora:contribute:allowance()",
          allowance,
          allowance < contributeAmount
        );

        if (allowance < contributeAmount) {
          const allowanceTx = prepareContractCall({
            contract: erc20,
            method: "function approve(address spender, uint256 amount)",
            params: [campaign.address, contributeAmount],
          });

          console.log("Fora:contribute:approve()");
          sendTransaction(allowanceTx);
          console.log("Fora:contribute:approve2()");
        }

        const transaction = prepareContractCall({
          contract: getCampaignContract(campaign.chainId, campaign.address),
          method:
            "function submitContribution(uint256 submissionAmount_) returns(uint256)",
          params: [contributeAmount],
        });
        console.log("Fora:contribute:submit()", contributeAmount);

        const tx = await sendTransaction(transaction);

        console.log("Fora:contribute:submit2()", tx);
        return "Success";

        // TODO: Handle transaction result
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },
    [address, getCampaignContract, prepareContractCall, sendTransaction]
  );

  const withdrawContribution = useCallback(
    async (campaign: ResidentTicketSale): Promise<void> => {
      try {
        const amount = 0; // TODO: Implement getUserOrWalletCampaignContribution
        const contributeAmount = BigInt(
          amount * 10 ** (campaign.tokenDecimals || 18)
        );

        const transaction = prepareContractCall({
          contract: getCampaignContract(campaign.chainId, campaign.address),
          method: "function withdrawContribution(uint256 submissionAmount_)",
          params: [contributeAmount],
        });
        sendTransaction(transaction);

        // TODO: Handle transaction result
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },
    [getCampaignContract, prepareContractCall, sendTransaction]
  );

  const launch = useCallback(
    async (campaign: ResidentTicketSale): Promise<void> => {
      try {
        //   const campaignFactoryV1ContractAddress = getFactoryAddress(chainId.toString());
        //   const campaignFactory = await sdk?.getContract(campaignFactoryV1ContractAddress, CampaignFactoryV1ContractABI);
        //   if (!campaign.token || !campaign.threshold || !campaign.deadline) {
        //     throw new Error("Campaign is missing required settings");
        //   }
        //   if (new Date(campaign.deadline) < new Date()) {
        //     throw new Error("Campaign deadline must be in the future");
        //   }
        //   const threshold = parseFloat(campaign.threshold) * (10 ** (campaign.tokenDecimals || 18));
        //   const deadline = Math.floor(new Date(campaign.deadline).getTime() / 1000);
        //   const transaction = await campaignFactory?.call("createCampaignERC20", [
        //     address,
        //     campaign.token,
        //     threshold,
        //     deadline
        //   ]);
        //   // TODO: Handle transaction result and get campaign address
      } catch (error: any) {
        console.error(error);
        throw new Error("There is a problem launching the campaign");
      }
    },
    [getContract, getFactoryAddress]
  );

  const isCampaignCompleted = useCallback(
    async (campaign: ResidentTicketSale) => {
      console.log("Fora: :readContract", "isCampaignCompleted");
      return await readContract({
        contract: getCampaignContract(campaign.chainId, campaign.address),
        method: "function isCampaignCompleted() view returns(bool)",
      });
    },
    [getCampaignContract, readContract]
  );

  const isCampaignDeadlineExceeded = useCallback(
    async (campaign: ResidentTicketSale) => {
      console.log("Fora: :readContract", "isContributionDeadlineExceeded");
      return await readContract({
        contract: getCampaignContract(campaign.chainId, campaign.address),
        method: "function isContributionDeadlineExceeded() view returns(bool)",
      });
    },
    [getCampaignContract, readContract]
  );

  const getTotalContributions = useCallback(async (campaign: ResidentTicketSale) => {
    console.log("Fora: :readContract", "totalContributions");
    const totalContributions = await readContract({
      contract: getCampaignContract(campaign.chainId, campaign.address),
      method: "function totalContributions() view returns(uint256)",
    });
    return (
      parseFloat(totalContributions.toString()) /
      10 ** (campaign.tokenDecimals || 18)
    );
  }, []);

  const getContributionTransferred = useCallback(async (campaign: ResidentTicketSale) => {
    console.log("Fora: :readContract", "contributionTransferred");
    const contributionTransferred = await readContract({
      contract: getCampaignContract(campaign.chainId, campaign.address),
      method: "function contributionTransferred() view returns(uint256)",
    });
    return (
      parseFloat(contributionTransferred.toString()) /
      10 ** (campaign.tokenDecimals || 18)
    );
  }, []);

  const getCampaignStatus = useCallback(
    async (campaign: ResidentTicketSale): Promise<"active" | "completed" | "expired"> => {
      const isCompleted = await isCampaignCompleted(campaign);
      if (isCompleted) return "completed";

      const isExpired = await isCampaignDeadlineExceeded(campaign);
      return isExpired ? "expired" : "active";
    },
    [isCampaignCompleted, isCampaignDeadlineExceeded]
  );

  const getFormattedContributions = useCallback(
    async (campaign: ResidentTicketSale): Promise<string> => {
      const totalContributions = await getTotalContributions(campaign);
      return `${totalContributions.toFixed(2)} ${campaign.tokenSymbol} / ${
        campaign.threshold
      } ${campaign.tokenSymbol} `;
    },
    [getTotalContributions]
  );

  const getRemainingTime = useCallback((campaign: ResidentTicketSale): string => {
    const now = Date.now();
    const deadline = new Date(campaign.deadline).getTime();
    const remaining = deadline - now;

    if (remaining <= 0) return "Expired";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    return `${days}d ${hours}h`;
  }, []);

  const getUserContribution = useCallback(
    async (campaign: ResidentTicketSale): Promise<number> => {
      if (!address) return 0;
      console.log("Fora: :readContract", "totalContributions");
      const contribution = await readContract({
        contract: getCampaignContract(campaign.chainId, campaign.address),
        method: "function totalContributions() view returns(uint256)",
      });
      return (
        parseFloat(contribution.toString()) /
        10 ** (campaign.tokenDecimals || 18)
      );
    },
    [readContract, getCampaignContract]
  );

  const canUserContribute = useCallback(
    async (campaign: ResidentTicketSale): Promise<boolean> => {
      if (!campaign.address) return false; // TODO address and debug why its undefined
      const status = await getCampaignStatus(campaign);
      if (status !== "active") return false;
      const userContribution = await getUserContribution(campaign);
      return userContribution === 0;
    },
    [address, getCampaignStatus, getUserContribution]
  );

  const getProgressPercentage = useCallback(
    async (campaign: ResidentTicketSale): Promise<number> => {
      const totalContributions = await getTotalContributions(campaign);
      const threshold = parseFloat(campaign.threshold);
      return (totalContributions / threshold) * 100;
    },
    [getTotalContributions]
  );

  return {
    launch,
    contribute,
    withdrawContribution,
    getTotalContributions,
    getContributionTransferred,
    isCampaignCompleted,
    isCampaignDeadlineExceeded,
    getCampaignStatus,
    getFormattedContributions,
    getRemainingTime,
    getUserContribution,
    canUserContribute,
    getProgressPercentage,
  };
}
