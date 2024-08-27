import { useEffect, useState, useCallback } from "react";
import { useSDK, useContract, useAddress, useConnectionStatus, useNetwork } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";

import ERC20ABI from '@abis/ERC20.json';
import CampaignERC20V1ContractABI from '@abis/Fora_ERC20Campaign.json';
import CampaignFactoryV1ContractABI from '@abis/Fora_CampaignFactory.json';

export interface Campaign {
  name: string;
  threshold: string;
  address: string;
  chainId: string;
  deadline: string;
  token: string;
}

const SUPPORTED_CHAIN_IDS = ['8453', '1', '534352', '10'] as const;

const getFactoryContract = (chainId: string) => {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId as any)) return '';
  const contracts: Record<string, string> = {
    '8453': "0x",
    '534352': "0x",
    '10': "0x",
    '1': "0x"
  };
  return contracts[chainId] || "0x";
}

const getChainName = (chainId: string) => {
  const names: Record<string, string> = {
    '8453': "Base",
    '534352': "Scroll",
    '10': "Optimism",
    '1': "Ethereum Mainnet"
  };
  return names[chainId] || "Ethereum Mainnet";
}

export default function useEthereum() {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const sdk = useSDK();
  const { chain } = useNetwork();

  const ensureCampaignNetworkConnection = useCallback(async (campaignChainId: string) => {
    if (!chain) throw new Error("Not connected to any network");
    if (!SUPPORTED_CHAIN_IDS.includes(chain.chainId as any)) {
      throw new Error(`Please switch to the ${getChainName(campaignChainId)} network in your wallet.`);
    }
    return chain.chainId;
  }, [chain]);

  const getCurrencyTokenDecimals = useCallback(async (chainId: string, token: string) => {
    if (!SUPPORTED_CHAIN_IDS.includes(chainId as any)) return 0;
    const contract = await sdk?.getContract(token);
    return await contract?.erc20.decimals();
  }, [sdk]);

  const launch = useCallback(async (campaign: Campaign): Promise<void> => {
    try {
      const chainId = await ensureCampaignNetworkConnection(campaign.chainId);
      const campaignFactoryV1ContractAddress = getFactoryContract(chainId.toString());
      const campaignFactory = await sdk?.getContract(campaignFactoryV1ContractAddress, CampaignFactoryV1ContractABI);

      if (!campaign.token || !campaign.threshold || !campaign.deadline) {
        throw new Error("Campaign is missing required settings");
      }

      if (new Date(campaign.deadline) < new Date()) {
        throw new Error("Campaign deadline must be in the future");
      }

      const tokenDecimals = await getCurrencyTokenDecimals(campaign.chainId, campaign.token);
      const threshold = parseFloat(campaign.threshold) * (10 ** (tokenDecimals || 18));
      const deadline = Math.floor(new Date(campaign.deadline).getTime() / 1000);

      const transaction = await campaignFactory?.call("createCampaignERC20", [
        address,
        campaign.token,
        threshold,
        deadline
      ]);

      // TODO: Handle transaction result and get campaign address
    } catch (error: any) {
      console.error(error);
      throw new Error("There is a problem launching the campaign");
    }
  }, [sdk, address, ensureCampaignNetworkConnection, getCurrencyTokenDecimals]);

  const contribute = useCallback(async (amount: number, campaign: Campaign): Promise<void> => {
    try {
      await ensureCampaignNetworkConnection(campaign.chainId);

      const tokenDecimals = await getCurrencyTokenDecimals(campaign.chainId, campaign.token);
      const contributeAmount = amount * (10 ** (tokenDecimals || 18));

      const tokenContract = await sdk?.getContract(campaign.token, ERC20ABI);
      const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);

      const allowance = await tokenContract?.erc20.allowance(address!, campaign.address);

      if (allowance?.lt(contributeAmount)) {
        await tokenContract?.erc20.setAllowance(campaign.address, contributeAmount);
      }

      const transaction = await campaignContract?.call("submitContribution", [contributeAmount]);

      // TODO: Handle transaction result
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }, [sdk, address, ensureCampaignNetworkConnection, getCurrencyTokenDecimals]);

  const withdrawContribution = useCallback(async (campaign: Campaign): Promise<void> => {
    try {
      await ensureCampaignNetworkConnection(campaign.chainId);
      const amount = 0; // TODO: Implement getUserOrWalletCampaignContribution
      const tokenDecimals = await getCurrencyTokenDecimals(campaign.chainId, campaign.token);
      const contributeAmount = amount * (10 ** (tokenDecimals || 18));

      const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);
      const transaction = await campaignContract?.call("withdrawContribution", [contributeAmount]);

      // TODO: Handle transaction result
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }, [sdk, ensureCampaignNetworkConnection, getCurrencyTokenDecimals]);

  const isCampaignCompleted = useCallback(async (campaign: Campaign) => {
    const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);
    return await campaignContract?.call("isCampaignCompleted");
  }, [sdk]);

  const isCampaignDeadlineExceeded = useCallback(async (campaign: Campaign) => {
    const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);
    return await campaignContract?.call("isContributionDeadlineExceeded");
  }, [sdk]);

  const getTotalContributions = useCallback(async (campaign: Campaign) => {
    const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);
    const totalContributions = await campaignContract?.call("totalContributions");
    const tokenDecimals = await getCurrencyTokenDecimals(campaign.chainId, campaign.token);
    return parseFloat(totalContributions.toString()) / (10 ** (tokenDecimals || 18));
  }, [sdk, getCurrencyTokenDecimals]);

  const getContributionTransferred = useCallback(async (campaign: Campaign) => {
    const campaignContract = await sdk?.getContract(campaign.address, CampaignERC20V1ContractABI);
    const contributionTransferred = await campaignContract?.call("contributionTransferred");
    const tokenDecimals = await getCurrencyTokenDecimals(campaign.chainId, campaign.token);
    return parseFloat(contributionTransferred.toString()) / (10 ** (tokenDecimals || 18));
  }, [sdk, getCurrencyTokenDecimals]);

  return {
    launch,
    contribute,
    withdrawContribution,
    getTotalContributions,
    getContributionTransferred,
    isCampaignCompleted,
    isCampaignDeadlineExceeded
  };
}