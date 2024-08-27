// import { LogDescription, ethers } from "ethers";
// todo replace with thirdwef
import { useEffect, useState } from "react";

import ERC20ABI from '@abis/ERC20.json';
import CampaignERC20V1ContractABI from '@abis/Fora_ERC20Campaign.json';
import CampaignFactoryV1ContractABI from '@abis/Fora_CampaignFactory.json';

// import { getUserOrWalletCampaignContribution, launchCampaign } from "@/lib/actions";

interface Log {
  topics: string[];
  data: string;
}

export interface Campaign {
        name:               string;
        threshold:          string;
        address:            string; // campaign crowdfund escrow
        chainId:            string;
        deadline:           string;
        token:              string;
        // campaignTiers       string[]; // funding amounts for tier
  };
  

const getFactoryContract = (chainId: string ) => { 
    if(!getSupportedChainIds().includes(chainId)) return '';
    switch(chainId) {
        case '8453': return "0x"; 
        case '534352': return "0x"; 
        case '10': return "0x"; 
        case '1': 
        default:
            return "0x";
    }
}

const getUserOrWalletCampaignContribution = (campaignId: string, resident: string) => {
    // const deposit = campaigns[campaignId].address .contributions(resident)
    const deposit = 0;
    return deposit;
}

const getCurrencyTokenDecimals = (chainId: string, token: string) => {
    if(!getSupportedChainIds().includes(chainId)) return 0;
    const provider = getProviderForChain(chainId);
    // return token.decimals()
    // else call token.decimals()

}

const getSupportedChainIds = () => ['8453', '1', '534352', '10'];

const getChainName = (chainId: string) => {
    switch(chainId) {
        case '8453': return "Base"; 
        case '534352': return "Scroll"; 
        case '10': return "Optimism"; 
        case '1': 
        default:
            return "Ethereum Mainnet";
    }
}
const getRPCUrl = (chainId: string) => {

}

// TODO replace ethers with thirdweb
const getProviderForChain = (chainId: string) => {
    const rpcUrl = getRPCUrl(chainId);
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  const connectToWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask or another wallet.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const newSigner = await provider.getSigner();

    return newSigner;
  };

  const ensureCampaignNetworkConnection = async (chainId: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    const supportedChainIds = getSupportedChainIds();

    // TODO bad logic. Should auto-switch to chain if possible.  If fails then throw error for switching. 
    if (!supportedChainIds.includes(network.chainId.toString())) {
      throw new Error(`Please switch to the ${getChainName(chainId)} network in your wallet.`);
    }

    return network.chainId;
  }

export default function useEthereum() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else {
        setSigner(await connectToWallet());
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const launch = async (campaign: Campaign, params: LaunchParams): Promise<void> => {
    try {
      const currentSigner = signer || await connectToWallet();

      const campaignABI = JSON.stringify(CampaignFactoryV1ContractABI);

      const creatorAddress = await currentSigner.getAddress();

      const chainId = await ensureCampaignNetworkConnection(campaign.chainId);

      if (!campaign.token) {
        throw new Error("Campaign is missing token setting");
      }

      if (!campaign.threshold) {
        throw new Error("Campaign is missing threshold setting");
      }

      if (!campaign.deadline) {
        throw new Error("Campaign is missing deadline setting");
      }

      if (new Date(campaign.deadline) < new Date()) {
        throw new Error("Campaign deadline must be in the future");
      }
      
      const tokenAddress = campaign.token;
      const tokenDecimals = getCurrencyTokenDecimals(campaign.chainId, campaign.token);
      const threshold = ethers.parseUnits(campaign.threshold.toString(), tokenDecimals);
      const deadline = Math.floor(new Date(campaign.deadline).getTime() / 1000)

    //   toast('Launching campaign...', { duration: 60000 });

      const campaignFactoryV1ContractAddress = getFactoryContract(chainId);
      const campaignFactory = new ethers.Contract(campaignFactoryV1ContractAddress, campaignABI, currentSigner);
      
      let campaignAddress = "";


    const transaction = await campaignFactory.createCampaignERC20(
        creatorAddress,
        tokenAddress,
        threshold,
        deadline
    );

        // toast.dismiss();
        // toast('Confirming transaction...', { duration: 60000 });

    const receipt = await transaction.wait();
    // TODO get campaign address from tx return data
    // TODO generate link and share as farcaster frame

    // const events = receipt.logs.map((log: Log) => campaignFactory.interface.parseLog(log));
    // const campaignCreatedEvent = events.find((log: LogDescription) => log && log.name === "CampaignERC20Created");
    // campaignAddress = campaignCreatedEvent.args.campaignAddress;

    //   toast.dismiss();
    //   toast.success(`Campaign launched!`);
    } catch (error: any) {
      console.error(error);
      const friendlyError = parseEthersError(error);
    //   toast.dismiss();
    //   toast.error(friendlyError);
      throw new Error("There is a problem launching the campaign")
    }
  };

  const contribute = async (amount: number, campaign: Campaign): Promise<void> => {
    try {
      const currentSigner = signer || await connectToWallet();
      const currentSignerAddress = await currentSigner.getAddress();
      const chainId = await ensureCampaignNetworkConnection(campaign.chainId);


      if (campaign.chainId && campaign.chainId !== chainId.toString()) {
        throw new Error(`This campaign is on a different network. Please switch to the ${getChainName(campaign.chainId)} network in your wallet.`);
      }

      const alreadyContributed = await getUserOrWalletCampaignContribution(campaign.name, currentSignerAddress);
      if (alreadyContributed) {
        throw new Error("You have already contributed to this campaign with this email or wallet. You can only contribute to this campaign once.")
      }

      const tokenDecimals = getCurrencyTokenDecimals(campaign.chainId, campaign.token);
      const contributeAmount = ethers.parseUnits(amount.toString(), tokenDecimals);

      let events = [];
      let transactionHash = "";
        const tokenInstance = new ethers.Contract(campaign.token, ERC20ABI, currentSigner);
        const allowance = await tokenInstance.allowance(currentSignerAddress, campaign.address);

        if (allowance < contributeAmount) {
        //   toast('Approving token for contribution...', { duration: 60000 });
          
          const approveTx = await tokenInstance.approve(campaign.address, contributeAmount);
          
        //   toast.dismiss();
        //   toast('Confirming transaction...', { duration: 60000 });

          await approveTx.wait();
        }

        // toast.dismiss();
        // toast('Sending contribution...', { duration: 60000 });

        const campaignABI = JSON.stringify(CampaignERC20V1ContractABI);
        const campaignInstance = new ethers.Contract(campaign.address!, campaignABI, currentSigner);
        const transaction = await campaignInstance.submitContribution(contributeAmount);
        
        // toast.dismiss()
        // toast('Confirming transaction...', { duration: 60000 });

        const receipt = await transaction.wait();

        events = receipt.logs.map((log: Log) => campaignInstance.interface.parseLog(log));
        transactionHash = transaction.hash;
      
      const contributionSubmittedEvent = events.find((log: LogDescription) => log && log.name === "ContributionSubmitted");
      const { actualSubmittedContribution } = contributionSubmittedEvent.args;
      const actualSubmittedContributionAmount = parseFloat(ethers.formatUnits(actualSubmittedContribution, tokenDecimals));

    //   await createCampaignApplication(chainId, campaign.name, campaignTier.id, actualSubmittedContributionAmount, formResponse?.id, transactionHash, currentSignerAddress);
      
    //   toast.dismiss();
    //   toast.success(`Contribution sent!`);
    } catch (error: any) {
      console.error(error);
      const friendlyError = parseEthersError(error);
    //   toast.dismiss();
    //   toast.error(friendlyError);
      throw error;
    }
  };

  const withdrawContribution = async (campaign: Campaign): Promise<void> => {
    try {
      const currentSigner = signer || await connectToWallet();
      const chainId = await ensureCampaignNetworkConnection(campaign.chainId);

      if (campaign.chainId && campaign.chainId !== chainId.toString()) {
        throw new Error(`This campaign is on a different network. Please switch to the ${getChainName(campaign.chainId)} network in your wallet.`);
      }

      const amount = getUserOrWalletCampaignContribution(campaign.name, currentSigner);

      const tokenDecimals = getCurrencyTokenDecimals(chainId, campaign.token);
      const contributeAmount = ethers.parseUnits(amount.toString(), tokenDecimals);

    //   toast('Withdrawing contribution...', { duration: 60000 });

      let campaignABI = "";

    campaignABI = JSON.stringify(CampaignERC20V1ContractABI);

      const campaignInstance = new ethers.Contract(campaign.address!, campaignABI, currentSigner);
      const transaction = await campaignInstance.withdrawContribution(contributeAmount);

    //   toast.dismiss();
    //   toast('Confirming transaction...', { duration: 60000 });
        
      const receipt = await transaction.wait();
      
    //   await withdrawCampaignApplication(application.id, transaction.hash);
      
    //   toast.dismiss();
    //   toast.success(`Contribution withdrawn!`);
    } catch (error: any) {
      console.error(error);
      const friendlyError = parseEthersError(error);
    //   toast.dismiss();
    //   toast.error(friendlyError);
    }
  };

  const isCampaignCompleted = async (campaign: Campaign) => {
    if (!campaign.chainId) {
      throw new Error("Campaign is not associated with a network. Pleased create a new campaign.");
    }

    const provider = getProviderForChain(campaign.chainId);

    const campaignABI = JSON.stringify(CampaignERC20V1ContractABI);

    const campaignInstance = new ethers.Contract(campaign.address, campaignABI, provider);
    const isCampaignCompleted = await campaignInstance.isCampaignCompleted();

    return isCampaignCompleted;
  }

  const isCampaignDeadlineExceeded = async (campaign: Campaign) => {
    if (!campaign.chainId) {
      throw new Error("Campaign is not associated with a network. Pleased create a new campaign.");
    }

    const provider = getProviderForChain(campaign.chainId);

    let campaignABI = "";


    campaignABI = JSON.stringify(CampaignERC20V1ContractABI);

    const campaignInstance = new ethers.Contract(campaign.address!, campaignABI, provider);
    const isCampaignDeadlineExceeded = await campaignInstance.isContributionDeadlineExceeded();

    return isCampaignDeadlineExceeded;
  }

  const getTotalContributions = async (campaign: Campaign) => {
    if (!campaign.chainId) {
      throw new Error("Campaign is not associated with a network. Pleased create a new campaign.");
    }

    const provider = getProviderForChain(campaign.chainId);

    let campaignABI = "";


    campaignABI = JSON.stringify(CampaignERC20V1ContractABI);

    const campaignInstance = new ethers.Contract(campaign.address!, campaignABI, provider);
    const totalContributions = await campaignInstance.totalContributions();

    const tokenDecimals = getCurrencyTokenDecimals(campaign.chainId, campaign.token);
    const total = parseFloat(ethers.formatUnits(totalContributions, tokenDecimals));

    return total;
  }

  const getContributionTransferred = async (campaign: Campaign) => {
    if (!campaign.chainId) {
      throw new Error("Campaign is not associated with a network. Pleased create a new campaign.");
    }

    const provider = getProviderForChain(campaign.chainId);

    let campaignABI = "";
    
    campaignABI = JSON.stringify(CampaignERC20V1ContractABI);

    const campaignInstance = new ethers.Contract(campaign.address!, campaignABI, provider);
    const contributionTransferred = await campaignInstance.contributionTransferred();

    const tokenDecimals = getCurrencyTokenDecimals(campaign.chainId, campaign.token);
    const transferred = parseFloat(ethers.formatUnits(contributionTransferred, tokenDecimals));

    return transferred;
  }

  return {
    connectToWallet,
    launch,
    contribute,
    withdrawContribution,
    getTotalContributions,
    getContributionTransferred,
    isCampaignCompleted,
    isCampaignDeadlineExceeded
  };
};

function parseEthersError(inputError: any) {
  let error = inputError;

  if (inputError.error && inputError.error.code && inputError.error.message) {
    error = inputError.error;
  }

  if (inputError.info && inputError.info.error && inputError.info.error.code && inputError.info.error.message) {
    error = inputError.info.error;

    if (error.data && error.data.code && error.data.message) {
      error = error.data;
    }
  }

  let userFriendlyMessage = error.message;

  if (error.code === 4001) {
      userFriendlyMessage = 'You have rejected the transaction request.';
  }
  else if (error.message && error.message.includes('insufficient funds')) {
      userFriendlyMessage = 'Insufficient funds.';
  }
  else if (error.message && error.message.includes('transfer amount exceeds balance')) {
    userFriendlyMessage = 'The transfer amount exceeds your balance.';
  }
  else if (error.message && error.message.includes('execution reverted')) {
      userFriendlyMessage = 'Transaction failed: the transaction was reverted by the EVM.';
  }
  else if (error.code === -32002) {
      userFriendlyMessage = 'Request already pending. Please check your wallet and approve or reject the previous request.';
  }
  else if (error.message && error.message.includes('contract target must be correctly configured')) {
      userFriendlyMessage = 'Please check that your wallet is on the correct network.';
  }
  else if (error.message && error.message.includes('invalid FixedNumber string value')) {
      userFriendlyMessage = 'The amount is invalid. Please check that the amount is not too small or too big.';
  }

  return userFriendlyMessage;
}