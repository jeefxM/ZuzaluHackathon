import { CONTRACT_ADDRESS, GRAPHQL_API } from "@/casino-config";
import { useSuspenseQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import type { Address } from "viem";

const ticketsQuery = gql`
  query tickets($gameId: String!, $whomst: String!) {
    tickets(where: { whomstId: $whomst, gameId: $gameId }) {
      items {
        tokenId
        picks
      }
    }
  }
`;

interface TicketsData {
  tickets: {
    items: {
      tokenId: string;
      picks: number[];
    }[];
  };
}

export function useTickets({
  address,
  gameId,
  apiEndpoint = GRAPHQL_API,
  lotteryId = CONTRACT_ADDRESS,
}: {
  address: Address | undefined;
  gameId: bigint | undefined;
  apiEndpoint?: string;
  lotteryId?: Address;
}) {
  console.log('useTickets', );
  
  const { data, ...rest } = useSuspenseQuery<TicketsData | null>({
    queryKey: [
      "tickets",
      { lotteryId, apiEndpoint, address, gameId: gameId?.toString() },
    ],
    queryFn: async () => {
      if (!address) return null;

      // return request(apiEndpoint, ticketsQuery, {
      //   gameId: `${lotteryId}-${gameId?.toString()}`,
      //   whomst: address,
      // });
      const data = request(apiEndpoint, ticketsQuery, {
        gameId: `${lotteryId}-${gameId?.toString()}`,
        whomst: address,
      }).then((res) => {
        console.log('ticket gql res', res);
        
      })
      .catch((err) => {
        console.log('ticket gql err', err);
        
      })
      return null;
    },
    retry: false,
  });

  const tickets = data?.tickets.items;

  return {
    ...rest,
    data,
    tickets,
  };
}
