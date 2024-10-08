export const LOOTERY_ETH_ADAPTER_ABI = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_wrappedTokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "whomst",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "JackpotSeeded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "looteryAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "whomst",
            type: "address",
          },
          {
            internalType: "uint8[]",
            name: "picks",
            type: "uint8[]",
          },
        ],
        internalType: "struct Lootery.Ticket[]",
        name: "tickets",
        type: "tuple[]",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "looteryAddress",
        type: "address",
      },
    ],
    name: "seedJackpot",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "wrappedToken",
    outputs: [
      {
        internalType: "contract IWETH9",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
