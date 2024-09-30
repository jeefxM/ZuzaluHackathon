import { Address, Chain } from "thirdweb";

export type CampaignStatus = "active" | "completed" | "expired";
// used for Fora and Unlock protocol
export interface ResidentTicketSale {
    "chainId": Chain["id"],
    "name": string,
    "address": Address,
    "description": string,
    "deadline": string,
    "location": string,
    "details": string, // url to event page e.g. zu.city
    "organizers": { [name: string]: string }, // url to profile
    "status": boolean, // true = ongoing, false = ended/cancelled

    "token": Address,
    "tokenDecimals": number,
    "tokenSymbol": string,
    "price"?: string,   // standard amount each resident pays. if null then pay what you want
    "threshold": string, // technically not used in unlock but still used for display
    "maximum": string
}

export interface SalesRegistry {
    [contract: Address]: ResidentTicketSale
}