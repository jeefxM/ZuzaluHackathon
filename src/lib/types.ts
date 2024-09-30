import { Address, Chain } from "thirdweb";

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

    "token": Address,
    "tokenDecimals": number,
    "tokenSymbol": string,
    "price": string,
    "threshold": string, // technically not used in unlock but still used for display
    "maximum": string
}

export interface SalesRegistry {
    [contract: Address]: ResidentTicketSale
}