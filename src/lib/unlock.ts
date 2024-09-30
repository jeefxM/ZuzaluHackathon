import { useEffect, useState, useCallback } from "react";
import { useActiveWallet, useSendTransaction } from "thirdweb/react";
import {
    Address,
    defineChain,
    getContract,
    prepareContractCall,
    readContract,
} from "thirdweb";
import { ethereum, base } from "thirdweb/chains";
import { Wallet } from "thirdweb/wallets";

import ERC20ABI from "@abis/ERC20.json";

import { client as web3 } from "@/app/client";
import residentTicketData from "../../public/residentTickets.json";
import { ResidentTicketSale, SalesRegistry } from "@/lib/types";
import { POPUP_MULTISIG } from "./constants";

interface UnlockContext {
    purchase: (saleAdress: Address) => Promise<number>,
    getTotalSold: (saleAdress: Address) => Promise<number>,
    getCampaignData: (saleAddress: Address) => ResidentTicketSale | undefined
}

const getCampaignContract = (chainId: number, address: string) => {
    return getContract({
      client: web3,
      address,
      chain: defineChain({ id: chainId }),
      // abi: CampaignERC20V1ContractABI,
    });
  };

export const getTotalSold = async (saleAddress: Address): Promise<number> => {
    const saleData = residentTicketData[saleAddress] as ResidentTicketSale;
    if(!saleData) return Promise.reject({ error: 'invali sales contract '});

    const saleContract = await getContract({
        client: web3,
        chain: defineChain(Number(saleData.chainId)),
        address: saleAddress,
      });

    const val = await readContract({contract: saleContract, method: "function totalSupply() view returns (uint256)", params: []})
    return Number(val.toString());
}

/// @returns tokenId on sale contract
export const useUnlockProtocol = (): UnlockContext => {
    const wallet = useActiveWallet();
    const address = wallet?.getAccount()?.address;
    const { mutate: sendTransaction } = useSendTransaction();

    const purchase = useCallback(async (saleAddress: Address): Promise<number> => {
        if(!address) return Promise.reject({ error: 'No wallet connected' });

        const saleData = residentTicketData[saleAddress] as ResidentTicketSale;
        if(!saleData) return Promise.reject({ error: 'Invalid sales contract' });
        
        const erc20 = getContract({
            client: web3,
            chain: defineChain(Number(saleData.chainId)),
            address: saleData.token,
          });

        // TODO abstract out checkBalanceAndApproval to reuse in all protocols
        const balance = await readContract({
            contract: erc20,
            method: "function balanceOf(address owner) view returns (uint256)",
            params: [address!],
          });
          
          if (balance < BigInt(saleData.price)) {
            return Promise.reject({ error: 'Insufficient balance' })
          }

          
          const allowance = await readContract({
            contract: erc20,
            method:
              "function allowance(address owner, address spender) view returns (uint256)",
            params: [address!, saleAddress],
          });

          if (allowance < BigInt(saleData.price)) {
            const allowanceTx = prepareContractCall({
              contract: erc20,
              method: "function approve(address spender, uint256 amount)",
              params: [saleAddress, BigInt(saleData.price)],
            });
  
            sendTransaction(allowanceTx);
          }

          const transaction = prepareContractCall({
            contract: getCampaignContract(saleData.chainId, saleData.address),
            method:
              "function purchase(uint256[] _values, address[] _recipients, address[] _referrers, address[] _keyManagers, bytes[] _data) returns(uint256[])",
            params: [[BigInt(saleData.price)], [address], [POPUP_MULTISIG], [], []],
          });
  
          const tx = await sendTransaction(transaction);
  
          return getTotalSold(saleAddress); // assume total = last sold amount
    }, [])


    return {
        purchase,
        getTotalSold,
        getCampaignData: (saleAddress: Address) => residentTicketSales[saleAddress]
    }
}
